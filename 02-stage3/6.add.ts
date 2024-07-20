/**
 * addInitializer
 * 允许在类或类成员完成定义后运行额外的初始化逻辑的函数
 */
function withLogging(value, ctx) {
  console.log(ctx);
  if (ctx.kind === "class") {
    ctx.addInitializer(function(){
        console.log('addInitializer');
    })
  }
}
@withLogging
class MyClass {
  constructor() {
    console.log("constructor");
  }
}
