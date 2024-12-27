import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString } from "class-validator";

export class IdParam {
  @ApiProperty()
  @IsNumberString()
  id: number=0;
}
