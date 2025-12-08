import { Test, TestingModule } from '@nestjs/testing';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';
import { SearchFlightsDto } from './dto/search-flights.dto';
import { SearchLocationDto } from './dto/search-location.dto';
import { FlightOffersResponseDto } from './dto/flight-response.dto';
import { LocationResponseDto } from './dto/location-response.dto';
import { SearchHistory } from './entities/search-history.entity';

describe('FlightsController', () => {
  let controller: FlightsController;
  let flightsService: jest.Mocked<FlightsService>;

  const mockFlightsService = {
    searchFlights: jest.fn(),
    searchLocations: jest.fn(),
    getSearchHistory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlightsController],
      providers: [
        {
          provide: FlightsService,
          useValue: mockFlightsService,
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

    controller = module.get<FlightsController>(FlightsController);
    flightsService = module.get(FlightsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('searchFlights', () => {
    const mockSearchDto: SearchFlightsDto = {
      origin: 'MAD',
      destination: 'BCN',
      departureDate: '2025-12-15',
      adults: 1,
    };

    const mockFlightResponse: FlightOffersResponseDto = {
      success: true,
      data: [
        {
          type: 'flight-offer',
          id: '1',
          origin: 'MAD',
          destination: 'BCN',
          airline: 'Iberia',
          flight_number: 'IB1234',
          departureDate: '2025-12-15T10:00:00',
          arrivalDate: '2025-12-15T11:30:00',
          duration: 'PT1H30M',
          price: 150.0,
          currency: 'EUR',
          numberOfBookableSeats: 5,
        },
      ],
      meta: {
        count: 1,
        timestamp: new Date().toISOString(),
      },
    };

    it('should search flights and return results', async () => {
      flightsService.searchFlights.mockResolvedValue(mockFlightResponse);

      const result = await controller.searchFlights(mockSearchDto);

      expect(result).toBeDefined();
      expect(result).toEqual(mockFlightResponse);
      expect(flightsService.searchFlights).toHaveBeenCalledWith(mockSearchDto);
      expect(flightsService.searchFlights).toHaveBeenCalledTimes(1);
    });

    it('should pass all query parameters to service', async () => {
      const detailedDto: SearchFlightsDto = {
        origin: 'MAD',
        destination: 'BCN',
        departureDate: '2025-12-15',
        adults: 2,
        maxPrice: 200,
        nonStop: true,
        currencyCode: 'USD',
      };

      flightsService.searchFlights.mockResolvedValue(mockFlightResponse);

      await controller.searchFlights(detailedDto);

      expect(flightsService.searchFlights).toHaveBeenCalledWith(detailedDto);
    });

    it('should handle empty results', async () => {
      const emptyResponse: FlightOffersResponseDto = {
        success: true,
        data: [],
        meta: {
          count: 0,
          timestamp: new Date().toISOString(),
        },
      };

      flightsService.searchFlights.mockResolvedValue(emptyResponse);

      const result = await controller.searchFlights(mockSearchDto);

      expect(result).toBeDefined();
      expect(result.data).toHaveLength(0);
      expect(result.meta.count).toBe(0);
    });

    it('should propagate service errors', async () => {
      const error = new Error('Service error');
      flightsService.searchFlights.mockRejectedValue(error);

      await expect(controller.searchFlights(mockSearchDto)).rejects.toThrow(
        'Service error',
      );
    });

    it('should handle multiple flight offers', async () => {
      const multipleFlightsResponse: FlightOffersResponseDto = {
        success: true,
        data: [
          {
            type: 'flight-offer',
            id: '1',
            origin: 'MAD',
            destination: 'BCN',
            airline: 'Iberia',
            flight_number: 'IB1234',
            departureDate: '2025-12-15T10:00:00',
            arrivalDate: '2025-12-15T11:30:00',
            duration: 'PT1H30M',
            price: 150.0,
            currency: 'EUR',
            numberOfBookableSeats: 5,
          },
          {
            type: 'flight-offer',
            id: '2',
            origin: 'MAD',
            destination: 'BCN',
            airline: 'Vueling',
            flight_number: 'VY2345',
            departureDate: '2025-12-15T14:00:00',
            arrivalDate: '2025-12-15T15:30:00',
            duration: 'PT1H30M',
            price: 120.0,
            currency: 'EUR',
            numberOfBookableSeats: 3,
          },
        ],
        meta: {
          count: 2,
          timestamp: new Date().toISOString(),
        },
      };

      flightsService.searchFlights.mockResolvedValue(multipleFlightsResponse);

      const result = await controller.searchFlights(mockSearchDto);

      expect(result.data).toHaveLength(2);
      expect(result.meta.count).toBe(2);
    });
  });

  describe('searchLocations', () => {
    const mockLocationDto: SearchLocationDto = {
      keyword: 'Madrid',
    };

    const mockLocationResponse: LocationResponseDto = {
      success: true,
      data: [
        {
          iataCode: 'MAD',
          name: 'ADOLFO SUAREZ BARAJAS',
          detailedName: 'Madrid/ES:Adolfo Suarez Barajas',
          subType: 'AIRPORT',
          countryName: 'Spain',
        },
        {
          iataCode: 'MAD',
          name: 'Madrid',
          detailedName: 'Madrid, Spain',
          subType: 'CITY',
          countryName: 'Spain',
        },
      ],
    };

    it('should search locations and return results', async () => {
      flightsService.searchLocations.mockResolvedValue(mockLocationResponse);

      const result = await controller.searchLocations(mockLocationDto);

      expect(result).toBeDefined();
      expect(result).toEqual(mockLocationResponse);
      expect(flightsService.searchLocations).toHaveBeenCalledWith(
        mockLocationDto,
      );
      expect(flightsService.searchLocations).toHaveBeenCalledTimes(1);
    });

    it('should pass keyword parameter to service', async () => {
      flightsService.searchLocations.mockResolvedValue(mockLocationResponse);

      await controller.searchLocations(mockLocationDto);

      expect(flightsService.searchLocations).toHaveBeenCalledWith({
        keyword: 'Madrid',
      });
    });

    it('should handle empty location results', async () => {
      const emptyResponse: LocationResponseDto = {
        success: true,
        data: [],
      };

      flightsService.searchLocations.mockResolvedValue(emptyResponse);

      const result = await controller.searchLocations(mockLocationDto);

      expect(result).toBeDefined();
      expect(result.data).toHaveLength(0);
    });

    it('should propagate service errors', async () => {
      const error = new Error('Location service error');
      flightsService.searchLocations.mockRejectedValue(error);

      await expect(
        controller.searchLocations(mockLocationDto),
      ).rejects.toThrow('Location service error');
    });

    it('should handle different keyword searches', async () => {
      const barcelonaDto: SearchLocationDto = {
        keyword: 'Barcelona',
      };

      const barcelonaResponse: LocationResponseDto = {
        success: true,
        data: [
          {
            iataCode: 'BCN',
            name: 'BARCELONA EL PRAT',
            detailedName: 'Barcelona/ES:El Prat',
            subType: 'AIRPORT',
            countryName: 'Spain',
          },
        ],
      };

      flightsService.searchLocations.mockResolvedValue(barcelonaResponse);

      const result = await controller.searchLocations(barcelonaDto);

      expect(result.data).toHaveLength(1);
      expect(result.data[0].iataCode).toBe('BCN');
      expect(flightsService.searchLocations).toHaveBeenCalledWith(
        barcelonaDto,
      );
    });

    it('should return both airports and cities', async () => {
      flightsService.searchLocations.mockResolvedValue(mockLocationResponse);

      const result = await controller.searchLocations(mockLocationDto);

      const airports = result.data.filter((loc) => loc.subType === 'AIRPORT');
      const cities = result.data.filter((loc) => loc.subType === 'CITY');

      expect(airports).toHaveLength(1);
      expect(cities).toHaveLength(1);
    });
  });

  describe('getHistory', () => {
    const mockHistory: SearchHistory[] = [
      {
        id: "1",
        origin: 'MAD',
        destination: 'BCN',
        departureDate: '2025-12-15',
        returnDate: '2025-12-20',
        resultsCount: 5,
        createdAt: new Date('2025-12-08T10:00:00'),
      },
      {
        id: "2",
        origin: 'BCN',
        destination: 'MAD',
        departureDate: '2025-12-20',
        returnDate: '2025-12-25',
        resultsCount: 3,
        createdAt: new Date('2025-12-07T10:00:00'),
      },
    ];

    it('should return search history', async () => {
      flightsService.getSearchHistory.mockResolvedValue(mockHistory);

      const result = await controller.getHistory();

      expect(result).toBeDefined();
      expect(result).toEqual(mockHistory);
      expect(flightsService.getSearchHistory).toHaveBeenCalledTimes(1);
    });

    it('should handle empty history', async () => {
      flightsService.getSearchHistory.mockResolvedValue([]);

      const result = await controller.getHistory();

      expect(result).toBeDefined();
      expect(result).toEqual([]);
    });

    it('should propagate service errors', async () => {
      const error = new Error('History service error');
      flightsService.getSearchHistory.mockRejectedValue(error);

      await expect(controller.getHistory()).rejects.toThrow(
        'History service error',
      );
    });

    it('should return history in correct order', async () => {
      flightsService.getSearchHistory.mockResolvedValue(mockHistory);

      const result = await controller.getHistory();

      expect(result[0].createdAt.getTime()).toBeGreaterThan(
        result[1].createdAt.getTime(),
      );
    });

    it('should return all history fields', async () => {
      flightsService.getSearchHistory.mockResolvedValue(mockHistory);

      const result = await controller.getHistory();

      result.forEach((entry) => {
        expect(entry).toHaveProperty('id');
        expect(entry).toHaveProperty('origin');
        expect(entry).toHaveProperty('destination');
        expect(entry).toHaveProperty('departureDate');
        expect(entry).toHaveProperty('resultsCount');
        expect(entry).toHaveProperty('createdAt');
      });
    });
  });
});
