import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString } from "class-validator";

export class CategoryQuery {
  @ApiProperty({ required: false, enum: ["entertainment", "education"] })
  @IsString()
  @IsOptional()
  @IsIn(["entertainment", "education"])
  category?: string|undefined;
}

