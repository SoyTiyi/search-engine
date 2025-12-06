import { Controller, Get, Query } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { SearchFlightsDto } from './dto/search-flights.dto';

@Controller('flights')
export class FlightsController {
    constructor(private flightsService: FlightsService) {}

    @Get('search')
    async searchFlights(@Query() searchFlightsDto: SearchFlightsDto): Promise<any> {
        return this.flightsService.searchFlights(searchFlightsDto);
    }
}
