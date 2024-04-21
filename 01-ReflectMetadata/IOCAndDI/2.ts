// 解决1的方案：在外面new传入到Computer
interface Monitor {}
class Monitor27inch implements Monitor {}
interface Host {}
class LegendHost implements Monitor {}
export class Computer {
  monitor: Monitor;
  host: Host;
  constructor(monitor, host) {
    this.monitor = monitor;
    this.host = host;
  }
  startup() {
    console.log("组件完毕");
  }
}
let monitor = new Monitor27inch();
let host = new LegendHost();
let computer = new Computer(monitor, host);
computer.startup();
