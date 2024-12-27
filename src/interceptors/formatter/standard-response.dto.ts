import { ApiProperty } from "@nestjs/swagger";

export abstract class StandardResponse<T> {
  @ApiProperty({
    default: "ok",
    type: String,
    required: true,
    example: "ok",
  })
  readonly message: string="";

  abstract data: T;
}
