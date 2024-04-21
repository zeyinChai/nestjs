import "reflect-metadata"; // 提供polyfill

let target = {};
// Reflect.defineMetadata不会修改对象本身
Reflect.defineMetadata("name", "test", target); // 给target添加key为name值为test
console.log(Reflect.getOwnMetadata("name", target));

Reflect.defineMetadata("name", "word", target, "hello"); // 给target.hello添加一个key为name值为word
console.log(Reflect.getOwnMetadata("name", target, "hello"));

// decorator
// @Reflect.metadata("name", "Person") // 给类本身增加元数据
@classMetaData("name", "Person")
class Person {
  //   @Reflect.metadata("name", "123") // 给类的原型的hello增加元数据
  @methodMetaData("name", "123")
  hello(): string {
    return "world";
  }
}
console.log(Reflect.getMetadata("name", Person), "###########");
console.log(Reflect.getMetadata("name", Person.prototype, "hello"), "$$$$$$$");

// 原理实现
function classMetaData(key, value) {
  return function (target) {
    Reflect.defineMetadata(key, value, target);
  };
}
function methodMetaData(key, value) {
  return function (target, properytName) {
    console.log(target, properytName, "--------------");
    // console.log(target === Person.prototype); // true
    // target参数是类的原型
    // target.properytName.key = value
    // Person.prototype.hello.name = '123'
    Reflect.defineMetadata(key, value, target, properytName);
  };
}
