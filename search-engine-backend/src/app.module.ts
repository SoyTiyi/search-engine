import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FlightsController } from './flights/flights.controller';
import { FlightsModule } from './flights/flights.module';

@Module({
  imports: [AuthModule, FlightsModule],
  controllers: [AppController, FlightsController],
  providers: [AppService],
})
export class AppModule {}
