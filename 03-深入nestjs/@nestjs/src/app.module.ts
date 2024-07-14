import { Module } from "../common";
import { AppController } from "./app.controller";
import { UserController } from "./user.controller";

@Module({
    controllers:[AppController,UserController]
})
export class AppModule{
    
}
