import "reflect-metadata";

class MyClass {
  private myProperty: string;
  constructor(value: string) {
    this.myProperty = value;
  }
  // 这样赋值是给MyClass的prototype的myMethod进行元数据的设置
  // 所以Reflect.getOwnMetadata("customKey", instance, "myMethod");拿不到数据
  // 只能Reflect.getMetadata("customKey", instance, "myMethod");拿数据
  // 或Reflect.getMetadata("customKey", instance, "myMethod");
  @Reflect.metadata("customKey", "customValue")
  myMethod() {
    console.log("executing myMethod");
  }
}
const instance = new MyClass("hello");
// 给instance的myProperty定义元数据
Reflect.defineMetadata("key1", "value1", instance, "myProperty");
// 检查是否具有指定的元数据
const hasMetaData = Reflect.hasMetadata("key1", instance, "myProperty");
console.log("hasMetaData key1 for myProperty", hasMetaData);
// 获取
const getMetaData = Reflect.getMetadata("customKey", instance, "myMethod");
console.log("getMetaData key1 for myProperty", getMetaData);
// 获取自有元数据(只能获取自己的，不会从原型链上找)
const getOwnMetaData = Reflect.getOwnMetadata(
  "customKey",
  instance,
  "myMethod"
);
console.log("getMetaData key1 for myProperty", getOwnMetaData);
const getOwnMetaData2 = Reflect.getMetadata("customKey", Reflect.getPrototypeOf(instance), "myMethod");
console.log("getMetaData2 key1 for myProperty", getOwnMetaData2);
