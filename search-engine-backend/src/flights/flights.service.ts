import { Injectable } from '@nestjs/common';
import { AmadeusService } from 'src/amadeus/amadeus.service';
import { SearchFlightsDto } from './dto/search-flights.dto';
import { FlightDestinationDto, FlightDestinationsResponseDto } from './dto/flight-response.dto';
import { AmadeusFlightDestinationsResponse } from './interfaces/amadeus-flight.interface';

@Injectable()
export class FlightsService {
  constructor(private amadeusService: AmadeusService) {}

  async searchFlights(
    searchFlightsDto: SearchFlightsDto,
  ): Promise<FlightDestinationsResponseDto> {
    const endpoint = '/shopping/flight-destinations';
    const params = this.buildDestinationsParams(searchFlightsDto);

    const amadeusResponse = await this.amadeusService.makeRequest<
      AmadeusFlightDestinationsResponse
    >(endpoint, params);
    
    const flights = this.transformToFlightDestinationsResponse(amadeusResponse);

    return {
      success: true,
      data: flights,
      meta: {
        total: flights.length,
        timestamp: new Date().toISOString(),
      },
    };
  }

  private transformToFlightDestinationsResponse(
    amadeusData: AmadeusFlightDestinationsResponse,
  ): FlightDestinationDto[] {
    return amadeusData.data.map((flight) => {
      const originLocation = amadeusData.dictionaries.locations[flight.origin];
      const destinationLocation =
        amadeusData.dictionaries.locations[flight.destination];

      return {
        origin: flight.origin,
        destination: flight.destination,
        originName: originLocation?.detailedName || flight.origin,
        destinationName: destinationLocation?.detailedName || flight.destination,
        departureDate: flight.departureDate,
        returnDate: flight.returnDate,
        price: parseFloat(flight.price.total),
        currency: amadeusData.meta.currency,
        links: flight.links,
      };
    });
  }


  private buildDestinationsParams(
    searchDto: SearchFlightsDto,
  ): Record<string, any> {
    const params: Record<string, any> = {
      origin: searchDto.origin.toUpperCase(),
    };

    if (searchDto.maxPrice !== undefined) {
      params.maxPrice = searchDto.maxPrice;
    }

    if (searchDto.departureDate) {
      params.departureDate = searchDto.departureDate;
    }

    if (searchDto.viewBy) {
      params.viewBy = searchDto.viewBy;
    }

    if (searchDto.duration) {
      params.duration = searchDto.duration;
    }

    if (searchDto.nonStop !== undefined) {
      params.nonStop = searchDto.nonStop;
    }

    if (searchDto.oneWay !== undefined) {
      params.oneWay = searchDto.oneWay;
    }

    return params;
  }
}
