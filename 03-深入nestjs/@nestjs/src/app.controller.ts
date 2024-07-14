import { Controller, Get } from "../common";
@Controller('/')
export class AppController{
    @Get()
    index(){
        return '123'
    }
}
