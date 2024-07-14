import { Logger } from "./logger";
import express, {
  Express,
  Requst as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from "express";
import path from "path";

export class NestApplication {
  // 在内部私有化一个express实例
  private readonly app: Express = express();
  constructor(protected readonly module) {
    this.app.use(express.json()); // 用来把json格式的请求放到req.body
    this.app.use(express.urlencoded({ extends: true })); // 把form表单请求体对象放到req.body
    this.app.use((req, res, next) => {
      req.user = { name: "admin", role: "admin" };
      next();
    });
  }
  use(middleware) {
    this.app.use(middleware);
  }
  //   配置初始化工作
  async init() {
    // 取出模块里所有的控制器controllers 然后最好路由配置
    const controllers = Reflect.getMetadata("controllers", this.module) || [];
    for (const Controller of controllers) {
      const controller = new Controller();
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
      const ctx = { // 因为nestjs不但支持http 还支持graphql 微服务
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
          return factory(data,ctx);
        default:
          return null;
      }
    });
  }
  private getResponseMetadata(controller, methodName) {
    const paramsMetaData = Reflect.getMetadata(
      "params",
      controller,
      methodName
    );
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
