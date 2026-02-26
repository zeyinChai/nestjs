## 如何使用stage3的装饰器

- typescript 5.x就是stage的新写法了
- 关闭"experimentalDecorators"和emitDecoratorMetadata

## 1.代码提示

- 这个指的是智能代码补全的功能，还可以错误检查靠的是tsServer
- tsServer只是一个服务 内部会调sdk进行检查

在 TypeScript 开启 emitDecoratorMetadata 后，只要类或其成员存在装饰器，编译器就会生成 design:paramtypes 元数据。NestJS 正是通过 Reflect.getMetadata("design:paramtypes", Class) 读取构造函数参数类型，从而实现依赖注入
