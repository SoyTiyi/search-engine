import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true, 
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get<number>('cache.ttl', 1800) * 1000,
        max: configService.get<number>('cache.max', 100),
      }),
    }),
  ],
})
export class CacheModule {}