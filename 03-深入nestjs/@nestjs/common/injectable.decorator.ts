import 'reflect-metadata'

export function Injectable():ClassDecorator{
    return function(target:Function){
        // 给类添加一个元数据 数据名为injectable 值为true
        Reflect.defineMetadata('injectable',true,target)
    }
}