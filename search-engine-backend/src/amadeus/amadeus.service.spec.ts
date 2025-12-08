import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { AmadeusService } from './amadeus.service';
import { ConfigurationService } from 'src/config/configuration.service';
import { AuthService } from 'src/auth/auth.service';

describe('AmadeusService', () => {
  let service: AmadeusService;
  let httpService: jest.Mocked<HttpService>;
  let authService: jest.Mocked<AuthService>;

  const mockConfigService = {
    amadeus: {
      baseUrl: 'https://api.amadeus.com',
      timeout: 5000,
    },
  };

  const mockToken = { accessToken: 'test-token-123' };

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AmadeusService,
        {
          provide: ConfigurationService,
          useValue: mockConfigService,
        },
        {
          provide: AuthService,
          useValue: {
            getAccessToken: jest.fn().mockResolvedValue(mockToken),
            invalidateToken: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AmadeusService>(AmadeusService);
    httpService = module.get(HttpService);
    authService = module.get(AuthService);
  });

  describe('makeRequest - successful requests', () => {
    it('should make a successful GET request', async () => {
      const mockResponse: AxiosResponse = {
        data: { result: 'success' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      httpService.get.mockReturnValue(of(mockResponse));

      const result = await service.makeRequest('/v1/test-endpoint', { param1: 'value1' });

      expect(result).toEqual({ result: 'success' });
      expect(authService.getAccessToken).toHaveBeenCalled();
      expect(httpService.get).toHaveBeenCalledWith(
        'https://api.amadeus.com/v1/test-endpoint',
        expect.objectContaining({
          params: { param1: 'value1' },
          headers: {
            Authorization: 'Bearer test-token-123',
            accept: 'application/json',
          },
          timeout: 5000,
        }),
      );
    });

    it('should sanitize params removing null and undefined values', async () => {
      const mockResponse: AxiosResponse = {
        data: { result: 'success' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      httpService.get.mockReturnValue(of(mockResponse));

      await service.makeRequest('/v1/test', {
        valid: 'value',
        nullParam: null,
        undefinedParam: undefined,
        emptyString: '',
        zero: 0,
      });

      expect(httpService.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: { valid: 'value', emptyString: '', zero: 0 },
        }),
      );
    });

    it('should handle request without params', async () => {
      const mockResponse: AxiosResponse = {
        data: { data: [] },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      httpService.get.mockReturnValue(of(mockResponse));

      await service.makeRequest('/v1/endpoint');

      expect(httpService.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: undefined,
        }),
      );
    });

    it('should return undefined params when all values are null/undefined', async () => {
      const mockResponse: AxiosResponse = {
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      httpService.get.mockReturnValue(of(mockResponse));

      await service.makeRequest('/v1/test', {
        nullParam: null,
        undefinedParam: undefined,
      });

      expect(httpService.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: undefined,
        }),
      );
    });
  });

  describe('makeRequest - error handling', () => {
    it('should throw SERVICE_UNAVAILABLE when no response from API', async () => {
      const axiosError = new Error('Network Error') as AxiosError;
      axiosError.response = undefined;
      axiosError.isAxiosError = true;

      httpService.get.mockReturnValue(throwError(() => axiosError));

      let thrownError: HttpException | undefined;
      try {
        await service.makeRequest('/v1/test');
      } catch (error) {
        thrownError = error as HttpException;
      }

      expect(thrownError).toBeDefined();
      expect(thrownError).toBeInstanceOf(HttpException);
      expect(thrownError?.getStatus()).toBe(HttpStatus.SERVICE_UNAVAILABLE);
    });

    it('should throw BAD_REQUEST for 400 status', async () => {
      const axiosError = createAxiosError(400, {
        errors: [{ detail: 'Invalid parameter' }],
      });

      httpService.get.mockReturnValue(throwError(() => axiosError));

      let thrownError: HttpException | undefined;
      try {
        await service.makeRequest('/v1/test');
      } catch (error) {
        thrownError = error as HttpException;
      }

      expect(thrownError).toBeDefined();
      expect(thrownError?.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(thrownError?.message).toContain('Invalid parameter');
    });

    it('should throw NOT_FOUND for 404 status', async () => {
      const axiosError = createAxiosError(404, {
        errors: [{ title: 'Resource not found' }],
      });

      httpService.get.mockReturnValue(throwError(() => axiosError));

      let thrownError: HttpException | undefined;
      try {
        await service.makeRequest('/v1/test');
      } catch (error) {
        thrownError = error as HttpException;
      }

      expect(thrownError).toBeDefined();
      expect(thrownError?.getStatus()).toBe(HttpStatus.NOT_FOUND);
    });

    it('should throw UNAUTHORIZED for 401 after max retries', async () => {
      const axiosError = createAxiosError(401, {});

      httpService.get.mockReturnValue(throwError(() => axiosError));
      jest.spyOn(service as any, 'sleep').mockResolvedValue(undefined);

      let thrownError: HttpException | undefined;
      try {
        await service.makeRequest('/v1/test');
      } catch (error) {
        thrownError = error as HttpException;
      }

      expect(thrownError).toBeDefined();
      expect(thrownError?.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should throw TOO_MANY_REQUESTS for 429 after max retries', async () => {
      const axiosError = createAxiosError(429, {});

      httpService.get.mockReturnValue(throwError(() => axiosError));
      jest.spyOn(service as any, 'sleep').mockResolvedValue(undefined);

      let thrownError: HttpException | undefined;
      try {
        await service.makeRequest('/v1/test');
      } catch (error) {
        thrownError = error as HttpException;
      }

      expect(thrownError).toBeDefined();
      expect(thrownError?.getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
    });

    it('should use default message when no error details provided', async () => {
      const axiosError = createAxiosError(400, {});

      httpService.get.mockReturnValue(throwError(() => axiosError));

      let thrownError: HttpException | undefined;
      try {
        await service.makeRequest('/v1/test');
      } catch (error) {
        thrownError = error as HttpException;
      }

      expect(thrownError).toBeDefined();
      expect(thrownError?.message).toContain('Amadeus API error');
    });

    it('should handle unknown status codes with INTERNAL_SERVER_ERROR', async () => {
      const axiosError = createAxiosError(418, {
        errors: [{ detail: "I'm a teapot" }],
      });

      httpService.get.mockReturnValue(throwError(() => axiosError));

      let thrownError: HttpException | undefined;
      try {
        await service.makeRequest('/v1/test');
      } catch (error) {
        thrownError = error as HttpException;
      }

      expect(thrownError).toBeDefined();
      expect(thrownError?.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('makeRequest - retry logic', () => {
    beforeEach(() => {
      jest.spyOn(service as any, 'sleep').mockResolvedValue(undefined);
    });

    it('should retry on 401 and invalidate token', async () => {
      const axiosError = createAxiosError(401, {});
      const mockSuccessResponse: AxiosResponse = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      httpService.get
        .mockReturnValueOnce(throwError(() => axiosError))
        .mockReturnValueOnce(of(mockSuccessResponse));

      const result = await service.makeRequest('/v1/test');

      expect(authService.invalidateToken).toHaveBeenCalled();
      expect(httpService.get).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ success: true });
    });

    it('should retry on 403 and invalidate token', async () => {
      const axiosError = createAxiosError(403, {});
      const mockSuccessResponse: AxiosResponse = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      httpService.get
        .mockReturnValueOnce(throwError(() => axiosError))
        .mockReturnValueOnce(of(mockSuccessResponse));

      const result = await service.makeRequest('/v1/test');

      expect(authService.invalidateToken).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });

    it('should retry on 429 rate limit without invalidating token', async () => {
      const axiosError = createAxiosError(429, {});
      const mockSuccessResponse: AxiosResponse = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      httpService.get
        .mockReturnValueOnce(throwError(() => axiosError))
        .mockReturnValueOnce(of(mockSuccessResponse));

      await service.makeRequest('/v1/test');

      expect(authService.invalidateToken).not.toHaveBeenCalled();
      expect(httpService.get).toHaveBeenCalledTimes(2);
    });

    it('should retry on 500 server error', async () => {
      const axiosError = createAxiosError(500, {});
      const mockSuccessResponse: AxiosResponse = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      httpService.get
        .mockReturnValueOnce(throwError(() => axiosError))
        .mockReturnValueOnce(of(mockSuccessResponse));

      const result = await service.makeRequest('/v1/test');

      expect(httpService.get).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ success: true });
    });

    it('should stop retrying after max retries', async () => {
      const axiosError = createAxiosError(500, {});

      httpService.get.mockReturnValue(throwError(() => axiosError));

      let thrownError: HttpException | undefined;
      try {
        await service.makeRequest('/v1/test');
      } catch (error) {
        thrownError = error as HttpException;
      }

      expect(thrownError).toBeDefined();
      expect(thrownError?.getStatus()).toBe(HttpStatus.SERVICE_UNAVAILABLE);
      expect(httpService.get).toHaveBeenCalledTimes(4);
    });

    it('should not retry on 400 Bad Request', async () => {
      const axiosError = createAxiosError(400, {
        errors: [{ detail: 'Bad request' }],
      });

      httpService.get.mockReturnValue(throwError(() => axiosError));

      let thrownError: HttpException | undefined;
      try {
        await service.makeRequest('/v1/test');
      } catch (error) {
        thrownError = error as HttpException;
      }

      expect(thrownError).toBeDefined();
      expect(httpService.get).toHaveBeenCalledTimes(1);
    });

    it('should not retry on 404 Not Found', async () => {
      const axiosError = createAxiosError(404, {});

      httpService.get.mockReturnValue(throwError(() => axiosError));

      let thrownError: HttpException | undefined;
      try {
        await service.makeRequest('/v1/test');
      } catch (error) {
        thrownError = error as HttpException;
      }

      expect(thrownError).toBeDefined();
      expect(httpService.get).toHaveBeenCalledTimes(1);
    });
  });
});

function createAxiosError(status: number, data: any): AxiosError {
  const error = new Error('Axios Error') as AxiosError;
  error.response = {
    status,
    data,
    statusText: '',
    headers: {},
    config: {} as any,
  };
  error.isAxiosError = true;
  return error;
}