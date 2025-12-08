import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { HttpService } from '@nestjs/axios';
import { ConfigurationService } from 'src/config/configuration.service';
import { Cache } from 'cache-manager';
import { of, throwError } from 'rxjs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AxiosError } from 'axios';

describe('AuthService', () => {
  let service: AuthService;
  let httpService: jest.Mocked<HttpService>;
  let configService: jest.Mocked<ConfigurationService>;
  let cacheManager: jest.Mocked<Cache>;

  const mockConfigService = {
    amadeus: {
      authBaseUrl: 'https://test-auth.amadeus.com/v1/security/oauth2/token',
      apiKey: 'test-api-key',
      apiSecret: 'test-api-secret',
      timeout: 3000,
    },
    cache: {
      tokenTtl: 3600,
    },
  };

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
        AuthService,
        {
          provide: ConfigurationService,
          useValue: mockConfigService,
        },
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
        {
          provide: 'CACHE_MANAGER',
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    httpService = module.get(HttpService);
    configService = module.get(ConfigurationService);
    cacheManager = module.get('CACHE_MANAGER');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAccessToken', () => { 
    it('should return cached token if available', async () => {
      const cachedToken = 'cached-access-token-123';
      cacheManager.get.mockResolvedValue(cachedToken);

      const token = await service.getAccessToken();

      expect(token).toBeDefined();
      expect(token.accessToken).toBe(cachedToken);
      expect(token.wasCached).toBe(true);
      expect(cacheManager.get).toHaveBeenCalledWith('amadeus_access_token');
      expect(httpService.post).not.toHaveBeenCalled();
    });

    it('should fetch new token if no cached token is available', async () => {
      cacheManager.get.mockResolvedValue(null);
      
      const mockResponseData = {
        access_token: 'new-access-token-456',
        expires_in: 1800,
      };

      httpService.post.mockReturnValueOnce(
        of({ data: mockResponseData }) as any,
      );

      const token = await service.getAccessToken();

      expect(token).toBeDefined();
      expect(token.accessToken).toBe(mockResponseData.access_token);
      expect(token.expiresIn).toBe(mockResponseData.expires_in);
      expect(token.wasCached).toBe(false);
      expect(cacheManager.get).toHaveBeenCalledWith('amadeus_access_token');
      expect(httpService.post).toHaveBeenCalledWith(
        configService.amadeus.authBaseUrl,
        expect.any(URLSearchParams),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: configService.amadeus.timeout,
        }),
      );
      expect(cacheManager.set).toHaveBeenCalledWith(
        'amadeus_access_token',
        mockResponseData.access_token,
        configService.cache.tokenTtl * 1000,
      );
    });

    it('should fetch new token if cached token expires in less than 60 seconds', async () => {
      const cachedToken = 'expiring-token';
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 30 * 1000); 

      cacheManager.get
        .mockResolvedValueOnce(cachedToken)
        .mockResolvedValueOnce({
          expires_at: expiresAt,
          created_at: now,
        });

      const mockResponseData = {
        access_token: 'new-token-after-expiry',
        expires_in: 1800,
      };

      httpService.post.mockReturnValueOnce(
        of({ data: mockResponseData }) as any,
      );

      const token = await service.getAccessToken();

      expect(token).toBeDefined();
      expect(token.accessToken).toBe(mockResponseData.access_token);
      expect(token.wasCached).toBe(false);
      expect(httpService.post).toHaveBeenCalled();
    });

    it('should fetch new token if cache retrieval throws an error', async () => {
      cacheManager.get.mockRejectedValueOnce(new Error('Cache error'));

      const mockResponseData = {
        access_token: 'new-token-after-cache-error',
        expires_in: 1800,
      };

      httpService.post.mockReturnValueOnce(
        of({ data: mockResponseData }) as any,
      );

      const token = await service.getAccessToken();

      expect(token).toBeDefined();
      expect(token.accessToken).toBe(mockResponseData.access_token);
      expect(token.wasCached).toBe(false);
    });

    it('should return cached token if it exists without metadata', async () => {
      const cachedToken = 'token-without-metadata';

      cacheManager.get
        .mockResolvedValueOnce(cachedToken)
        .mockResolvedValueOnce(null);

      const token = await service.getAccessToken();

      expect(token).toBeDefined();
      expect(token.accessToken).toBe(cachedToken);
      expect(token.wasCached).toBe(true);
      expect(httpService.post).not.toHaveBeenCalled();
    });

    it('should return cached token if metadata exists without expires_at', async () => {
      const cachedToken = 'token-with-incomplete-metadata';
      const now = new Date();

      cacheManager.get
        .mockResolvedValueOnce(cachedToken)
        .mockResolvedValueOnce({
          created_at: now,
        });

      const token = await service.getAccessToken();

      expect(token).toBeDefined();
      expect(token.accessToken).toBe(cachedToken);
      expect(token.wasCached).toBe(true);
      expect(httpService.post).not.toHaveBeenCalled();
    });

    it('should throw HttpException with SERVICE_UNAVAILABLE when no response from API', async () => {
      cacheManager.get.mockResolvedValue(null);

      const networkError = {
        message: 'Network Error',
        name: 'AxiosError',
        config: {},
        isAxiosError: true,
        toJSON: () => ({}),
      } as AxiosError;

      httpService.post.mockReturnValueOnce(
        throwError(() => networkError) as any,
      );

      await expect(service.getAccessToken()).rejects.toThrow(
        new HttpException(
          'Unable to connect to Amadeus API',
          HttpStatus.SERVICE_UNAVAILABLE,
        ),
      );
    });

    it('should throw HttpException with BAD_REQUEST on 400 error', async () => {
      cacheManager.get.mockResolvedValue(null);

      const error400 = {
        message: 'Bad Request',
        name: 'AxiosError',
        config: {},
        isAxiosError: true,
        toJSON: () => ({}),
        response: {
          status: 400,
          data: {},
          statusText: 'Bad Request',
          headers: {},
          config: {} as any,
        },
      } as AxiosError;

      httpService.post.mockReturnValueOnce(
        throwError(() => error400) as any,
      );

      await expect(service.getAccessToken()).rejects.toThrow(
        new HttpException(
          'Invalid authentication request',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw HttpException with UNAUTHORIZED on 401 error', async () => {
      cacheManager.get.mockResolvedValue(null);

      const error401 = {
        message: 'Unauthorized',
        name: 'AxiosError',
        config: {},
        isAxiosError: true,
        toJSON: () => ({}),
        response: {
          status: 401,
          data: {},
          statusText: 'Unauthorized',
          headers: {},
          config: {} as any,
        },
      } as AxiosError;

      httpService.post.mockReturnValueOnce(
        throwError(() => error401) as any,
      );

      await expect(service.getAccessToken()).rejects.toThrow(
        new HttpException(
          'Invalid Amadeus API credentials',
          HttpStatus.UNAUTHORIZED,
        ),
      );
    });

    it('should throw HttpException with TOO_MANY_REQUESTS on 429 error', async () => {
      cacheManager.get.mockResolvedValue(null);

      const error429 = {
        message: 'Too Many Requests',
        name: 'AxiosError',
        config: {},
        isAxiosError: true,
        toJSON: () => ({}),
        response: {
          status: 429,
          data: {},
          statusText: 'Too Many Requests',
          headers: {},
          config: {} as any,
        },
      } as AxiosError;

      httpService.post.mockReturnValueOnce(
        throwError(() => error429) as any,
      );

      await expect(service.getAccessToken()).rejects.toThrow(
        new HttpException(
          'Too many authentication requests',
          HttpStatus.TOO_MANY_REQUESTS,
        ),
      );
    });

    it('should throw HttpException with SERVICE_UNAVAILABLE on 500 error', async () => {
      cacheManager.get.mockResolvedValue(null);

      const error500 = {
        message: 'Internal Server Error',
        name: 'AxiosError',
        config: {},
        isAxiosError: true,
        toJSON: () => ({}),
        response: {
          status: 500,
          data: {},
          statusText: 'Internal Server Error',
          headers: {},
          config: {} as any,
        },
      } as AxiosError;

      httpService.post.mockReturnValueOnce(
        throwError(() => error500) as any,
      );

      await expect(service.getAccessToken()).rejects.toThrow(
        new HttpException(
          'Amadeus API is temporarily unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        ),
      );
    });

    it('should throw HttpException with SERVICE_UNAVAILABLE on 502 error', async () => {
      cacheManager.get.mockResolvedValue(null);

      const error502 = {
        message: 'Bad Gateway',
        name: 'AxiosError',
        config: {},
        isAxiosError: true,
        toJSON: () => ({}),
        response: {
          status: 502,
          data: {},
          statusText: 'Bad Gateway',
          headers: {},
          config: {} as any,
        },
      } as AxiosError;

      httpService.post.mockReturnValueOnce(
        throwError(() => error502) as any,
      );

      await expect(service.getAccessToken()).rejects.toThrow(
        new HttpException(
          'Amadeus API is temporarily unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        ),
      );
    });

    it('should throw HttpException with SERVICE_UNAVAILABLE on 503 error', async () => {
      cacheManager.get.mockResolvedValue(null);

      const error503 = {
        message: 'Service Unavailable',
        name: 'AxiosError',
        config: {},
        isAxiosError: true,
        toJSON: () => ({}),
        response: {
          status: 503,
          data: {},
          statusText: 'Service Unavailable',
          headers: {},
          config: {} as any,
        },
      } as AxiosError;

      httpService.post.mockReturnValueOnce(
        throwError(() => error503) as any,
      );

      await expect(service.getAccessToken()).rejects.toThrow(
        new HttpException(
          'Amadeus API is temporarily unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        ),
      );
    });

    it('should throw HttpException with INTERNAL_SERVER_ERROR on unknown error code', async () => {
      cacheManager.get.mockResolvedValue(null);

      const error418 = {
        message: "I'm a teapot",
        name: 'AxiosError',
        config: {},
        isAxiosError: true,
        toJSON: () => ({}),
        response: {
          status: 418,
          data: {},
          statusText: "I'm a teapot",
          headers: {},
          config: {} as any,
        },
      } as AxiosError;

      httpService.post.mockReturnValueOnce(
        throwError(() => error418) as any,
      );

      await expect(service.getAccessToken()).rejects.toThrow(
        new HttpException(
          'Authentication failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });

    it('should cache both token and metadata when fetching new token', async () => {
      cacheManager.get.mockResolvedValue(null);

      const mockResponseData = {
        access_token: 'test-token-for-metadata',
        expires_in: 1800,
      };

      httpService.post.mockReturnValueOnce(
        of({ data: mockResponseData }) as any,
      );

      await service.getAccessToken();

      expect(cacheManager.set).toHaveBeenCalledTimes(2);

      expect(cacheManager.set).toHaveBeenNthCalledWith(
        1,
        'amadeus_access_token',
        mockResponseData.access_token,
        configService.cache.tokenTtl * 1000,
      );

      expect(cacheManager.set).toHaveBeenNthCalledWith(
        2,
        'amadeus_token_metadata',
        expect.objectContaining({
          expires_at: expect.any(Date),
          created_at: expect.any(Date),
        }),
        configService.cache.tokenTtl * 1000,
      );
    });
  });

  describe('invalidateToken', () => {
    it('should delete both token and metadata from cache', async () => {
      cacheManager.del = jest.fn().mockResolvedValue(undefined);

      await service.invalidateToken();

      expect(cacheManager.del).toHaveBeenCalledTimes(2);
      expect(cacheManager.del).toHaveBeenCalledWith('amadeus_access_token');
      expect(cacheManager.del).toHaveBeenCalledWith('amadeus_token_metadata');
    });

    it('should handle errors when deleting from cache', async () => {
      cacheManager.del = jest
        .fn()
        .mockRejectedValue(new Error('Delete failed'));

      await expect(service.invalidateToken()).resolves.not.toThrow();
      expect(cacheManager.del).toHaveBeenCalled();
    });
  });
});
