import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('redis.host');
        const port = configService.get<number>('redis.port');
        const password = configService.get<string>('redis.password');
        const db = configService.get<number>('redis.db', 0);

        try {
          const store = await redisStore({
            socket: {
              host,
              port,
            },
            password,
            database: db,
            ttl: configService.get<number>('cache.ttl', 1800) * 1000,
          });

          return {
            store,
          };
        } catch (error) {
          return {
            ttl: configService.get<number>('cache.ttl', 1800) * 1000,
            max: configService.get<number>('cache.max', 100),
          };
        }
      },
    }),
  ],
})
export class CacheModule {}
