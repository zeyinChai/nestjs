import { NestFactory } from "../core";
import { AppModule } from "./app.module";
import session from "express-session";

async function bootstap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: "secret-key", // 用于加密会话的密钥
      resave: false, // 每次请求后是否强制保存会话 即使没有改变
      saveUninitalized: false, // 是否保存被初始化的会话
      cookie: { maxAge: 1000 * 60 * 60 * 24 },
    })
  );
  await app.listen(3000);
}
bootstap();
