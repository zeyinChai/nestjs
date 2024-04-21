import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import {
  LoggerService,
  UseValueLoggerService,
  UseFactoryLoggerService,
  UseValueLoggerServiceStringToken
} from "./logger.service";

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: LoggerService, // token类型 标识
      useClass: LoggerService, // 注册是一个类
    },
    {
      provide: UseValueLoggerService,
      useValue: new UseValueLoggerService(),
    },
    {
      provide: UseFactoryLoggerService,
      useFactory: () => new UseFactoryLoggerService(),
    },
    {
      provide: "StringToken",// token标识符
      useValue: new UseValueLoggerServiceStringToken(),
    },
  ],
})
export class AppModule {}
