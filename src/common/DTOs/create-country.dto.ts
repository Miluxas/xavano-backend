import { ApiProperty } from "@nestjs/swagger";

export class CreateCountryBody {
  @ApiProperty()
  title: string = "";

  @ApiProperty()
  isActive: boolean = false;

  @ApiProperty()
  rate: number = 0;

  @ApiProperty()
  dialCode: string = "";

  @ApiProperty()
  code2Char: string = "";

  @ApiProperty()
  code3Char: string = "";

  @ApiProperty()
  flag: string = "";

  @ApiProperty()
  timeZone: string = "";

  @ApiProperty()
  currencyIso: string = "";

  @ApiProperty()
  currency: string = "";

  @ApiProperty()
  decimal: number = 0;
}
