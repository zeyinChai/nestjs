"use strict";
var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
    d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = this && this.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
require("reflect-metadata");
var InjectionToken = function () {
  function InjectionToken(injectionIdentifier) {
    this.injectionIdentifier = injectionIdentifier;
  }
  return InjectionToken;
}();
var METADATA_INJECT_KEY = "METADATA_INJECT_KEY";
function Inject(token) {
  return function (target, methodName, paramsIndex) {
    Reflect.defineMetadata(METADATA_INJECT_KEY, token, target, "index-".concat(paramsIndex));
    return target;
  };
}
var Car = function () {
  function Car() {}
  return Car;
}();
var House = function () {
  function House() {}
  return House;
}();
var GirlFriend = function () {
  function GirlFriend(car, house) {
    this.car = car;
    this.house = house;
  }
  GirlFriend = __decorate([__param(1, Inject(new InjectionToken("house"))), __metadata("design:paramtypes", [Car, House])], GirlFriend);
  return GirlFriend;
}();
console.log(Reflect.getMetadata(METADATA_INJECT_KEY, GirlFriend, "index-".concat(1)));