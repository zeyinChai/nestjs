/**
 * 1.属性装饰器、方法装饰器、访问装饰器 它们是按照再类中出现的顺序从上到下依次执行
 * 2.类装饰器最后执行
 * 3.参数装饰器优先于方法装饰器 参数装饰器从右向左执行
 */

function ClassDec(target) {
  console.log("类装饰器");
}

function PropsDec(target, key) {
  console.log("属性装饰器");
}

function FnDec(target, key) {
  console.log("方法装饰器");
}

function ParamsDec(target, key, index) {
  console.log("参数装饰器");
}
@ClassDec
class Example {
  @PropsDec
  props: string;
  @FnDec
  method(@ParamsDec a: any) {}
}
