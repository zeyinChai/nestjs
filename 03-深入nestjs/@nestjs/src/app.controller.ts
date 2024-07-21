import { Controller, Get } from "../common";
import { Inject } from "../common/inject.decorator";
import { LoggerService, UseFactory, UseValueService } from "./logger.service";

@Controller("/")
export class AppController {
  constructor(
    private loggerService: LoggerService,
    // private UseValueService: UseValueService
  ) {}
  @Get()
  index() {
    this.loggerService.log("index1");
    return "123";
  }
}
