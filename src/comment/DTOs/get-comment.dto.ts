import { ApiProperty } from "@nestjs/swagger";

export class GetCommentResponseDto {
  @ApiProperty()
  id: number = 0;

  @ApiProperty()
  content: string = "";

  @ApiProperty()
  user?: any = {};
}
