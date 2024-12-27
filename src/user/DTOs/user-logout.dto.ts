import { ApiProperty } from "@nestjs/swagger";

export class UserLogoutResponse {
  @ApiProperty()
  result: string="";
}
