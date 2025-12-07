import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FlightsModule } from './flights/flights.module';
import { ConfigurationModule } from './config/configutation.module';
import { AmadeusModule } from './amadeus/amadeus.module';
import { CacheModule } from './cache/cache.module';
import { SearchHistory } from './flights/entities/search-history.entity';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'search-engine.sqlite',
      entities: [SearchHistory],
      synchronize: true,
    }),
    AuthModule,
    FlightsModule,
    ConfigurationModule,
    AmadeusModule,
    CacheModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
