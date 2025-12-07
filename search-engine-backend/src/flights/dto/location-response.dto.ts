import { ApiProperty } from '@nestjs/swagger';

export class LocationDto {
  @ApiProperty({ example: 'MAD', description: 'IATA code of the location' })
  iataCode: string;

  @ApiProperty({ example: 'Madrid', description: 'Name of the city or airport' })
  name: string;

  @ApiProperty({ example: 'Adolfo Suarez Barajas', description: 'Detailed name', required: false })
  detailedName?: string;

  @ApiProperty({ example: 'CITY', description: 'Type of location (CITY or AIRPORT)' })
  subType: string;

  @ApiProperty({ example: 'ES', description: 'Country code' })
  countryName: string;
}

export class LocationResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: [LocationDto] })
  data: LocationDto[];
}
