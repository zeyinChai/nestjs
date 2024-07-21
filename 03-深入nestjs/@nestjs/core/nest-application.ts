import { Logger } from "./logger";
import express, {
  Express,
  Requst as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from "express";
import path from "path";
import { DESIGN_PARAMTYPES, INJECTED_TOKENS } from "../common";

export class NestApplication {
  // 在内部私有化一个express实例
  private readonly app: Express = express();
  private readonly providers = new Map();
  constructor(protected readonly module) {
    this.app.use(express.json()); // 用来把json格式的请求放到req.body
    this.app.use(express.urlencoded({ extends: true })); // 把form表单请求体对象放到req.body
    this.app.use((req, res, next) => {
      req.user = { name: "admin", role: "admin" };
      next();
    });
    this.initProviders(); // 注入providers
  }
  initProviders() {
    const providers = Reflect.getMetadata("providers", this.module) ?? [];
    for (const provider of providers) {
      if (provider.provide && provider.useClass) {
        // 如果注入的service里面有依赖其他也要解析
        const dependencies = this.resolveDependencies(provider.useClass);
        const classInstance = new provider.useClass(...dependencies);
        this.providers.set(provider.provide, classInstance);
      } else if (provider.provide && provider.useValue) {
        this.providers.set(provider.provide, provider.useValue);
      } else if (provider.provide && provider.useFactory) {
        const inject = provider.inject ?? [];
        const injectedValues = inject.map(this.getProviderByToken);
        this.providers.set(
          provider.provide,
          provider.useFactory(...injectedValues)
        );
      } else {
        // 如果注入的service里面有依赖其他也要解析
        const dependencies = this.resolveDependencies(provider);
        this.providers.set(provider, new provider(...dependencies));
      }
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
      const token = this.getProviderByToken(injectedTokens[index] ?? param);
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
  private getProviderByToken = (injectedToken) => {
    return this.providers.get(injectedToken) ?? injectedToken;
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
    await this.init();
    this.app.listen(port, () => {
      Logger.log(
        `application is running on http://localhost:${port}`,
        "NestApplication"
      );
    });
  }
}
