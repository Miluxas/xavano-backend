import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class EditCountryBody {
  @ApiProperty()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty()
  @IsOptional()
  rate?: number;

  @ApiProperty()
  @IsOptional()
  dialCode?: string;

  @ApiProperty()
  @IsOptional()
  code2Char?: string;

  @ApiProperty()
  @IsOptional()
  code3Char?: string;

  @ApiProperty()
  @IsOptional()
  flag?: string;

  @ApiProperty()
  @IsOptional()
  timeZone?: string;

  @ApiProperty()
  @IsOptional()
  currencyIso?: string;

  @ApiProperty()
  @IsOptional()
  currency?: string;

  @ApiProperty()
  @IsOptional()
  decimal?: number;
}
