import "reflect-metadata";
// 参数装饰器
// 实现在方法调用时 验证参数的值
const REQUIRED_PARAMETERS = "REQUIRED_PARAMETERS";
/**
 *
 * @param target 装饰的目标对象
 * @param propertyKey 参数所属的方法名称
 * @param parameterIndex 参数索引
 */
function Valite(target: any, propertyKey: string, parameterIndex) {
  const existing: number[] =
    Reflect.getOwnMetadata(REQUIRED_PARAMETERS, target, propertyKey) || [];
  existing.push(parameterIndex);
  Reflect.defineMetadata(REQUIRED_PARAMETERS, existing, target, propertyKey);
}

function ValiteParams(target: any, propertyKey: string, descriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    const existing: number[] =
      Reflect.getOwnMetadata(REQUIRED_PARAMETERS, target, propertyKey) || [];
    for (let parameterIndex of existing) {
      if (args[parameterIndex] === undefined) {
        throw Error(`${propertyKey}的第${parameterIndex + 1}参数不能为undefined`);
      }
    }
    return originalMethod.apply(this, args);
  };
}
class User {
  constructor(private name: string, private age: number) {}
  @ValiteParams
  setName(@Valite newName: string, @Valite age: number) {
    this.name = newName;
  }
}

const user = new User("zs", 18);
user.setName("ls", undefined);
user.setName(undefined, undefined);
