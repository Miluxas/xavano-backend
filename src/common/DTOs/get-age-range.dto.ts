import { ApiProperty } from "@nestjs/swagger";
import { MultiLanguageResponse } from "@/common/DTOs/multi-language-response.dto";

export class AgeRangeDetailResponse {
  @ApiProperty()
  id: number=0;

  @ApiProperty()
  ml_title: MultiLanguageResponse={en:"",ar:""};

  @ApiProperty()
  image?: any;
}
