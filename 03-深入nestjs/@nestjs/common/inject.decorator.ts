import "reflect-metadata";
import { INJECTED_TOKENS } from "./constant";

export function Inject(token: string): ParameterDecorator {
  return function (
    target: Function,
    propertyKey: string,
    parameterIndex: number
  ) {
    // 取出被注入到此类构造函数中的token数组
    const existingInjectedTokens =
      Reflect.getMetadata(INJECTED_TOKENS, target) ?? [];
    existingInjectedTokens[parameterIndex] = token;
    Reflect.defineMetadata(INJECTED_TOKENS, existingInjectedTokens, target);
  };
}
