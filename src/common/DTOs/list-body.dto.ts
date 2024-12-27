import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class ListBody {
  @ApiProperty({ required: false, example: 0 })
  @IsNumber()
  @IsOptional()
  skip?: number;

  @ApiProperty({ required: false, example: 10 })
  @IsNumber()
  @IsOptional()
  take?: number;

  @ApiProperty({ required: false, example: "" })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false, example: "" })
  @IsOptional()
  sort?: string | Record<string, any>;

  @ApiProperty({ required: false, example: "" })
  @IsOptional()
  filter?: Record<string, any>;
}
