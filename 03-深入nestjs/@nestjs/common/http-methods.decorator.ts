import "reflect-metadata";

export function Get(path: string = ""): MethodDecorator {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    // 给函数定义元数据path
    Reflect.defineMetadata("path", path, descriptor.value);
    //  给函数定义元数据method
    Reflect.defineMetadata("method", "GET", descriptor.value);
  };
}

export function Post(path: string = ""): MethodDecorator {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    // 给函数定义元数据path
    Reflect.defineMetadata("path", path, descriptor.value);
    //  给函数定义元数据method
    Reflect.defineMetadata("method", "POST", descriptor.value);
  };
}

export function Redirect(
  url: string = "",
  statusCode: number = 302
): MethodDecorator {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata("redirectUrl", url, descriptor.value);
    Reflect.defineMetadata("redirectStatusCode", statusCode, descriptor.value);
  };
}
