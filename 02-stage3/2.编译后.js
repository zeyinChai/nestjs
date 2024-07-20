function Logged(value, ctx) {
  console.log(value, "value", ctx, "ctx");
  const kind = ctx.kind;
  const name = ctx.name;
  if (kind === "getter" || kind === "setter") {
    return function (...args) {
      // 返回一个函数相当于把方法重写了
      console.log(`starting ${name} with arguments ${args.join(",")}`);
      const result = value.call(this, ...args);
      console.log(`end ${name}`);
      return result;
    };
  }
}
class Class {
  set x(agrs) {}
  get x() {
    return 1;
  }
}

// 获取类的原型上的get和set方法
let { set, get } = Object.getOwnPropertyDescriptor(Class.prototype, "x");

set = Logged(set, { kind: "setter", name: "x" });
get = Logged(get, { kind: "setter", name: "x" });
Object.defineProperty(Class.prototype, "x", {
  get,
  set,
});

let clazz = new Class()
clazz.x = 2
console.log(clazz.x);
