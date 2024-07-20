function logged(value, ctx) {
  console.log(value, ctx);
  const kind = ctx.kind;
  const name = ctx.name;
  if (kind === "field") {
    return function (initialValue) {
      console.log(`initializing ${name} with value ${initialValue}`);
      return initialValue + 1;
    };
  }
}

class Class {
  @logged private x = 1;
}
// console.log(Class.x);

export {};
