function Car() {}
function House() {}
function GirlFriend(car, house) {
  this.car = car;
  this.house = house;
}
// 装饰器工厂
var __param = function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};
// 执行装饰器 从后往前装饰
GirlFriend = __decorate(
  [
    __param(1, Inject(new InjectionToken("house"))),
    __metadata("design:paramtypes", [Car, House]),
  ],
  GirlFriend
);
