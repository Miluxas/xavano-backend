import { ApiProperty } from "@nestjs/swagger";

export class MultiLanguageResponse {
  @ApiProperty()
  en: string="";

  @ApiProperty()
  ar: string="";
}
