import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { ConfigurationService } from 'src/config/configuration.service';
import {
  AmadeusTokenResponse,
  AmadeusToken,
} from './interfaces/amadeus-token.interface';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {
  private readonly authBaseUrl: string;
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly timeout: number;

  constructor(
    private configService: ConfigurationService,
    private httpService: HttpService,
  ) {
    this.authBaseUrl = this.configService.amadeus.authBaseUrl;
    this.apiKey = this.configService.amadeus.apiKey;
    this.apiSecret = this.configService.amadeus.apiSecret;
    this.timeout = this.configService.amadeus.timeout;
  }

  async getAccessToken(): Promise<AmadeusToken> {
    const requestBody = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: this.apiKey,
      client_secret: this.apiSecret,
    });

    const response = await firstValueFrom(
      this.httpService
        .post<AmadeusTokenResponse>(this.authBaseUrl, requestBody, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: this.timeout,
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.handleAuthError(error);
            throw error;
          }),
        ),
    );

    const { accessToken, expiresIn } = response.data;

    return { accessToken, expiresIn };
  }

  private handleAuthError(error: AxiosError): void {
    if (!error.response) {
      throw new HttpException(
        'Unable to connect to Amadeus API',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const status = error.response.status;
    const data = error.response.data as any;

    switch (status) {
      case 400:
        throw new HttpException(
          'Invalid authentication request',
          HttpStatus.BAD_REQUEST,
        );

      case 401:
        throw new HttpException(
          'Invalid Amadeus API credentials',
          HttpStatus.UNAUTHORIZED,
        );

      case 429:
        throw new HttpException(
          'Too many authentication requests',
          HttpStatus.TOO_MANY_REQUESTS,
        );

      case 500:
      case 502:
      case 503:
        throw new HttpException(
          'Amadeus API is temporarily unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        );

      default:
        throw new HttpException(
          'Authentication failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
}
