import { IsValidPhoneNumber } from "@/common/decorators/phone-number.decorator";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNumberString,
  IsString
} from "class-validator";
import { Role } from "../types/role.type";

export class UserLoginBody {
  @ApiProperty({ example: "m@d.c" })
  @IsString()
  @IsEmail()
  email: string="";

  @ApiProperty({ example: "123123" })
  @IsNumberString()
  password: string="";
}

export class LoggedInUser {
  @ApiProperty()
  id: number=0;

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
  emailVerified: boolean=false;
}

export class UserLoginResponse {
  @ApiProperty()
  user: LoggedInUser=new LoggedInUser();

  @ApiProperty()
  token: string="";
  
  @ApiProperty()
  expiresIn: string="";
}
