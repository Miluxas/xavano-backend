import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class MultiCurrencyHeaderDto {
  @ApiProperty({ required:false, enum: ["KWD", "BHD", "OMR", "AED", "SAR"] })
  @IsString()
  currency?: string;
}
