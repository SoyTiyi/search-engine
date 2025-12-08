import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

describe('HealthController', () => {
  let controller: HealthController;
  let healthCheckService: jest.Mocked<HealthCheckService>;
  let httpHealthIndicator: jest.Mocked<HttpHealthIndicator>;

  beforeEach(async () => {
    const mockHealthCheckService = {
      check: jest.fn(),
    };

    const mockHttpHealthIndicator = {
      pingCheck: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: mockHealthCheckService,
        },
        {
          provide: HttpHealthIndicator,
          useValue: mockHttpHealthIndicator,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthCheckService = module.get(HealthCheckService);
    httpHealthIndicator = module.get(HttpHealthIndicator);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should return health check result when all checks pass', async () => {
      const mockHealthCheckResult = {
        status: 'ok',
        info: {
          'nestjs-docs': {
            status: 'up',
          },
        },
        error: {},
        details: {
          'nestjs-docs': {
            status: 'up',
          },
        },
      };

      healthCheckService.check.mockResolvedValue(mockHealthCheckResult as any);

      const result = await controller.check();

      expect(result).toBeDefined();
      expect(result.status).toBe('ok');
      expect(result.details['nestjs-docs'].status).toBe('up');
      expect(healthCheckService.check).toHaveBeenCalledTimes(1);
      expect(healthCheckService.check).toHaveBeenCalledWith([
        expect.any(Function),
      ]);
    });

    it('should call pingCheck with correct parameters', async () => {
      const mockPingCheckResult = {
        'nestjs-docs': {
          status: 'up',
        },
      };

      httpHealthIndicator.pingCheck.mockResolvedValue(
        mockPingCheckResult as any,
      );

      healthCheckService.check.mockImplementation(async (indicators) => {
        const results = await Promise.all(indicators.map((fn) => fn()));
        return {
          status: 'ok',
          info: Object.assign({}, ...results),
          error: {},
          details: Object.assign({}, ...results),
        } as any;
      });

      await controller.check();

      expect(httpHealthIndicator.pingCheck).toHaveBeenCalledWith(
        'nestjs-docs',
        'https://docs.nestjs.com',
      );
    });

    it('should return error status when health check fails', async () => {
      const mockHealthCheckError = {
        status: 'error',
        info: {},
        error: {
          'nestjs-docs': {
            status: 'down',
            message: 'Service unavailable',
          },
        },
        details: {
          'nestjs-docs': {
            status: 'down',
            message: 'Service unavailable',
          },
        },
      };

      healthCheckService.check.mockResolvedValue(
        mockHealthCheckError as any,
      );

      const result = await controller.check();

      expect(result).toBeDefined();
      expect(result.status).toBe('error');
      expect(result.error).toBeDefined();
      expect(result.error!['nestjs-docs'].status).toBe('down');
      expect(healthCheckService.check).toHaveBeenCalledTimes(1);
    });

    it('should handle ping check timeout', async () => {
      httpHealthIndicator.pingCheck.mockRejectedValue(
        new Error('Timeout'),
      );

      healthCheckService.check.mockImplementation(async (indicators) => {
        try {
          await Promise.all(indicators.map((fn) => fn()));
        } catch (error) {
          return {
            status: 'error',
            info: {},
            error: {
              'nestjs-docs': {
                status: 'down',
                message: error.message,
              },
            },
            details: {
              'nestjs-docs': {
                status: 'down',
                message: error.message,
              },
            },
          } as any;
        }
      });

      const result = await controller.check();

      expect(result).toBeDefined();
      expect(result.status).toBe('error');
    });

    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network error');

      httpHealthIndicator.pingCheck.mockRejectedValue(networkError);

      healthCheckService.check.mockImplementation(async (indicators) => {
        try {
          await Promise.all(indicators.map((fn) => fn()));
        } catch (error) {
          return {
            status: 'error',
            info: {},
            error: {
              'nestjs-docs': {
                status: 'down',
                message: 'Network error',
              },
            },
            details: {
              'nestjs-docs': {
                status: 'down',
                message: 'Network error',
              },
            },
          } as any;
        }
      });

      const result = await controller.check();

      expect(result).toBeDefined();
      expect(result.status).toBe('error');
      expect(result.error).toBeDefined();
      expect(result.error!['nestjs-docs'].message).toBe('Network error');
    });

    it('should execute health check indicators in order', async () => {
      const executionOrder: string[] = [];

      httpHealthIndicator.pingCheck.mockImplementation(async () => {
        executionOrder.push('pingCheck');
        return { 'nestjs-docs': { status: 'up' } } as any;
      });

      healthCheckService.check.mockImplementation(async (indicators) => {
        executionOrder.push('check-start');
        await Promise.all(indicators.map((fn) => fn()));
        executionOrder.push('check-end');
        return {
          status: 'ok',
          info: {},
          error: {},
          details: {},
        } as any;
      });

      await controller.check();

      expect(executionOrder).toEqual(['check-start', 'pingCheck', 'check-end']);
    });

    it('should return proper health check response structure', async () => {
      const mockResponse = {
        status: 'ok',
        info: {
          'nestjs-docs': {
            status: 'up',
          },
        },
        error: {},
        details: {
          'nestjs-docs': {
            status: 'up',
          },
        },
      };

      healthCheckService.check.mockResolvedValue(mockResponse as any);

      const result = await controller.check();

      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('info');
      expect(result).toHaveProperty('error');
      expect(result).toHaveProperty('details');
    });
  });
});
