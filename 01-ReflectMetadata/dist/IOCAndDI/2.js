"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Computer = void 0;
class Monitor27inch {
}
class LegendHost {
}
class Computer {
    constructor(monitor, host) {
        this.monitor = monitor;
        this.host = host;
    }
    startup() {
        console.log("组件完毕");
    }
}
exports.Computer = Computer;
let monitor = new Monitor27inch();
let host = new LegendHost();
let computer = new Computer(monitor, host);
computer.startup();
//# sourceMappingURL=2.js.map