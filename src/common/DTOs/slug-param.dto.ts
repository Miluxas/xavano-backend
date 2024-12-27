import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SlugParam {
  @ApiProperty()
  @IsString()
  slug: string="";
}
