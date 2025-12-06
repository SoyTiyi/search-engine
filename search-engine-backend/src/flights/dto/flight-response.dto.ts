import { ApiProperty } from '@nestjs/swagger';

export class FlightDestinationDto {
  @ApiProperty({
    example: 'ORY',
    description: 'IATA code of the origin airport'
  })
  origin: string;

  @ApiProperty({
    example: 'MAD',
    description: 'IATA code of the destination airport'
  })
  destination: string;

  @ApiProperty({
    example: 'ORLY',
    description: 'Detailed name of the origin airport',
  })
  originName: string;

  @ApiProperty({
    example: 'ADOLFO SUAREZ BARAJAS',
    description: 'Detailed name of the destination airport',
  })
  destinationName: string;

  @ApiProperty({
    example: '2025-12-13',
    description: 'Departure date in YYYY-MM-DD format'
  })
  departureDate: string;

  @ApiProperty({
    example: '2025-12-17',
    description: 'Return date in YYYY-MM-DD format',
    required: false,
  })
  returnDate?: string;

  @ApiProperty({
    example: 118.68,
    description: 'Total flight price in the specified currency'
  })
  price: number;

  @ApiProperty({
    example: 'EUR',
    description: 'Currency code (ISO 4217)'
  })
  currency: string;

  @ApiProperty({
    description: 'Links to get more details about this flight',
    required: false,
    example: {
      flightDates: 'https://test.api.amadeus.com/v1/shopping/flight-dates?...',
      flightOffers: 'https://test.api.amadeus.com/v2/shopping/flight-offers?...',
    },
  })
  links?: {
    flightDates?: string;
    flightOffers?: string;
  };
}

export class FlightDestinationsResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indicates if the request was successful'
  })
  success: boolean;

  @ApiProperty({
    type: [FlightDestinationDto],
    description: 'List of available flight destinations'
  })
  data: FlightDestinationDto[];

  @ApiProperty({
    example: {
      total: 24,
      timestamp: '2025-12-04T10:30:00.000Z',
    },
    description: 'Response metadata',
  })
  meta: {
    total: number;
    timestamp: string;
  };
}