import { Container } from "./Container";
import { Injectable } from "./injectable";
let container = new Container();
@Injectable()
class Car {
  fn() {
    console.log("car fn");
  }
}
@Injectable()
class House {}
@Injectable()
class GirlFriend {
  constructor(private car: Car, private house: House) {}
  hello() {
    console.log(this.car, this.house);
  }
}
// container.addProvider({ provide: BasicClass, useClass: BasicClass });
container.addProvider({ provide: House, useFactory: () => new House() });
container.addProvider({ provide: Car, useValue: new Car() });
container.addProvider({
  provide: GirlFriend,
  useClass: GirlFriend,
});
let girlFriend = container.inject(GirlFriend); // 用了装饰器 才能让design:paramtypes生效
console.log(girlFriend);

 // 用了装饰器 才能让design:paramtypes生效
console.log(Reflect.getMetadata("design:paramtypes", GirlFriend)[0]);
// console.log(container);
