import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class MultiLanguageInBody {
  @ApiProperty({ example: "" })
  @IsString()
  en: string="";

  @ApiProperty({ example: "" })
  @IsString()
  ar: string="";
}
