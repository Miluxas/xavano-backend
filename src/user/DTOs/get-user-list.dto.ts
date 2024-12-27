import { ApiProperty } from "@nestjs/swagger";

export class GetUserListResponse {
  @ApiProperty()
  id: number=0;

  @ApiProperty()
  firstName: string="";

  @ApiProperty()
  lastName: string="";

  @ApiProperty()
  email: string="";
}
