import { ApiProperty } from "@nestjs/swagger";

export class MediaResponse {
  @ApiProperty()
  id: number=0;

  @ApiProperty()
  url: string="";

  @ApiProperty()
  size: number=0;
}
