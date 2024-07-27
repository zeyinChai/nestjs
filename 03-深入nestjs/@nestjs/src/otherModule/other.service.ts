import { Injectable } from "../../common";
import { CommonService } from "../commonModule/common.service";

@Injectable()
export class OtherService {
  constructor(private CommonService: CommonService) {}
  log(message) {
    this.CommonService.log(message);
    console.log("OtherService", message);
  }
}
