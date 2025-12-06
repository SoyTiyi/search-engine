import { Controller, Get, Query } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { SearchFlightsDto } from './dto/search-flights.dto';
import { FlightOffersResponseDto } from './dto/flight-response.dto';

@Controller('flights')
export class FlightsController {
    constructor(private flightsService: FlightsService) {}

    @Get('search')
    async searchFlights(@Query() searchFlightsDto: SearchFlightsDto): Promise<FlightOffersResponseDto> {
        return this.flightsService.searchFlights(searchFlightsDto);
    }
}
