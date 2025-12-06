import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { FlightsService } from './flights.service';
import { SearchFlightsDto } from './dto/search-flights.dto';
import { FlightOffersResponseDto } from './dto/flight-response.dto';

@Controller('flights')
export class FlightsController {
    constructor(private flightsService: FlightsService) {}

    @Get('search')
    @UseInterceptors(CacheInterceptor)
    async searchFlights(@Query() searchFlightsDto: SearchFlightsDto): Promise<FlightOffersResponseDto> {
        return this.flightsService.searchFlights(searchFlightsDto);
    }
}
