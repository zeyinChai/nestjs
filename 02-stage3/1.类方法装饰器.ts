import "reflect-metadata";
// 老装饰器 1个参数 新装饰器2个参数
// function Log(value, ctx) {
//   console.log(value, ctx);
// }

type ClassMethodDecorator = (
  value: Function,
  context: {
    kind: "method"; // 被装饰的值的类型 可以是 class method getter setter field accessor
    name: string; // 被装饰的值的名称
    static: boolean; // 表示值是否是静态属性
    private: boolean; // 表示是否是私有的类元素
  }
) => Function | void;

function Logged(value, ctx) {
  console.log(ctx, "ctx");
  const kind = ctx.kind;
  const name = ctx.name;
  if (kind === "method") {
    return function (...args) {
      // 返回一个函数相当于把方法重写了
      console.log(`starting ${name} with arguments ${args.join(",")}`);
      const result = value.call(this, ...args);
      console.log(`end ${name}`);
      return result;
    };
  }
}

// @Log
class Person {
  @Logged
  sum(a, b) {
    return a + b;
  }
}
new Person().sum(1, 2);
