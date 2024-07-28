import { Controller, Get } from "../common";
import { AppService } from "./app.service";
import { LoggerService } from "./loggerModule/logger.service";

@Controller("/")
export class AppController {
  constructor(
    private loggerService: LoggerService, // private UseValueService: UseValueService
    private AppService: AppService
  ) {}
  @Get()
  index() {
    this.loggerService.log("index1");
    return "123";
  }
  @Get('/config')
  getConfig() {
    return JSON.stringify(this.AppService.getConfig());
  }
}
