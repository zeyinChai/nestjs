import { createParamDecorator } from "../common";

export const User = createParamDecorator((data, ctx) => {
  const req = ctx.switchToHttp().getRequest();
  return data ? req.user[data] : req.user;
});
