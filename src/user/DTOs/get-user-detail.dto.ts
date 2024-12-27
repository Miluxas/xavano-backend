import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../types/role.type";

export class GetUserDetailResponse {
  @ApiProperty()
  id: number = 0;

  @ApiProperty()
  firstName: string="";

  @ApiProperty()
  lastName: string="";

  @ApiProperty()
  email?: string;

  @ApiProperty()
  phoneNumber?: string;

  @ApiProperty()
  role: Role="User";

  @ApiProperty()
  lastLogin?: Date;

  @ApiProperty()
  state: string="";

  @ApiProperty()
  active: boolean=true;

  @ApiProperty()
  emailVerified: boolean=true;
}
