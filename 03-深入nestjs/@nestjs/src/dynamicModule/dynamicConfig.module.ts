import { DynamicModule, Module } from "../../common";

export interface Config {
  apiKey: string;
}

@Module({
  providers: [
    {
      provide: "PREFIX",
      useValue: "prefix",
    },
  ],
  exports: ["PREFIX"],
})
// 动态模块
export class DynamicConfigModule {
  static forRoot(apiKey): DynamicModule | Promise<DynamicModule> {
    const providers = [
      {
        provide: "CONFIG",
        useValue: { apiKey },
      },
    ];
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          module: DynamicConfigModule,
          providers,
          exports: providers.map((provider) =>
            provider instanceof Function ? provider : provider.provide
          ),
        });
      }, 3000);
    });
  }
}
