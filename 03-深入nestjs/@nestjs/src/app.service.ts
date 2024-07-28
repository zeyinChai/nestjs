import { Inject, Injectable } from "../common";
import { Config } from "./dynamicModule/dynamicConfig.module";

@Injectable()
export class AppService {
  constructor(@Inject("CONFIG") private readonly config: Config) {}
  getConfig() {
    return this.config;
  }
}
