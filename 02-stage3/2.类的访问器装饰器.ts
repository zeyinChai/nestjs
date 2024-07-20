function Logged(value, ctx) {
  console.log(value,'value',ctx, "ctx");
  const kind = ctx.kind;
  const name = ctx.name;
  if (kind === "getter" || kind === 'setter') {
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
  @Logged
  set x(agrs) {}
  @Logged
  get x() {
    return 1;
  }
}

let clazz = new Class()
clazz.x = 2
console.log(clazz.x);


export {};
