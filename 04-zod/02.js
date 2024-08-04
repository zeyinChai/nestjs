let { z } = require("zod");

const User = z.object({
  username: z.string(),
  age: z.number(),
  email: z.string().email(),
});

let user = {
  username: "zs",
  age: 19,
  email: "zs@qq.com",
};

try {
  const result = User.parse(user);
  console.log(result);
} catch (error) {
  console.log(error);
}
