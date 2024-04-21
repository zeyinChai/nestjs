import "reflect-metadata";

interface Type<T> {
  new (...args: any[]): T;
}

class InjectionToken {
  constructor(public injectionIdentifier: string) {}
}
type Token<T> = Type<T> | InjectionToken;

const METADATA_INJECT_KEY = "METADATA_INJECT_KEY";
// 是一个参数装饰器工厂 会返回一个参数装饰器
function Inject(token: Token<any>) {
  return function (target: any, methodName: string, paramsIndex: number) {
    // target是GirlFriend paramsIndex是参数的索引
    // 定义这个元数据之后有什么用
    Reflect.defineMetadata(
      METADATA_INJECT_KEY,
      token,
      target,
      `index-${paramsIndex}`
    ); // 给GirlFriend.index-1.METADATA_INJECT_KEY = type
    return target;
    // Reflect.getMetadata(
    //   METADATA_INJECT_KEY,
    //   target,
    //   `index-${paramsIndex}`
    // ); // 就可以知道 类的构造函数 第几个参数上的token是什么
  };
}

class Car {}
class House {}
class GirlFriend {
  constructor(
    private car: Car,
    @Inject(new InjectionToken("house"))
    private house: House
  ) {}
}
console.log(Reflect.getMetadata(METADATA_INJECT_KEY, GirlFriend, `index-${1}`));
console.log(Reflect.getMetadata('design:paramtypes', GirlFriend));

