import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  IsObject,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";

class ScheduleDto {
  @IsString()
  @IsNotEmpty()
  station: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  date: string;
}

export class CreateTrainDto {
  @IsString()
  @IsNotEmpty()
  trainNumber: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ScheduleDto)
  departure: ScheduleDto;

  @IsObject()
  @ValidateNested()
  @Type(() => ScheduleDto)
  arrival: ScheduleDto;

  @IsNumber()
  price: number;
}

export class PartialTrainDto {
  @IsOptional()
  @IsString()
  trainNumber?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ScheduleDto)
  departure?: ScheduleDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ScheduleDto)
  arrival?: ScheduleDto;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price?: number;
}

export class UpdateTrainDto extends CreateTrainDto {}
