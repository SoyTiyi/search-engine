import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsIn,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchFlightsDto {
  @ApiProperty({
    description: 'IATA code of the origin airport (3 letters)',
    example: 'PAR',
    required: true,
    minLength: 3,
    maxLength: 3,
  })
  @IsString()
  @Length(3, 3, { message: 'Origin code must be exactly 3 characters' })
  origin: string;

  @ApiProperty({
    description: 'Maximum flight price in EUR',
    example: 200,
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Maximum price must be greater than or equal to 0' })
  @Type(() => Number)
  maxPrice?: number;

  @ApiProperty({
    description: 'Departure date in YYYY-MM-DD format or range YYYY-MM-DD,YYYY-MM-DD',
    example: '2025-12-05',
    required: false,
  })
  @IsOptional()
  @IsString()
  departureDate?: string;

  @ApiProperty({
    description: 'Results view type',
    example: 'DESTINATION',
    required: false,
    enum: ['DATE', 'DURATION', 'COUNTRY', 'DESTINATION'],
  })
  @IsOptional()
  @IsIn(['DATE', 'DURATION', 'COUNTRY', 'DESTINATION'])
  viewBy?: string;

  @ApiProperty({
    description: 'Trip duration in days (range)',
    example: '1,15',
    required: false,
  })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiProperty({
    description: 'Direct flights only (no stopovers)',
    example: false,
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  nonStop?: boolean;

  @ApiProperty({
    description: 'One-way flights only',
    example: false,
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  oneWay?: boolean;
}