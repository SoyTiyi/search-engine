import { ApiProperty } from '@nestjs/swagger';

export class FlightDestinationDto {
  @ApiProperty({ 
    example: 'ORY', 
    description: 'Código IATA del aeropuerto de origen' 
  })
  origin: string;

  @ApiProperty({ 
    example: 'MAD', 
    description: 'Código IATA del aeropuerto de destino' 
  })
  destination: string;

  @ApiProperty({
    example: 'Orly',
    description: 'Nombre detallado del aeropuerto de origen',
  })
  originName: string;

  @ApiProperty({
    example: 'Adolfo Suarez Barajas',
    description: 'Nombre detallado del aeropuerto de destino',
  })
  destinationName: string;

  @ApiProperty({ 
    example: '2025-12-13', 
    description: 'Fecha de salida (YYYY-MM-DD)' 
  })
  departureDate: string;

  @ApiProperty({
    example: '2025-12-17',
    description: 'Fecha de regreso (YYYY-MM-DD)',
    required: false,
  })
  returnDate?: string;

  @ApiProperty({ 
    example: 118.68, 
    description: 'Precio total del vuelo' 
  })
  price: number;

  @ApiProperty({ 
    example: 'EUR', 
    description: 'Moneda del precio' 
  })
  currency: string;

  @ApiProperty({
    description: 'Links relacionados para obtener más detalles',
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
    description: 'Indica si la petición fue exitosa' 
  })
  success: boolean;

  @ApiProperty({ 
    type: [FlightDestinationDto],
    description: 'Lista de destinos de vuelo disponibles' 
  })
  data: FlightDestinationDto[];

  @ApiProperty({
    example: {
      total: 24,
      timestamp: '2025-12-04T10:30:00Z',
    },
    description: 'Metadata de la respuesta',
  })
  meta: {
    total: number;
    timestamp: string;
  };
}