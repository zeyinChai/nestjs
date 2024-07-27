import { Module } from "../../common";
import { LoggerService, UseValueService, UseFactory } from "./logger.service";

@Module({
  providers: [
    UseValueService,
    LoggerService,
    { provide: "StringToken", useValue: new UseValueService() },
    {
      provide: "FactoryToken",
      useFactory: () => new UseFactory(),
    },
  ],
  exports: [UseValueService, LoggerService, "StringToken", "FactoryToken"],
})
export class LoggerModule {}
