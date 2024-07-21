import "reflect-metadata";

interface ModuleMetaData {
  controllers?: Function[];
  providers?: any[];
}
// 定义模块装饰器
export function Module(metadata: ModuleMetaData): ClassDecorator {
  return function (target: Function) {
    // 给模块类添加元数据 元数据名称为controllers 值是[AppController]这个类
    Reflect.defineMetadata("controllers", metadata.controllers, target);
    Reflect.defineMetadata("providers", metadata.providers, target);
  };
}
