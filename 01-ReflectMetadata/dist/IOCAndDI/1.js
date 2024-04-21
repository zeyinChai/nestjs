"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Computer = void 0;
class Monitor27inch {
}
class LegendHost {
}
class Computer {
    constructor() {
        this.monitor = new Monitor27inch();
        this.host = new LegendHost();
    }
    startup() {
        console.log("组件完毕");
    }
}
exports.Computer = Computer;
let computer = new Computer();
computer.startup();
/**
 * 以上代码存在的问题
 *  1.无法创建不同的组件部分 代码写死了指定 27寸 和 legend的host
 *  2.需要在类的内部 手动创建 需要new
 */
//# sourceMappingURL=1.js.map