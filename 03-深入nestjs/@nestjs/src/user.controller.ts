import {
  Controller,
  Get,
  Req,
  Requst,
  Query,
  Headers,
  Session,
  Params,
  Post,
  Body,
  Response,
  Next,
  Redirect
} from "../common";
import { Requst as ExpressRequest, Response as ExpressResponse } from "express";
import { User } from "./user.decorator";

@Controller("users")
export class UserController {
  @Get("req")
  handleRequest(@Req() req: ExpressRequest, @Requst() request: ExpressRequest) {
    console.log(req.url, req.method, "req");

    return "123";
  }
  @Get("query")
  handleQuery(@Query() query: any, @Query("id") id: string) {
    console.log(query, id);
    return `query id:${id}`;
  }
  @Get("headers")
  handleHeaders(@Headers() headers: any, @Headers("accept") accept: string) {
    console.log(headers, accept);
    return `headers headers:${accept}`;
  }
  @Get("session")
  handleSession(@Session() session: any, @Session("pageView") pageView: any) {
    if (session?.pageView) {
      session.pageView++;
    } else {
      console.log("+++");
      session.pageView = 1;
    }
    return JSON.stringify(session);
  }
  @Get(":username/info")
  getUserNameInfo(@Params() params) {
    return JSON.stringify(params);
  }
  @Post("create")
  createUser(@Body() createUserDTO, @Body("username") username: string) {
    console.log(createUserDTO, username);
    return "userCreated";
  }
  @Get("res")
  response(@Response() res: ExpressResponse) {
    console.log("res", res);
    res.json({ code: 200, msg: "success" });
    return "userCreated";
  }
  @Get("passthrough")
  passthrough(@Response({ passthrough: true }) res: ExpressResponse) {
    res.setHeader("key", "value");
    return "passthrough";
  }
  @Get("next")
  handleNext(@Next() next) {
    console.log("next");
    next();
  }
  @Get("/redirect")
  @Redirect("/users/req", 301)
  redirect() {}
  @Get("/redirect2")
  redirect2(@Query('version') version) {
    return {url:`https://docs.nest.js.com/${version}/`}
  }
  @Get("/custom")
  customParamDecorator(@User('role') role,@User() user) {
    console.log(role);
    return JSON.stringify(user)
  }
}
/**
 * 在使用Nest.js的时候，一般来说一个实体会定义两个类型，一个是DTO一个是interface
 * DTO ：数据传输对象（客户端向服务器提交的数据对象）
 * userDTO：{用户名，密码，确认密码}
 * userInterface: {用户名，密码，创建时间，更新时间}
 */
