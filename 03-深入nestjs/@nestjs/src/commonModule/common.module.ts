import { Module,Global } from "../../common";
import { CommonService } from "./common.service";


@Global()
@Module({
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
