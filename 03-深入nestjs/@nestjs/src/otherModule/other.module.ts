import { Module } from "../../common";
import { OtherService } from "./other.service";

@Module({
  providers: [OtherService],
  exports: [OtherService], // 把导入的CommonModule重新导出
})
export class OtherModule {}
