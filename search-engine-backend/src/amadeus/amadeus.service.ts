import { Injectable } from '@nestjs/common';
import { ConfigurationService } from 'src/config/configuration.service';
import { AuthService } from 'src/auth/auth.service';
import { firstValueFrom, catchError } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AmadeusService {
  private readonly baseUrl: string;
  private readonly timeout: number;

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
  ): Promise<T> {
    try {
      const token = await this.authService.getAccessToken();
      const url = new URL(`${this.baseUrl}${endpoint}`);

      const requestConfig = {
        params: this.sanitizeParams(params),
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
      throw error;
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

  private handleRequestError(error: any): void {
    // Implement error handling logic specific to Amadeus API requests
  }
}
