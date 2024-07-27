import { Injectable } from "../../common";

@Injectable()
export class CommonService {
  log(message) {
    console.log("CommonService", message);
  }
}
