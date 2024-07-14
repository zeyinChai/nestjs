import "reflect-metadata";

interface ControllerOptions {
  prefix?: string;
}
// 函数重载
export function Controller(): ClassDecorator; // 空字符串
export function Controller(prefix: string): ClassDecorator; // 路由前缀
export function Controller(options: ControllerOptions): ClassDecorator; // 对象
export function Controller(
  prefixOrOptions?: string | ControllerOptions
): ClassDecorator {
  let options: ControllerOptions = {};
  if (typeof prefixOrOptions === "string") {
    options.prefix = prefixOrOptions;
  } else if (typeof prefixOrOptions === "object") {
    options = prefixOrOptions;
  }
  //   类装饰
  return function (target: Function) {
    // 给控制器类添加prefix路径前缀的元数据
    Reflect.defineMetadata("prefix", options.prefix || "", target);
  };
}
