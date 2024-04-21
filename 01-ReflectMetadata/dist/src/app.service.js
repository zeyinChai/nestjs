"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const logger_service_1 = require("./logger.service");
// 可被注入别的服务
let AppService = class AppService {
    constructor(loggerService, useFactoryLoggerService, useValueLoggerService, useValueLoggerServiceStringToken) {
        this.loggerService = loggerService;
        this.useFactoryLoggerService = useFactoryLoggerService;
        this.useValueLoggerService = useValueLoggerService;
        this.useValueLoggerServiceStringToken = useValueLoggerServiceStringToken;
    }
    getHello() {
        this.loggerService.log("在appservice注入并调用loggerService");
        this.useFactoryLoggerService.log("在appservice注入并调用useFactoryLoggerService");
        this.useValueLoggerService.log("在appservice注入并调用useValueLoggerService");
        this.useValueLoggerServiceStringToken.log("在appservice注入并调用useValueLoggerServiceStringToken");
        return "hello";
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, common_1.Inject)("StringToken")),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        logger_service_1.UseFactoryLoggerService,
        logger_service_1.UseValueLoggerService,
        logger_service_1.UseValueLoggerServiceStringToken])
], AppService);
//# sourceMappingURL=app.service.js.map