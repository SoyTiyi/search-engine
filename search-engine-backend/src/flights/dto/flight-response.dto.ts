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
    example: 'ORLY',
    description: 'Nombre detallado del aeropuerto de origen',
  })
  originName: string;

  @ApiProperty({
    example: 'ADOLFO SUAREZ BARAJAS',
    description: 'Nombre detallado del aeropuerto de destino',
  })
  destinationName: string;

  @ApiProperty({ 
    example: '2025-12-13', 
    description: 'Fecha de salida en formato YYYY-MM-DD' 
  })
  departureDate: string;

  @ApiProperty({
    example: '2025-12-17',
    description: 'Fecha de regreso en formato YYYY-MM-DD',
    required: false,
  })
  returnDate?: string;

  @ApiProperty({ 
    example: 118.68, 
    description: 'Precio total del vuelo en la moneda especificada' 
  })
  price: number;

  @ApiProperty({ 
    example: 'EUR', 
    description: 'Código de la moneda (ISO 4217)' 
  })
  currency: string;

  @ApiProperty({
    description: 'Links para obtener más detalles sobre este vuelo',
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
      timestamp: '2025-12-04T10:30:00.000Z',
    },
    description: 'Metadata de la respuesta',
  })
  meta: {
    total: number;
    timestamp: string;
  };
}