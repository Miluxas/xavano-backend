import { ApiProperty } from "@nestjs/swagger";

export class MiniListItemResponse {
  @ApiProperty()
  id: number=0;
  
  @ApiProperty()
  title: string="";
}
