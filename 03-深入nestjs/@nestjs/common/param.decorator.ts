import "reflect-metadata";

export const createParamDecorator = (keyOrFactory: string | Function) => {
  return (data?: any) =>
    function (target: any, properKey: string, paramIndex: number) {
      // 给控制器类的原型的propertyKey也就是handleRequest方法属性上添加元数据
      const exisitingParamters =
        Reflect.getMetadata("params", target, properKey) || [];
      if (keyOrFactory instanceof Function) {
        // 如果传过来的是装饰器函数的话
        exisitingParamters[paramIndex] = {
          paramIndex,
          key: "DecoratorFactory",
          data,
          factory: keyOrFactory,
        };
      } else {
        exisitingParamters[paramIndex] = {
          paramIndex,
          key: keyOrFactory,
          data,
        };
      }
      Reflect.defineMetadata(`params`, exisitingParamters, target, properKey);
    };
};

export const Requst = createParamDecorator("Request");
export const Req = createParamDecorator("Req");
export const Query = createParamDecorator("Query");
export const Headers = createParamDecorator("Headers");
export const Session = createParamDecorator("Session");
export const Params = createParamDecorator("Params");
export const Body = createParamDecorator("Body");
export const Response = createParamDecorator("Response");
export const Res = createParamDecorator("Res");
export const Next = createParamDecorator("Next");
