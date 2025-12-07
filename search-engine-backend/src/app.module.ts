import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
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
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'search-engine.sqlite',
      entities: [SearchHistory],
      synchronize: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 50,
        },
      ],
    }),
    AuthModule,
    FlightsModule,
    ConfigurationModule,
    AmadeusModule,
    CacheModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
