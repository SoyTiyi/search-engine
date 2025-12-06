import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FlightsService } from './flights.service';
import { AmadeusService } from 'src/amadeus/amadeus.service';
import { FlightsController } from './flights.controller';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [HttpModule],
  providers: [FlightsService, AmadeusService, AuthService],
  controllers: [FlightsController],
})
export class FlightsModule {}
