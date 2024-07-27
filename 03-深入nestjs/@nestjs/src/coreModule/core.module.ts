import { Module } from "../../common";
import { CommonModule } from "../commonModule/common.module";

@Module({
  imports: [CommonModule],
  exports: [CommonModule], // 把导入的CommonModule重新导出
})
export class CoreModule {}
