import "reflect-metadata";
/**
 *
 * @param target 静态属性就是类的构造函数，实例属性就是类的原型对象
 * @param propertyKey 属性名称
 */
function Require(target, propertyKey) {
//   console.log(target, propertyKey);
  Reflect.defineMetadata("required", true, target, propertyKey);
}

function validate(user:User){
    for(let key in user){
        if(Reflect.getMetadata('required',user,key) && !user[key]){
            throw Error(`${key}是必填项`)
        }
    }
}

// 元数据添加参数校验
class User {
  @Require
  username: string; // 实例属性
}

const user = new User()
user.username = 'zs'
validate(user)