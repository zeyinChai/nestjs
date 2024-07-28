import { Module, NestModule,MiddlewareConsumer } from "../common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DynamicConfigModule } from "./dynamicModule/dynamicConfig.module";
import { LoggerModule } from "./loggerModule/logger.module";
import { LoggerMiddleware } from "./middware/logger.middware";
@Module({
  controllers: [AppController],
  imports: [LoggerModule, DynamicConfigModule.forRoot(456)],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 针对/config应用middleware中间件
    consumer.apply(LoggerMiddleware).forRoutes("config");
  }
}
