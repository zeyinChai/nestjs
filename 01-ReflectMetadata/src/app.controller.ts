import { Get, Controller } from "@nestjs/common";
import { AppService } from "./app.service";
// springmvc
@Controller("/")
export class AppController {
  // 只要在构造函数里声明依赖，IOC容器会自动帮你注入实例进来，就可以直接调用,不用自己创建实例
  constructor(private appService: AppService) {}
  @Get("/hello") // 控制器里面一般只用来接收参数，返回响应。并不会真正处理业务
  hello() {
    let message = this.appService.getHello();
    return message;
  }
}
