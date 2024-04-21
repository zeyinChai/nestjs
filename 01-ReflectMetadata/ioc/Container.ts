import "reflect-metadata"; // 提供polyfill
import {
  ClassProvider,
  FactoryProvider,
  Provider,
  Token,
  ValueProvider,
  isClassProvider,
  isFactoryProvider,
  isValueProvider,
} from "./provider";
import { Type } from "./type";
const METADATA_INJECT_KEY = "METADATA_INJECT_KEY";
const DESIGN_PARAMTYPES = "design:paramtypes";
export class Container {
  public providers = new Map<Token<any>, Provider<any>>();
  // 注册提供者
  addProvider<T>(provider: Provider<T>) {
    this.providers.set(provider.provide, provider);
  }
  inject(type: Token<any>) {
    let provider: Provider<any> = this.providers.get(type);
    return this.injectWithProvider(type, provider);
  }
  injectWithProvider<T>(type: Token<any>, provider: Provider<T>) {
    if (provider === undefined) {
      throw new Error(`No Provider For type ${type}`);
    }
    if (isClassProvider(provider)) {
      return this.injectClass(provider);
    } else if (isValueProvider(provider)) {
      return this.injectValue(provider);
    } else if (isFactoryProvider(provider)) {
      return this.injectFactory(provider);
    } else {
      throw new Error(`provider ${type} is not supported`);
    }
  }
  injectClass<T>(provider: ClassProvider<T>): T {
    const target = provider.useClass;
    let params = this.getInjectedParams(target);
    return Reflect.construct(target, params);
  }
  // 从类上获取注入的参数
  getInjectedParams<T>(target: Type<T>) {
    let argTypes = <Array<Type<any> | undefined>>(
       // 用了装饰器 才能让design:paramtypes生效 所以需要injectable
      Reflect.getMetadata(DESIGN_PARAMTYPES, target) 
    );    
    if (argTypes === undefined) return [];
    // 把[Class,Class]转成[实例,实例]
    return argTypes.map((argType: Type<any>, index: number) => {
      const overrideToken = this.getInjectionToken(target, index);
      const actualToken = overrideToken === undefined ? argType : overrideToken;
      let provider = this.providers.get(actualToken);
      return this.injectWithProvider(actualToken, provider);
    });
  }
  // 兼容如果用户使用了@Inject的情况
  getInjectionToken(target, index) {
    return Reflect.getMetadata(
      METADATA_INJECT_KEY,
      target,
      "index-" + index
    ) as Token<any> | undefined;
  }
  injectValue<T>(provider: ValueProvider<T>): T {
    return provider.useValue;
  }
  injectFactory<T>(provider: FactoryProvider<T>): T {
    return provider.useFactory();
  }
}
