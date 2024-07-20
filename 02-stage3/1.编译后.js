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

class Person {
  sum(a, b) {
    return a + b;
  }
}

Person.prototype.sum =
  Logged(Person.prototype.sum, {
    kind: "method",
    name: "sum",
  }) ?? Person.prototype.sum; // 如果Logged返回值是个函数就代替之前的sum
