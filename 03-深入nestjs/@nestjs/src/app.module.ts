import { Module } from "../common";
import { AppController } from "./app.controller";
import { CommonModule } from "./commonModule/common.module";
import { LoggerModule } from "./loggerModule/logger.module";
import { OtherModule } from "./otherModule/other.module";
@Module({
  controllers: [AppController],
  imports: [LoggerModule, CommonModule, OtherModule],
})
export class AppModule {}
