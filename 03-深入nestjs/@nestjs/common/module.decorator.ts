import "reflect-metadata";

interface ModuleMetaData {
  controllers?: Function[];
  providers?: any[];
  exports?: any[];
  imports?: any[];
}
// 定义模块装饰器
export function Module(metadata: ModuleMetaData): ClassDecorator {
  return function (target: Function) {
    Reflect.defineMetadata("isModule", true, target);
    // 给模块类添加元数据 元数据名称为controllers 值是[AppController]这个类
    defineModule(target, metadata.controllers);
    Reflect.defineMetadata("controllers", metadata.controllers, target);
    defineModule(target, metadata.providers);
    Reflect.defineMetadata("providers", metadata.providers, target);
    Reflect.defineMetadata("exports", metadata.exports, target);
    Reflect.defineMetadata("imports", metadata.imports, target);
  };
}

export function defineModule(nestModule, target = []) {
  // 遍历target数组 为每个元素添加元数据
  target.forEach((target) => {
    Reflect.defineMetadata("module", nestModule, target);
  });
}


export function Global(){
  return (target:Function) => {
    Reflect.defineMetadata('global',true,target)
  }
}