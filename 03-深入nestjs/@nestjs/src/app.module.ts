import { Module } from "../common";
import { AppController } from "./app.controller";
import { LoggerService, UseValueService,UseFactory } from "./logger.service";

@Module({
  controllers: [AppController],
  providers: [
    UseValueService,
    LoggerService,
    { provide: "StringToken", useValue: new UseValueService() },
    {
      provide: "FactoryToken",
      useFactory: () => new UseFactory(),
    },
  ],
})
export class AppModule {}
