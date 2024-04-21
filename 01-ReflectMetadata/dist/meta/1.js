"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata"); // 提供polyfill
let target = {};
// Reflect.defineMetadata不会修改对象本身
Reflect.defineMetadata("name", "test", target); // 给target添加key为name值为test
console.log(Reflect.getOwnMetadata("name", target));
Reflect.defineMetadata("name", "word", target, "hello"); // 给target.hello添加一个key为name值为word
console.log(Reflect.getOwnMetadata("name", target, "hello"));
// decorator
// @Reflect.metadata("name", "Person") // 给类本身增加元数据
let Person = class Person {
    //   @Reflect.metadata("name", "123") // 给类的原型的hello增加元数据
    hello() {
        return "world";
    }
};
__decorate([
    methodMetaData("name", "123"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], Person.prototype, "hello", null);
Person = __decorate([
    classMetaData("name", "Person")
], Person);
console.log(Reflect.getMetadata("name", Person));
console.log(Reflect.getMetadata("name", Person.prototype, "hello"));
// 原理实现
function classMetaData(key, value) {
    return function (target) {
        Reflect.defineMetadata(key, value, target);
    };
}
function methodMetaData(key, value) {
    return function (target, properytName) {
        // console.log(target === Person.prototype); // true
        // target参数是类的原型
        // Person.prototype.hello.name = '123'
        Reflect.defineMetadata(key, value, target, properytName);
    };
}
//# sourceMappingURL=1.js.map