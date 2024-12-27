import { ApiProperty } from "@nestjs/swagger";

export class CountryDetailResponseDto {
  @ApiProperty()
  id: number=0;

  @ApiProperty()
  title: string="";

  @ApiProperty()
  isActive: boolean=true;

  @ApiProperty()
  dialCode: string="";

  @ApiProperty()
  code2Char: string="";

  @ApiProperty()
  code3Char: string="";

  @ApiProperty()
  flag: string="";

  @ApiProperty()
  timeZone: string="";

  @ApiProperty()
  currencyIso: string="";

  @ApiProperty()
  currency: string="";

  @ApiProperty()
  decimal: number=0;

  @ApiProperty()
  rate: number=0;
}
