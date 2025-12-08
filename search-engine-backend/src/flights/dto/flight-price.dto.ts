import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';
import type { AmadeusFlightOffer } from '../interfaces/amadeus-flight.interface';

export class FlightPriceRequestDto {
  @ApiProperty({
    description: 'Complete Amadeus flight offer object from search response',
    example: {
      type: 'flight-offer',
      id: '1',
      source: 'GDS',
      instantTicketingRequired: false,
      nonHomogeneous: false,
      oneWay: false,
      lastTicketingDate: '2025-12-20',
      numberOfBookableSeats: 9,
      itineraries: [],
      price: {},
      pricingOptions: {},
      validatingAirlineCodes: [],
      travelerPricings: []
    }
  })
  @IsNotEmpty()
  @IsObject()
  flightOffer: AmadeusFlightOffer;
}
