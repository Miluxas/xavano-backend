import { ApiProperty } from "@nestjs/swagger";

export class DeleteDefaultResponse {
  @ApiProperty()
  result: string="";
}
