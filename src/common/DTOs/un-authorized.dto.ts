import { ApiProperty } from "@nestjs/swagger";
class UnAuthorizedResponseMeta {
  @ApiProperty({ default: 401 })
  code= 401;
}
export class UnAuthorizedResponse {
  @ApiProperty({})
  meta: UnAuthorizedResponseMeta=new UnAuthorizedResponseMeta();
}
