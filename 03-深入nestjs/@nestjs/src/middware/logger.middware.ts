import { Injectable } from "../../common";
import { Request, Response, NextFunction } from "express";
import { NestMiddleware } from "../../common/middware.interface";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log("next middleware");
    next();
  }
}
