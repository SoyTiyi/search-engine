import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigurationService {
  constructor(private configService: NestConfigService) {}

  get server(): { port: string } {
    return {
        port: this.configService.get<string>('server.port') || '',
    };
  }

  get amadeus(): {
    apiKey: string;
    apiSecret: string;
    baseUrl: string;
    authBaseUrl: string;
    timeout: number;
  } {
    return {
        apiKey: this.configService.get<string>('amadeus.apiKey') || '',
        apiSecret: this.configService.get<string>('amadeus.apiSecret') || '',
        baseUrl: this.configService.get<string>('amadeus.baseUrl') || '',
        authBaseUrl: this.configService.get<string>('amadeus.authBaseUrl') || '',
        timeout: this.configService.get<number>('amadeus.timeout') || 0,
    };
  }

  get frontend(): { url: string } {
    return {
        url: this.configService.get<string>('frontend.url') || '',
    };
  }
}