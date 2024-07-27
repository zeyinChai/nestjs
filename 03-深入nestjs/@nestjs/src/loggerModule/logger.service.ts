import { Injectable } from "../../common";

@Injectable()
export class UseValueService {
  log(message) {
    console.log("LoggerService", message);
  }
}

@Injectable()
export class UseFactory {
  log(message) {
    console.log("LoggerService", message);
  }
}

@Injectable()
export class LoggerService {
  constructor(private UseValueService: UseValueService) {}
  log(message) {
    console.log("LoggerService", message);
    // console.log(this.UseValueService);

    this.UseValueService.log("LoggerService 依赖 UseValueService");
  }
}
