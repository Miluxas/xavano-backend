import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AddCommentBodyDto {
  @ApiProperty({ example: "title" })
  @IsString()
  content: string = "";

  @ApiProperty({ required: false, example: 1 })
  @Optional()
  parentId?: number;
}
