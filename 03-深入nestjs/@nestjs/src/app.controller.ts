import { Controller, Get } from "../common";
import { CommonService } from "./commonModule/common.service";
import { LoggerService } from "./loggerModule/logger.service";
import { OtherService } from "./otherModule/other.service";

@Controller("/")
export class AppController {
  constructor(
    private loggerService: LoggerService, // private UseValueService: UseValueService
    private CommonService: CommonService,
    private OtherService: OtherService
  ) {}
  @Get()
  index() {
    this.loggerService.log("index1");
    return "123";
  }
  @Get("common")
  common() {
    this.CommonService.log("hello");
    return "common";
  }
  @Get("other")
  other() {
    this.OtherService.log("hello");
    return 'other'
  }
}
