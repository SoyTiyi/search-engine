import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigurationService } from '../config/configuration.service';
import { AuthService } from '../auth/auth.service';
import { firstValueFrom, catchError } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AmadeusError } from './interfaces/amadeus.interfaces';
import { AxiosError } from 'axios';

@Injectable()
export class AmadeusService {
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly maxRetries: number = 3;
  private readonly retryableStatusCodes: number[] = [401, 403, 408, 429, 500, 502, 503, 504];

  constructor(
    private configService: ConfigurationService,
    private authService: AuthService,
    private httpService: HttpService,
  ) {
    this.baseUrl = this.configService.amadeus.baseUrl;
    this.timeout = this.configService.amadeus.timeout;
  }

  async makeRequest<T>(
    endpoint: string,
    params?: Record<string, any>,
    retryCount = 0,
  ): Promise<T> {
    try {
      const token = await this.authService.getAccessToken();
      const url = new URL(`${this.baseUrl}${endpoint}`);
      const sanitizedParams = this.sanitizeParams(params)

      const requestConfig = {
        params: sanitizedParams,
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          accept: 'application/json',
        },
        timeout: this.timeout,
      };

      const response = await firstValueFrom(
        this.httpService.get<T>(url.toString(), requestConfig).pipe(
          catchError((error) => {
            console.error('Error occurred while making request:', error);
            throw error;
          }),
        ),
      );

      return response.data;
    } catch (error) {
      console.error('Error occurred while making request:', error);
      return this.handleRequestError(error, endpoint, params || {}, retryCount);
    }
  }

  private sanitizeParams(
    params?: Record<string, any>,
  ): Record<string, any> | undefined {
    if (!params) {
      return undefined;
    }

    const sanitized: Record<string, any> = {};

    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value !== undefined && value !== null) {
        sanitized[key] = value;
      }
    });

    return Object.keys(sanitized).length > 0 ? sanitized : undefined;
  }

  private async handleRequestError<T>(
    error: any,
    endpoint: string,
    params: Record<string, any>,
    retryCount = 0
  ): Promise<T> {

    const axiosError = error as AxiosError<AmadeusError>;
    const status = error.response?.status;

    if (this.shouldRetry(status, retryCount)) {
      console.log(`Retrying request to ${endpoint}. Attempt ${retryCount + 1}`);
      if (status === 401 || status === 403) {
        await this.authService.invalidateToken();
      }

      await this.sleep(Math.pow(2, retryCount) * 100);

      return this.makeRequest<T>(endpoint, params, retryCount + 1);
    }

    throw this.buildHttpException(axiosError);
  }

  private shouldRetry(status: number, retryCount: number): boolean {
    return (
      this.retryableStatusCodes.includes(status) &&
      retryCount < this.maxRetries
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private buildHttpException(
    error: AxiosError<AmadeusError>,
  ): HttpException {
    if (!error.response) {
      return new HttpException(
        'Unable to connect to Amadeus API',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const status = error.response.status;
    const errorData = error.response.data;

    let message = 'Amadeus API error';
    if (errorData?.errors && errorData.errors.length > 0) {
      const firstError = errorData.errors[0];
      message = firstError.detail || firstError.title || message;
    }

    switch (status) {
      case 400:
        return new HttpException(
          `Bad request: ${message}`,
          HttpStatus.BAD_REQUEST,
        );

      case 401:
        return new HttpException(
          'Unauthorized: Invalid API credentials',
          HttpStatus.UNAUTHORIZED,
        );

      case 403:
        return new HttpException(
          'Forbidden: Access denied',
          HttpStatus.FORBIDDEN,
        );

      case 404:
        return new HttpException(
          `Not found: ${message}`,
          HttpStatus.NOT_FOUND,
        );

      case 429:
        return new HttpException(
          'Too many requests: Rate limit exceeded',
          HttpStatus.TOO_MANY_REQUESTS,
        );

      case 500:
      case 502:
      case 503:
      case 504:
        return new HttpException(
          'Amadeus API temporarily unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        );

      default:
        return new HttpException(
          `Amadeus API error: ${message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
}
