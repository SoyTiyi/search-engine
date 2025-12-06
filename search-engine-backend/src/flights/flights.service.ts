import { Injectable } from '@nestjs/common';
import { AmadeusService } from 'src/amadeus/amadeus.service';
import { SearchFlightsDto } from './dto/search-flights.dto';
import { FlightOfferDto, FlightOffersResponseDto } from './dto/flight-response.dto';
import { AmadeusFlightOffersResponse } from './interfaces/amadeus-flight.interface';
import { SearchLocationDto } from './dto/search-location.dto';
import { LocationDto, LocationResponseDto } from './dto/location-response.dto';
import { AmadeusLocationsResponse } from './interfaces/amadeus-location.interface';

@Injectable()
export class FlightsService {
  constructor(private amadeusService: AmadeusService) {}

  async searchFlights(searchFlightsDto: SearchFlightsDto): Promise<FlightOffersResponseDto> {
    const endpoint = '/v2/shopping/flight-offers';
    const params = this.buildFlightOffersParams(searchFlightsDto);

    const amadeusResponse = await this.amadeusService.makeRequest<AmadeusFlightOffersResponse>(endpoint, params);
    
    return this.transformFlightOffers(amadeusResponse);
  }

  async searchLocations(searchLocationDto: SearchLocationDto): Promise<LocationResponseDto> {
    const endpoint = '/v1/reference-data/locations';
    const params = {
      subType: 'CITY,AIRPORT',
      keyword: searchLocationDto.keyword,
      'page[limit]': 10,
      view: 'LIGHT'
    };

    const amadeusResponse = await this.amadeusService.makeRequest<AmadeusLocationsResponse>(endpoint, params);
    
    return this.transformLocations(amadeusResponse);
  }

  private transformLocations(data: AmadeusLocationsResponse): LocationResponseDto {
    const locations: LocationDto[] = data.data.map((location) => ({
      iataCode: location.iataCode,
      name: location.name,
      detailedName: location.detailedName,
      subType: location.subType,
      countryName: location.address?.countryName || '',
    }));

    return {
      success: true,
      data: locations,
    };
  }

  private transformFlightOffers(data: AmadeusFlightOffersResponse): FlightOffersResponseDto {
    const carriers = data.dictionaries?.carriers || {};

    const offers: FlightOfferDto[] = data.data.map((offer) => {
      const itinerary = offer.itineraries[0];
      const segments = itinerary.segments;
      
      const firstSegment = segments[0];
      const lastSegment = segments[segments.length - 1];
      const carrierCode = firstSegment.carrierCode;

      return {
        type: 'flight-offer',
        id: offer.id,
        origin: firstSegment.departure.iataCode,
        destination: lastSegment.arrival.iataCode,
        airline: carriers[carrierCode] || carrierCode,
        flight_number: `${carrierCode}${firstSegment.number}`,
        departureDate: firstSegment.departure.at,
        arrivalDate: lastSegment.arrival.at,
        duration: itinerary.duration,
        price: parseFloat(offer.price.total),
        currency: offer.price.currency,
        numberOfBookableSeats: offer.numberOfBookableSeats,
      };
    });

    return {
      success: true,
      data: offers,
      meta: {
        count: data.meta?.count || offers.length,
        timestamp: new Date().toISOString()
      }
    };
  }

  private buildFlightOffersParams(searchDto: SearchFlightsDto): Record<string, any> {
    const params: Record<string, any> = {
      originLocationCode: searchDto.origin.toUpperCase(),
      destinationLocationCode: searchDto.destination.toUpperCase(),
      departureDate: searchDto.departureDate,
      adults: searchDto.adults || 1,
      max: 10,
      currencyCode: searchDto.currencyCode || 'EUR',
    };

    if (searchDto.maxPrice) {
      params.maxPrice = Math.floor(searchDto.maxPrice);
    }

    if (searchDto.nonStop) {
      params.nonStop = searchDto.nonStop;
    }

    return params;
  }
}
