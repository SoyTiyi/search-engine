import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import {
  ServerConfig,
  AmadeusConfig,
  FrontendConfig,
} from './intefaces/config.interface';

@Injectable()
export class ConfigurationService {
  constructor(private configService: NestConfigService) {}

  get server(): ServerConfig {
    return {
      port: this.configService.get<number>('server.port') || 0,
    };
  }

  get amadeus(): AmadeusConfig {
    return {
      apiKey: this.configService.get<string>('amadeus.apiKey') || '',
      apiSecret: this.configService.get<string>('amadeus.apiSecret') || '',
      baseUrl: this.configService.get<string>('amadeus.baseUrl') || '',
      authBaseUrl: this.configService.get<string>('amadeus.authBaseUrl') || '',
      timeout: this.configService.get<number>('amadeus.timeout') || 0,
    };
  }

  get frontend(): FrontendConfig {
    return {
      url: this.configService.get<string>('frontend.url') || '',
    };
  }
}
