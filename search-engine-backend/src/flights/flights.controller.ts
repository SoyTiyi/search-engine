import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { FlightsService } from './flights.service';
import { SearchFlightsDto } from './dto/search-flights.dto';
import { FlightOffersResponseDto } from './dto/flight-response.dto';
import { SearchLocationDto } from './dto/search-location.dto';
import { LocationResponseDto } from './dto/location-response.dto';

@Controller('flights')
export class FlightsController {
    constructor(private flightsService: FlightsService) {}

    @Get('search')
    @UseInterceptors(CacheInterceptor)
    async searchFlights(@Query() searchFlightsDto: SearchFlightsDto): Promise<FlightOffersResponseDto> {
        return this.flightsService.searchFlights(searchFlightsDto);
    }

    @Get('locations')
    @UseInterceptors(CacheInterceptor)
    async searchLocations(@Query() searchLocationDto: SearchLocationDto): Promise<LocationResponseDto> {
        return this.flightsService.searchLocations(searchLocationDto);
    }

    @Get('history')
    async getHistory() {
        return this.flightsService.getSearchHistory();
    }
}
