import { Module } from "../common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DynamicConfigModule } from "./dynamicModule/dynamicConfig.module";
import { LoggerModule } from "./loggerModule/logger.module";
@Module({
  controllers: [AppController],
  imports: [LoggerModule, DynamicConfigModule.forRoot(456)],
  providers: [AppService],
})
export class AppModule {}
