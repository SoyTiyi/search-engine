import { ApiProperty } from '@nestjs/swagger';

export class FlightOfferDto {
  @ApiProperty({ example: 'flight-offer' })
  type: string;

  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'MEX' })
  origin: string;

  @ApiProperty({ example: 'MAD' })
  destination: string;

  @ApiProperty({ example: 'Aeromexico' })
  airline: string;

  @ApiProperty({ example: 'AM1' })
  flight_number: string;

  @ApiProperty({ example: '2025-12-25T18:00:00' })
  departureDate: string;

  @ApiProperty({ example: '2025-12-26T12:00:00' })
  arrivalDate: string;

  @ApiProperty({ example: 'PT10H' })
  duration: string;

  @ApiProperty({ example: 850.50 })
  price: number;

  @ApiProperty({ example: 'USD' })
  currency: string;

  @ApiProperty({ example: 9 })
  numberOfBookableSeats: number;

  @ApiProperty({
    description: 'Original Amadeus flight offer object for price confirmation',
    required: false
  })
  originalOffer?: any;
}

export class FlightOffersResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: [FlightOfferDto] })
  data: FlightOfferDto[];

  @ApiProperty({
    example: {
      count: 10,
      timestamp: '2025-12-06T10:00:00.000Z',
    },
  })
  meta: {
    count: number;
    timestamp: string;
  };
}
