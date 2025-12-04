import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FlightsController } from './flights/flights.controller';
import { FlightsModule } from './flights/flights.module';
import { ConfigurationModule } from './config/configutation.module';

@Module({
  imports: [AuthModule, FlightsModule, ConfigurationModule],
  controllers: [AppController, FlightsController],
  providers: [AppService],
})
export class AppModule {}
