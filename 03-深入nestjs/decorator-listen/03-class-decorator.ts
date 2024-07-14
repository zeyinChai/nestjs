// 类装饰器
function LogClass(constructor: Function) {
  console.log("class Created", constructor);
}
@LogClass
class Person {
  constructor(public name: string) {}
}

// 类装饰器工厂 返回装饰器的函数，可以接受参数来控制类的行为
function logClassWithParams(message: string) {
  return function (constructor: Function) {
    console.log(constructor.name, message);
  };
}
@logClassWithParams("Class Created")
class Car {}
let temp: any = null;
// 拓展类的功能和方法
function AddTimestamp<T extends { new (...args: any[]): {} }>(constructor: T) {
  // 替换类的构造函数
  const Obj = class extends constructor {
    constructor(...args: any[]) {
      super(...args);
      console.log("执行1");
    }
    timestamp = new Date();
  };
  temp = Obj;
  return Obj;
}
interface Document {
  timestamp: Date;
}

@AddTimestamp
class Document {
  constructor(public title: string) {console.log("执行2");}
}
const doc = new Document("my document");

console.log((doc as any).__proto__ === temp.prototype);

console.log(doc.title);
console.log(doc.timestamp);

export {};
