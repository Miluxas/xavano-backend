import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class SearchBody {
  @ApiProperty({ required: false, example: 0 })
  @IsNumber()
  @IsOptional()
  skip?: number|undefined;

  @ApiProperty({ required: false, example: 10 })
  @IsNumber()
  @IsOptional()
  take?: number|undefined;

  @ApiProperty({ example: "" })
  @IsString()
  search: string="";

  @ApiProperty({ required: false, example: "" })
  @IsOptional()
  sort?: string | Record<string, any>;

  @ApiProperty({ required: false, example: "" })
  @IsOptional()
  filter?: Record<string, any>;
}
