import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class EditCommentBodyDto {
  @ApiProperty({ example: "title" })
  @IsString()
  content: string = "";
}
