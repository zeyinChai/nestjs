import { Logger } from "./logger";
import express, {
  Express,
  Requst as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from "express";
import path from "path";
import {
  defineModule,
  DESIGN_PARAMTYPES,
  INJECTED_TOKENS,
  RequestMethod,
} from "../common";

export class NestApplication {
  // 在内部私有化一个express实例
  private readonly app: Express = express();
  private readonly providerInstances = new Map();
  private readonly globalProviders = new Set();
  private readonly moduleProviders = new Map();
  private readonly middleware = [];
  constructor(protected readonly module) {
    this.app.use(express.json()); // 用来把json格式的请求放到req.body
    this.app.use(express.urlencoded({ extends: true })); // 把form表单请求体对象放到req.body
    this.app.use((req, res, next) => {
      req.user = { name: "admin", role: "admin" };
      next();
    });
  }
  initMiddlewares() {
    this.module.prototype.configure?.(this);
  }
  apply(...middleware) {
    defineModule(this.module, middleware);
    this.middleware.push(...middleware);
    return this;
  }
  forRoutes(...routes) {
    for (const route of routes) {
      for (const middleware of this.middleware) {
        const { routePath, routeMethod } = this.normalizeRouteInfo(route);
        this.app.use(routePath, (req, res, next) => {
          if (routeMethod === req.method) {
            const middlewareInstance = this.getMiddlewareInstance(middleware);
            middlewareInstance.use(req, res, next);
          } else {
            next();
          }
        });
      }
    }
  }
  private getMiddlewareInstance(middleware) {
    if (middleware instanceof Function) {
      const dependencies = this.resolveDependencies(middleware);
      return new middleware(...dependencies);
    }
    return middleware;
  }
  private normalizeRouteInfo(route) {
    let routePath = "";
    let routeMethod = RequestMethod.GET;
    if (typeof route === "string") {
      routePath = route;
    } else if ("path" in route) {
      routePath = route.path;
      routeMethod = route.method ?? RequestMethod.GET;
    }
    routePath = path.posix.join("/", route);
    return {
      routePath,
      routeMethod,
    };
  }
  async initProviders() {
    // 拿到appModule身上的imports
    const imports = Reflect.getMetadata("imports", this.module) ?? [];
    // 遍历所有导入的模块
    for (const importModule of imports) {
      let importedModule = importModule;
      // 如果引入的module是一个promise说明是个异步模块
      if (importModule instanceof Promise) {
        importedModule = await importedModule;
      }
      // 如果导入的模块有module属性说明是一个动态模块
      if ("module" in importedModule) {
        const { module, providers, exports, controllers } = importedModule;
        const oldProviders = Reflect.getMetadata("providers", module);
        const oldControllers = Reflect.getMetadata("controllers", module);
        const oldExports = Reflect.getMetadata("exports", module);
        const newProviders = [...(oldProviders ?? []), ...(providers ?? [])];
        const newExports = [...(oldExports ?? []), ...(exports ?? [])];
        const newControllers = [
          ...(oldControllers ?? []),
          ...(controllers ?? []),
        ];
        defineModule(module, newProviders);
        defineModule(module, newControllers);
        Reflect.defineMetadata("providers", newProviders, module);
        Reflect.defineMetadata("controllers", newControllers, module);
        Reflect.defineMetadata("exports", newExports, module);
        this.registerProvidersFromModule(module, this.module);
      } else {
        this.registerProvidersFromModule(importedModule, this.module);
      }
    }
    // 获取当前模块提供者的元数据
    const providers = Reflect.getMetadata("providers", this.module) ?? [];
    for (const provider of providers) {
      this.addProvider(provider, this.module);
    }
  }
  private registerProvidersFromModule(module, ...parentModules) {
    // 获取导入的是不是全局模块
    const global = Reflect.getMetadata("global", module);
    const importedProviders = Reflect.getMetadata("providers", module) ?? []; // 拿到导入模块身上的providers
    const exports = Reflect.getMetadata("exports", module) ?? []; // 拿到导入模块身上的exports
    // 遍历exports
    for (const exportToken of exports) {
      // exports可能导出的是个module
      if (this.isModule(exportToken)) {
        // 递归操作
        this.registerProvidersFromModule(exportToken, module, ...parentModules);
      } else {
        const provider = importedProviders.find(
          (provider) =>
            provider === exportToken || provider.provide === exportToken
        );
        if (provider) {
          [module, ...parentModules].forEach((module) => {
            this.addProvider(provider, module, global);
          });
        }
      }
    }
  }
  private isModule(exportToken) {
    return (
      exportToken &&
      exportToken instanceof Function &&
      Reflect.getMetadata("isModule", exportToken)
    );
  }
  addProvider(provider, module, global = false) {
    // 每个module模块对应的provider的token
    const providers = global
      ? this.globalProviders
      : this.moduleProviders.get(module) || new Set();
    if (!this.moduleProviders.has(module)) {
      this.moduleProviders.set(module, providers);
    }
    // 获取要注册的provider的token
    const injectedToken = provider.provide ?? provider;
    if (this.providerInstances.has(injectedToken)) {
      providers.add(injectedToken);
      return;
    }
    // 为了避免循环依赖 每次添加前做一个判断如果map中已经存在则直接返回
    // const injectToken = provider.provide ?? provider;
    // if (this.providerInstances.has(injectToken)) return;
    if (provider.provide && provider.useClass) {
      const Clazz = provider.useClass;
      // 解析这个类constructor里的参数
      const dependencies = this.resolveDependencies(Clazz);
      const value = new Clazz(...dependencies);
      this.providerInstances.set(provider.provide, value);
      providers.add(provider.provide);
    } else if (provider.provide && provider.useValue) {
      this.providerInstances.set(provider.provide, provider.useValue);
      providers.add(provider.provide);
    } else if (provider.provide && provider.useFactory) {
      const inject = provider.inject ?? [];
      const injectedValues = inject.map((injectToken) =>
        this.getProviderByToken(injectToken, module)
      );
      const value = provider.useFactory(...injectedValues);
      this.providerInstances.set(provider.provide, value);
      providers.add(provider.provide);
    } else {
      // 解析这个类constructor里的参数
      const dependencies = this.resolveDependencies(provider);
      const value = new provider(...dependencies);
      this.providerInstances.set(provider, value);
      providers.add(provider);
    }
  }
  use(middleware) {
    this.app.use(middleware);
  }
  private resolveDependencies(CLazz) {
    // 取得使用了Inject装饰器 注入的参数
    const injectedTokens = Reflect.getMetadata(INJECTED_TOKENS, CLazz) ?? [];
    // 取得构造函数普通service的参数
    const constructorParams =
      Reflect.getMetadata(DESIGN_PARAMTYPES, CLazz) ?? [];
    const result = constructorParams.map((param, index) => {
      const module = Reflect.getMetadata("module", CLazz);
      const token = this.getProviderByToken(
        injectedTokens[index] ?? param,
        module
      );
      // 把每个params的token默认转换成对应的provider
      return token;
    });
    return result;
  }
  //   配置初始化工作
  async init() {
    // 取出模块里所有的控制器controllers 然后最好路由配置
    const controllers = Reflect.getMetadata("controllers", this.module) || [];
    for (const Controller of controllers) {
      // 解析出控制器中依赖的service
      const dependencies = this.resolveDependencies(Controller);
      // 创建控制器实例
      const controller = new Controller(...dependencies);
      // 获取控制器的路径前缀
      const prefix = Reflect.getMetadata("prefix", Controller) || "/";
      // 开始解析路由
      Logger.log(`${Controller.name} {${prefix}}`, `RoutesResolver`);
      const controllerPrototype = Controller.prototype;
      // 拿到类身上的方法名
      for (const methodName of Object.getOwnPropertyNames(
        controllerPrototype
      )) {
        const method = controllerPrototype[methodName];
        // 取到此函数式绑定的请求方法的元数据
        const httpMethod = Reflect.getMetadata("method", method); // GET POST
        // 取到此函数式绑定的请求路径的元数据
        const pathMetaData = Reflect.getMetadata("path", method);
        const redirectUrl = Reflect.getMetadata("redirectUrl", method);
        const redirectStatusCode = Reflect.getMetadata(
          "redirectStatusCode",
          method
        );
        if (!httpMethod) continue;
        // 拼出完整的路径
        const routePath = path.posix.join("/", prefix, pathMetaData);
        // 注册路由
        this.app[httpMethod.toLowerCase()](
          routePath,
          (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
            const args = this.resolveParams(
              controller,
              methodName,
              req,
              res,
              next
            );
            // 执行controller的函数后返回给客户端结果
            const result = method.call(controller, ...args);
            if (result?.url) {
              return res.redirect(result?.statusCode || 302, result?.url);
            }
            // 如果需要重定向则直接重定向到redirect指定的url地址
            if (redirectUrl) {
              return res.redirect(redirectStatusCode || 302, redirectUrl);
            }
            if (httpMethod === "POST") {
              res.statusCode = 201;
            }
            // 判断controller的methodname有没有response装饰器 如果用了就不能自动发响应
            const responseMedata = this.getResponseMetadata(
              controller,
              methodName
            );
            if (!responseMedata || responseMedata?.data?.passthrough)
              res.send(result);
          }
        );
        Logger.log(
          `Mapped {${routePath}, ${httpMethod}} route`,
          `RoutesResolver`
        );
      }
    }
    Logger.log(`Nest application successfully started`, "NestApplication");
  }
  private getProviderByToken = (injectedToken, module) => {
    if (
      this.moduleProviders.get(module)?.has(injectedToken) ||
      this.globalProviders.has(injectedToken)
    ) {
      return this.providerInstances.get(injectedToken);
    } else {
      return null;
    }
  };
  private resolveParams(
    instance: any,
    methodName: string,
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) {
    const paramsMetaData =
      Reflect.getMetadata("params", instance, methodName) || [];
    return paramsMetaData.map((paramMetaData) => {
      const { key, data, factory } = paramMetaData;
      const ctx = {
        // 因为nestjs不但支持http 还支持graphql 微服务
        switchToHttp() {
          return {
            getRequest: () => req,
            getResponse: () => res,
            getNext: () => next,
          };
        },
      };
      switch (key) {
        case "Request":
        case "Req":
          return req;
        case "Query":
          return data ? req.query[data] : req.query;
        case "Headers":
          return data ? req.headers[data] : req.headers;
        case "Session":
          return data ? req.session[data] : req.session;
        case "Params":
          return data ? req.params[data] : req.params;
        case "Body":
          return data ? req.body[data] : req.body;
        case "Res":
        case "Response":
          return res;
        case "Next":
          return next;
        case "DecoratorFactory":
          return factory(data, ctx);
        default:
          return null;
      }
    });
  }
  private getResponseMetadata(controller, methodName) {
    const paramsMetaData =
      Reflect.getMetadata("params", controller, methodName) ?? [];
    return paramsMetaData
      .filter(Boolean)
      .find(
        (parma) =>
          parma.key === "Response" ||
          parma.key === "Res" ||
          parma.key === "Next"
      );
  }
  async listen(port) {
    await this.initProviders(); // 注入providers
    await this.initMiddlewares(); // 初始化中间件
    await this.init();
    this.app.listen(port, () => {
      Logger.log(
        `application is running on http://localhost:${port}`,
        "NestApplication"
      );
    });
  }
}
