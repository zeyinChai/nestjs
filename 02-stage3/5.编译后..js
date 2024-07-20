// 类自动访问器装饰器是一种新的类元素类型
// 它在类的字段前 添加accessor关键字
// 自动访问器自动为字段创建getter和setter方法，并将默认值保存在一个私有的槽中

function logged(value, ctx) {
  console.log(value);
  console.log(ctx);
  if ((ctx.kind = "accessor")) {
    const { get, set } = value;
    return {
      get() {
        console.log(`get ${ctx.name}`);
        return get.call(this);
      },
      set(val) {
        console.log(`set ${ctx.name} to ${val}`);
        return set.call(this, val);
      },
      init(initialValue) {
        console.log(`initialValue ${ctx.name} to ${initialValue}`);
        return initialValue + 1;
      },
    };
  }
}

class Class {
  #x = initialX.call(this, 1);
  get x() {
    return this.#x;
  }
  set x(val) {
    this.#x = val;
  }
}
let { get: oldGet, set: oldSet } = Object.getOwnPropertyDescriptor(
  Class.prototype,
  "x"
);

let {
  get: newGet = oldGet,
  set: newSet = oldSet,
  init: initialX = (val) => val,
} = logged({ get: oldGet, set: oldSet }, { kind: "accessor", name: "x" });
Object.defineProperty(Class.prototype,'x', {
  set: newSet,
  get: newGet,
});

const clazz = new Class();

clazz.x;
clazz.x = 123;

