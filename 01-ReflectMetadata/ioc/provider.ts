/**
 export interface Type<T> {
  new (...args: any[]): T;
}
 */
import { Type } from "./type";

// 针对字符串类型的token我们编写了一个InjectionToken
export class InjectionToken {
  constructor(public injectionIdentifier: string) {}
}

export type Token<T> = Type<T> | InjectionToken;

export interface BaseProvider<T> {
  provide: Token<T>;
}
export interface ClassProvider<T> extends BaseProvider<T> {
  useClass: Type<T>;
}
export interface ValueProvider<T> extends BaseProvider<T> {
  useValue: T;
}
export interface FactoryProvider<T> extends BaseProvider<T> {
  useFactory: () => T;
}
// provider有三种情况
export type Provider<T> = ClassProvider<T> | ValueProvider<T> | FactoryProvider<T>

// 自定义类型保护
export function isClassProvider<T>(provider:BaseProvider<T>):provider is ClassProvider<T>{
  return (provider as any).useClass != undefined
}
export function isValueProvider<T>(provider:BaseProvider<T>):provider is ValueProvider<T>{
  return (provider as any).useValue != undefined
}
export function isFactoryProvider<T>(provider:BaseProvider<T>):provider is FactoryProvider<T>{
  return (provider as any).useFactory != undefined
}