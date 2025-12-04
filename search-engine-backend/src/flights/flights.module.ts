import { Module } from '@nestjs/common';
import { FlightsService } from './flights.service';

@Module({
  providers: [FlightsService]
})
export class FlightsModule {}
