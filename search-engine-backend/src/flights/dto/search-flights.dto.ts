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
    description: 'Código IATA del aeropuerto de origen (3 letras)',
    example: 'PAR',
    required: true,
    minLength: 3,
    maxLength: 3,
  })
  @IsString()
  @Length(3, 3, { message: 'El código de origen debe tener exactamente 3 caracteres' })
  origin: string;

  @ApiProperty({
    description: 'Precio máximo del vuelo en EUR',
    example: 200,
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'El precio máximo debe ser mayor o igual a 0' })
  @Type(() => Number)
  maxPrice?: number;

  @ApiProperty({
    description: 'Fecha de salida en formato YYYY-MM-DD o rango YYYY-MM-DD,YYYY-MM-DD',
    example: '2025-12-05',
    required: false,
  })
  @IsOptional()
  @IsString()
  departureDate?: string;

  @ApiProperty({
    description: 'Tipo de vista de resultados',
    example: 'DESTINATION',
    required: false,
    enum: ['DATE', 'DURATION', 'COUNTRY', 'DESTINATION'],
  })
  @IsOptional()
  @IsIn(['DATE', 'DURATION', 'COUNTRY', 'DESTINATION'])
  viewBy?: string;

  @ApiProperty({
    description: 'Duración del viaje en días (rango)',
    example: '1,15',
    required: false,
  })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiProperty({
    description: 'Solo vuelos directos (sin escalas)',
    example: false,
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  nonStop?: boolean;

  @ApiProperty({
    description: 'Solo vuelos de ida',
    example: false,
    required: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  oneWay?: boolean;
}