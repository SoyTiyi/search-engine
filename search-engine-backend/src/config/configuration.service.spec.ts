import { Test, TestingModule } from '@nestjs/testing';
import { ConfigurationService } from './configuration.service';
import { ConfigService } from '@nestjs/config';

describe('ConfigurationService', () => {
  let service: ConfigurationService;
  let configService: jest.Mocked<ConfigService>;

  const mockConfigValues = {
    'server.port': 3000,
    'amadeus.apiKey': 'test-api-key',
    'amadeus.apiSecret': 'test-api-secret',
    'amadeus.baseUrl': 'https://test.api.amadeus.com',
    'amadeus.authBaseUrl': 'https://test.auth.amadeus.com',
    'amadeus.timeout': 5000,
    'frontend.url': 'http://localhost:3001',
    'cache.ttl': 300,
    'cache.max': 100,
    'cache.tokenTtl': 3600,
  };

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn((key: string) => mockConfigValues[key]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigurationService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<ConfigurationService>(ConfigurationService);
    configService = module.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('server', () => {
    it('should return server configuration', () => {
      const serverConfig = service.server;

      expect(serverConfig).toBeDefined();
      expect(serverConfig.port).toBe(3000);
      expect(configService.get).toHaveBeenCalledWith('server.port');
    });

    it('should return default value 0 when server.port is not configured', () => {
      configService.get.mockReturnValueOnce(undefined);

      const serverConfig = service.server;

      expect(serverConfig.port).toBe(0);
    });
  });

  describe('amadeus', () => {
    it('should return amadeus configuration', () => {
      const amadeusConfig = service.amadeus;

      expect(amadeusConfig).toBeDefined();
      expect(amadeusConfig.apiKey).toBe('test-api-key');
      expect(amadeusConfig.apiSecret).toBe('test-api-secret');
      expect(amadeusConfig.baseUrl).toBe('https://test.api.amadeus.com');
      expect(amadeusConfig.authBaseUrl).toBe('https://test.auth.amadeus.com');
      expect(amadeusConfig.timeout).toBe(5000);
      expect(configService.get).toHaveBeenCalledWith('amadeus.apiKey');
      expect(configService.get).toHaveBeenCalledWith('amadeus.apiSecret');
      expect(configService.get).toHaveBeenCalledWith('amadeus.baseUrl');
      expect(configService.get).toHaveBeenCalledWith('amadeus.authBaseUrl');
      expect(configService.get).toHaveBeenCalledWith('amadeus.timeout');
    });

    it('should return default empty string for apiKey when not configured', () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'amadeus.apiKey') return undefined;
        return mockConfigValues[key];
      });

      const amadeusConfig = service.amadeus;

      expect(amadeusConfig.apiKey).toBe('');
    });

    it('should return default empty string for apiSecret when not configured', () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'amadeus.apiSecret') return undefined;
        return mockConfigValues[key];
      });

      const amadeusConfig = service.amadeus;

      expect(amadeusConfig.apiSecret).toBe('');
    });

    it('should return default empty string for baseUrl when not configured', () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'amadeus.baseUrl') return undefined;
        return mockConfigValues[key];
      });

      const amadeusConfig = service.amadeus;

      expect(amadeusConfig.baseUrl).toBe('');
    });

    it('should return default empty string for authBaseUrl when not configured', () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'amadeus.authBaseUrl') return undefined;
        return mockConfigValues[key];
      });

      const amadeusConfig = service.amadeus;

      expect(amadeusConfig.authBaseUrl).toBe('');
    });

    it('should return default value 0 for timeout when not configured', () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'amadeus.timeout') return undefined;
        return mockConfigValues[key];
      });

      const amadeusConfig = service.amadeus;

      expect(amadeusConfig.timeout).toBe(0);
    });

    it('should return all default values when amadeus config is not configured', () => {
      configService.get.mockImplementation((key: string) => {
        if (key.startsWith('amadeus.')) return undefined;
        return mockConfigValues[key];
      });

      const amadeusConfig = service.amadeus;

      expect(amadeusConfig.apiKey).toBe('');
      expect(amadeusConfig.apiSecret).toBe('');
      expect(amadeusConfig.baseUrl).toBe('');
      expect(amadeusConfig.authBaseUrl).toBe('');
      expect(amadeusConfig.timeout).toBe(0);
    });
  });

  describe('frontend', () => {
    it('should return frontend configuration', () => {
      const frontendConfig = service.frontend;

      expect(frontendConfig).toBeDefined();
      expect(frontendConfig.url).toBe('http://localhost:3001');
      expect(configService.get).toHaveBeenCalledWith('frontend.url');
    });

    it('should return default empty string when frontend.url is not configured', () => {
      configService.get.mockReturnValueOnce(undefined);

      const frontendConfig = service.frontend;

      expect(frontendConfig.url).toBe('');
    });
  });

  describe('cache', () => {
    it('should return cache configuration', () => {
      const cacheConfig = service.cache;

      expect(cacheConfig).toBeDefined();
      expect(cacheConfig.ttl).toBe(300);
      expect(cacheConfig.max).toBe(100);
      expect(cacheConfig.tokenTtl).toBe(3600);
      expect(configService.get).toHaveBeenCalledWith('cache.ttl');
      expect(configService.get).toHaveBeenCalledWith('cache.max');
      expect(configService.get).toHaveBeenCalledWith('cache.tokenTtl');
    });

    it('should return default value 0 for ttl when not configured', () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'cache.ttl') return undefined;
        return mockConfigValues[key];
      });

      const cacheConfig = service.cache;

      expect(cacheConfig.ttl).toBe(0);
    });

    it('should return default value 0 for max when not configured', () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'cache.max') return undefined;
        return mockConfigValues[key];
      });

      const cacheConfig = service.cache;

      expect(cacheConfig.max).toBe(0);
    });

    it('should return default value 0 for tokenTtl when not configured', () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'cache.tokenTtl') return undefined;
        return mockConfigValues[key];
      });

      const cacheConfig = service.cache;

      expect(cacheConfig.tokenTtl).toBe(0);
    });

    it('should return all default values when cache config is not configured', () => {
      configService.get.mockImplementation((key: string) => {
        if (key.startsWith('cache.')) return undefined;
        return mockConfigValues[key];
      });

      const cacheConfig = service.cache;

      expect(cacheConfig.ttl).toBe(0);
      expect(cacheConfig.max).toBe(0);
      expect(cacheConfig.tokenTtl).toBe(0);
    });
  });

  describe('multiple getter calls', () => {
    it('should retrieve fresh values on each getter call', () => {
      const firstCall = service.server;
      expect(firstCall.port).toBe(3000);

      configService.get.mockReturnValueOnce(4000);

      const secondCall = service.server;
      expect(secondCall.port).toBe(4000);
    });

    it('should handle mixed configured and unconfigured values', () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'amadeus.apiKey') return 'configured-key';
        if (key === 'amadeus.apiSecret') return undefined;
        if (key === 'amadeus.baseUrl') return 'https://configured.url';
        if (key === 'amadeus.authBaseUrl') return undefined;
        if (key === 'amadeus.timeout') return 3000;
        return undefined;
      });

      const amadeusConfig = service.amadeus;

      expect(amadeusConfig.apiKey).toBe('configured-key');
      expect(amadeusConfig.apiSecret).toBe('');
      expect(amadeusConfig.baseUrl).toBe('https://configured.url');
      expect(amadeusConfig.authBaseUrl).toBe('');
      expect(amadeusConfig.timeout).toBe(3000);
    });
  });
});
