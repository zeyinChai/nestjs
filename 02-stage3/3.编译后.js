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
const initializingX = logged(undefined, { kind: "field", name: "x" });

class Class {
  x = initializingX.call(this, 1);
}

new Class().x