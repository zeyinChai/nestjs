import clc from "cli-color";

export class Logger {
  public static lastLogTime = Date.now()
  // 日志工具
  static log(message: string, context: string) {
    const timestamp = new Date().toDateString();
    // 获取当前进程的pid
    const pid = process.pid;
    const currentTime = Date.now()
    const timeDiff = currentTime - this.lastLogTime
    console.log(
      `${clc.green('+'+timeDiff+'ms')}-${clc.green("Nest")}-${clc.green(pid.toString())}-${clc.yellow(timestamp)}-${clc.yellow("LOG")}-${clc.green(context)}-${clc.yellow(message)}
      `
    );
    this.lastLogTime = currentTime
  }
}
