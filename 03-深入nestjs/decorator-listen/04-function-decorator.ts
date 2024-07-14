/**
 *
 * @param target 如果装饰的是类的静态方法，那么target就是类，如果实例成员，则是类的原型对象
 * @param propertyKey 装饰的是成员名称
 * @param descriptor 成员的属性描述符
 */
// 1.日志记录 aop切面编程
function Log(target, propertyKey, descriptor) {
//   console.log(target);
  // 获取老的函数
  const originalMethod = descriptor.value;
  // 重写原型上的属性(重写定义 add函数)
  descriptor.value = function (...args: any[]) {
    console.log("重写方法", propertyKey, "with args", args);
    const result = originalMethod.apply(this, args);
    console.log("result", result);
    return result;
  };
}
// 2.权限：在方法执行前 检查用户的权限
function Auth(target, propertyKey, descriptor) {
  // 获取老的函数
  const originalMethod = descriptor.value;
  // 重写原型上的属性(重写定义 add函数)
  descriptor.value = function (...args: any[]) {
    if (args[0] !== "001") {
      console.log("用户没有权限删除");
      return;
    }
    originalMethod.apply(this, args);
  };
  return descriptor;
}

class Calculator {
  @Log
  add(a: number, b: number) {
    return a + b;
  }
  @Auth
  delete(userId: string) {
    console.log("delete success");
  }
}
const obj = new Calculator();
obj.add(1, 2);
obj.delete("002");

export {};
