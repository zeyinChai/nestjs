/**
 * ioc di是如何诞生的 以及解决的问题
 */
interface Monitor {}
class Monitor27inch implements Monitor {}
interface Host {}
class LegendHost implements Monitor {}
export class Computer {
  monitor: Monitor;
  host: Host;
  constructor() {
    this.monitor = new Monitor27inch();
    this.host = new LegendHost();
  }
  startup() {
    console.log("组件完毕");
  }
}
let computer = new Computer();
computer.startup();
/**
 * 以上代码存在的问题
 *  1.无法创建不同的组件部分 代码写死了指定 27寸 和 legend的host
 *  2.需要在类的内部 手动创建 需要new
 */
