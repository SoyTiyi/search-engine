import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightsService } from './flights.service';
import { AmadeusService } from 'src/amadeus/amadeus.service';
import { FlightsController } from './flights.controller';
import { AuthService } from 'src/auth/auth.service';
import { SearchHistory } from './entities/search-history.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([SearchHistory]),
  ],
  providers: [FlightsService, AmadeusService, AuthService],
  controllers: [FlightsController],
})
export class FlightsModule {}
