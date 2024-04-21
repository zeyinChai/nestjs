import { Injectable, Inject } from "@nestjs/common";
import {
  LoggerService,
  UseFactoryLoggerService,
  UseValueLoggerService,
  UseValueLoggerServiceStringToken,
} from "./logger.service";

// 可被注入别的服务
@Injectable()
export class AppService {
  constructor(
    private loggerService: LoggerService,
    private useFactoryLoggerService: UseFactoryLoggerService,
    private useValueLoggerService: UseValueLoggerService,
    // 在app.module的providers找不到token为UseValueLoggerServiceStringToken
    //      所以需要用Inject说明token是StringToken
    @Inject("StringToken")
    private useValueLoggerServiceStringToken: UseValueLoggerServiceStringToken
  ) {}
  getHello() {
    this.loggerService.log("在appservice注入并调用loggerService");
    this.useFactoryLoggerService.log(
      "在appservice注入并调用useFactoryLoggerService"
    );
    this.useValueLoggerService.log(
      "在appservice注入并调用useValueLoggerService"
    );
    this.useValueLoggerServiceStringToken.log(
      "在appservice注入并调用useValueLoggerServiceStringToken"
    );
    return "hello";
  }
}
