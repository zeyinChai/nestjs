/**
 * 在ts里面emitDecoratorMetadata生成元数据主要有三种
 * design:type 用于属性的类型元数据
 * design:paramtypes 用于构造函数或方法参数的类型元数据
 * design:returntype 用于方法的返回类型元数据
 * 在vscode里写代码的时候关于ts的处理分为
 * tsServer和tsCompiler
 * 语法检查用的是tsServer
 * 编译的时候用是tsCompiler
 */
import "reflect-metadata";

function classDecorator(target) {}
function paramDecorator(target, propertyKey, parametorIndex) {}
function propDecorator(target, propertyKey) {}
function methodDecorator(target, propertyKey, descriptor) {}
@classDecorator
class ExampleClass {
  @propDecorator
  myProperty: string;
  constructor(
    @paramDecorator serviceA: string,
    @paramDecorator setviceB: string
  ) {}
  @methodDecorator
  myMethod(): string {
    return "hello";
  }
}

// 获取属性类型
const propertyType = Reflect.getMetadata(
  "design:type",
  ExampleClass.prototype,
  "myProperty"
);
console.log("propertyType", propertyType); // [Function: String]

const paramType = Reflect.getMetadata("design:paramtypes", ExampleClass);
console.log("paramType", paramType);
