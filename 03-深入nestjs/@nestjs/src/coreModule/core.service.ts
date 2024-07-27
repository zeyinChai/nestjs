



import { Injectable } from "../../common";

@Injectable()
export class CoreService {
  log(message) {
    console.log("CoreService", message);
  }
}
