import { Injectable, HttpStatus, HttpException, Inject } from '@nestjs/common';
import { ConfigurationService } from 'src/config/configuration.service';
import {
  AmadeusTokenResponse,
  AmadeusToken,
} from './interfaces/amadeus-token.interface';
import { CachedToken } from 'src/amadeus/interfaces/amadeus.interfaces';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  private readonly authBaseUrl: string;
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly timeout: number;
  private readonly tokenTtl: number;

  private readonly TOKEN_CACHE_KEY = 'amadeus_access_token';
  private readonly TOKEN_METADATA_KEY = 'amadeus_token_metadata';

  constructor(
    private configService: ConfigurationService,
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.authBaseUrl = this.configService.amadeus.authBaseUrl;
    this.apiKey = this.configService.amadeus.apiKey;
    this.apiSecret = this.configService.amadeus.apiSecret;
    this.timeout = this.configService.amadeus.timeout;
    this.tokenTtl = this.configService.cache.tokenTtl;
  }

  async getAccessToken(): Promise<AmadeusToken> {
    const requestBody = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: this.apiKey,
      client_secret: this.apiSecret,
    });

    const cachedToken = await this.getCachedToken();

    if (cachedToken) {
      console.log('Using cached access token');
      return { accessToken: cachedToken, expiresIn: 0, wasCached: true };
    }

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

    const { access_token, expires_in } = response.data;

    console.log('Access token retrieved successfully');

    await this.cacheToken(access_token, expires_in);

    return {
      accessToken: access_token,
      expiresIn: expires_in,
      wasCached: false,
    };
  }

  private async getCachedToken(): Promise<string | null> {
    try {
      const token = await this.cacheManager.get<string>(this.TOKEN_CACHE_KEY);

      if (!token) {
        return null;
      }

      const metadata = await this.cacheManager.get<CachedToken>(
        this.TOKEN_METADATA_KEY,
      );

      if (metadata && metadata.expires_at) {
        const expiresAt = new Date(metadata.expires_at);
        const now = new Date();
        const timeRemaining = (expiresAt.getTime() - now.getTime()) / 1000;

        if (timeRemaining < 60) {
          return null;
        }
      }

      return token;
    } catch (error) {
      console.error('Error retrieving token from cache:', error);
      return null;
    }
  }

  private async cacheToken(token: string, expiresIn: number): Promise<void> {
    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + expiresIn * 1000);

      const ttlMilliseconds = this.tokenTtl * 1000;

      await this.cacheManager.set(this.TOKEN_CACHE_KEY, token, ttlMilliseconds);

      const metadata: CachedToken = {
        expires_at: expiresAt,
        created_at: now,
      };

      await this.cacheManager.set(
        this.TOKEN_METADATA_KEY,
        metadata,
        ttlMilliseconds,
      );

      console.log('Access token cached successfully');
    } catch (error) {
      console.error('Error caching token:', error);
    }
  }

  async invalidateToken(): Promise<void> {
    try {
      await this.cacheManager.del(this.TOKEN_CACHE_KEY);
      await this.cacheManager.del(this.TOKEN_METADATA_KEY);
    } catch (error) {
      console.error('Error invalidating token:', error);
    }
  }

  private handleAuthError(error: AxiosError): void {
    if (!error.response) {
      throw new HttpException(
        'Unable to connect to Amadeus API',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const status = error.response.status;

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
