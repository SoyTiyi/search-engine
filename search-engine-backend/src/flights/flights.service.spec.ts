import { Test, TestingModule } from '@nestjs/testing';
import { FlightsService } from './flights.service';
import { AmadeusService } from 'src/amadeus/amadeus.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SearchHistory } from './entities/search-history.entity';
import { SearchFlightsDto } from './dto/search-flights.dto';
import { SearchLocationDto } from './dto/search-location.dto';
import {
  AmadeusFlightOffersResponse,
  AmadeusFlightOffer,
} from './interfaces/amadeus-flight.interface';
import { AmadeusLocationsResponse } from './interfaces/amadeus-location.interface';

describe('FlightsService', () => {
  let service: FlightsService;
  let amadeusService: jest.Mocked<AmadeusService>;
  let searchHistoryRepository: jest.Mocked<Repository<SearchHistory>>;

  const mockSearchHistoryRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockAmadeusService = {
    makeRequest: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlightsService,
        {
          provide: AmadeusService,
          useValue: mockAmadeusService,
        },
        {
          provide: getRepositoryToken(SearchHistory),
          useValue: mockSearchHistoryRepository,
        },
      ],
    }).compile();

    service = module.get<FlightsService>(FlightsService);
    amadeusService = module.get(AmadeusService);
    searchHistoryRepository = module.get(getRepositoryToken(SearchHistory));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchFlights', () => {
    const mockSearchDto: SearchFlightsDto = {
      origin: 'MAD',
      destination: 'BCN',
      departureDate: '2025-12-15',
      adults: 1,
    };

    const mockAmadeusResponse: AmadeusFlightOffersResponse = {
      data: [
        {
          id: '1',
          type: 'flight-offer',
          source: 'GDS',
          instantTicketingRequired: false,
          nonHomogeneous: false,
          oneWay: false,
          lastTicketingDate: '2025-12-14',
          numberOfBookableSeats: 5,
          itineraries: [
            {
              duration: 'PT1H30M',
              segments: [
                {
                  departure: {
                    iataCode: 'MAD',
                    at: '2025-12-15T10:00:00',
                  },
                  arrival: {
                    iataCode: 'BCN',
                    at: '2025-12-15T11:30:00',
                  },
                  carrierCode: 'IB',
                  number: '1234',
                  aircraft: {
                    code: '320',
                  },
                  duration: 'PT1H30M',
                  id: '1',
                  numberOfStops: 0,
                  blacklistedInEU: false,
                },
              ],
            },
          ],
          price: {
            total: '150.00',
            currency: 'EUR',
            base: '120.00',
            fees: [],
            grandTotal: '150.00',
          },
          pricingOptions: {
            fareType: ['PUBLISHED'],
            includedCheckedBagsOnly: true,
          },
          validatingAirlineCodes: ['IB'],
          travelerPricings: [],
        },
      ],
      dictionaries: {
        carriers: {
          IB: 'Iberia',
        },
        locations: {},
        aircraft: {},
        currencies: {},
      },
      meta: {
        count: 1,
        links: {
          self: 'https://test.api.amadeus.com/v2/shopping/flight-offers',
        },
      },
    };

    it('should search flights and return transformed response', async () => {
      amadeusService.makeRequest.mockResolvedValue(mockAmadeusResponse);
      searchHistoryRepository.create.mockReturnValue({} as any);
      searchHistoryRepository.save.mockResolvedValue({} as any);

      const result = await service.searchFlights(mockSearchDto);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toMatchObject({
        type: 'flight-offer',
        id: '1',
        origin: 'MAD',
        destination: 'BCN',
        airline: 'Iberia',
        flight_number: 'IB1234',
        price: 150.0,
        currency: 'EUR',
        numberOfBookableSeats: 5,
      });
      expect(result.meta.count).toBe(1);
    });

    it('should call AmadeusService with correct endpoint and params', async () => {
      amadeusService.makeRequest.mockResolvedValue(mockAmadeusResponse);
      searchHistoryRepository.create.mockReturnValue({} as any);
      searchHistoryRepository.save.mockResolvedValue({} as any);

      await service.searchFlights(mockSearchDto);

      expect(amadeusService.makeRequest).toHaveBeenCalledWith(
        '/v2/shopping/flight-offers',
        expect.objectContaining({
          originLocationCode: 'MAD',
          destinationLocationCode: 'BCN',
          departureDate: '2025-12-15',
          adults: 1,
          max: 10,
          currencyCode: 'EUR',
        }),
      );
    });

    it('should convert origin and destination to uppercase', async () => {
      const lowerCaseDto: SearchFlightsDto = {
        origin: 'mad',
        destination: 'bcn',
        departureDate: '2025-12-15',
        adults: 1,
      };

      amadeusService.makeRequest.mockResolvedValue(mockAmadeusResponse);
      searchHistoryRepository.create.mockReturnValue({} as any);
      searchHistoryRepository.save.mockResolvedValue({} as any);

      await service.searchFlights(lowerCaseDto);

      expect(amadeusService.makeRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          originLocationCode: 'MAD',
          destinationLocationCode: 'BCN',
        }),
      );
    });

    it('should include maxPrice in params when provided', async () => {
      const dtoWithMaxPrice: SearchFlightsDto = {
        ...mockSearchDto,
        maxPrice: 200.99,
      };

      amadeusService.makeRequest.mockResolvedValue(mockAmadeusResponse);
      searchHistoryRepository.create.mockReturnValue({} as any);
      searchHistoryRepository.save.mockResolvedValue({} as any);

      await service.searchFlights(dtoWithMaxPrice);

      expect(amadeusService.makeRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          maxPrice: 200,
        }),
      );
    });

    it('should include nonStop in params when provided', async () => {
      const dtoWithNonStop: SearchFlightsDto = {
        ...mockSearchDto,
        nonStop: true,
      };

      amadeusService.makeRequest.mockResolvedValue(mockAmadeusResponse);
      searchHistoryRepository.create.mockReturnValue({} as any);
      searchHistoryRepository.save.mockResolvedValue({} as any);

      await service.searchFlights(dtoWithNonStop);

      expect(amadeusService.makeRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          nonStop: true,
        }),
      );
    });

    it('should use custom currencyCode when provided', async () => {
      const dtoWithCurrency: SearchFlightsDto = {
        ...mockSearchDto,
        currencyCode: 'USD',
      };

      amadeusService.makeRequest.mockResolvedValue(mockAmadeusResponse);
      searchHistoryRepository.create.mockReturnValue({} as any);
      searchHistoryRepository.save.mockResolvedValue({} as any);

      await service.searchFlights(dtoWithCurrency);

      expect(amadeusService.makeRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          currencyCode: 'USD',
        }),
      );
    });

    it('should default adults to 1 when not provided', async () => {
      const dtoWithoutAdults: SearchFlightsDto = {
        origin: 'MAD',
        destination: 'BCN',
        departureDate: '2025-12-15',
      };

      amadeusService.makeRequest.mockResolvedValue(mockAmadeusResponse);
      searchHistoryRepository.create.mockReturnValue({} as any);
      searchHistoryRepository.save.mockResolvedValue({} as any);

      await service.searchFlights(dtoWithoutAdults);

      expect(amadeusService.makeRequest).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          adults: 1,
        }),
      );
    });

    it('should save search history asynchronously', async () => {
      const mockHistory = {
        origin: 'MAD',
        destination: 'BCN',
        departureDate: '2025-12-15',
        resultsCount: 1,
      };

      amadeusService.makeRequest.mockResolvedValue(mockAmadeusResponse);
      searchHistoryRepository.create.mockReturnValue(mockHistory as any);
      searchHistoryRepository.save.mockResolvedValue(mockHistory as any);

      await service.searchFlights(mockSearchDto);

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(searchHistoryRepository.create).toHaveBeenCalledWith({
        origin: mockSearchDto.origin,
        destination: mockSearchDto.destination,
        departureDate: mockSearchDto.departureDate,
        resultsCount: 1,
      });
      expect(searchHistoryRepository.save).toHaveBeenCalledWith(mockHistory);
    });

    it('should handle search history save errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      amadeusService.makeRequest.mockResolvedValue(mockAmadeusResponse);
      searchHistoryRepository.create.mockReturnValue({} as any);
      searchHistoryRepository.save.mockRejectedValue(
        new Error('Database error'),
      );

      const result = await service.searchFlights(mockSearchDto);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);

      consoleErrorSpy.mockRestore();
    });

    it('should use carrier code when carrier name not in dictionary', async () => {
      const responseWithoutCarrier: AmadeusFlightOffersResponse = {
        ...mockAmadeusResponse,
        dictionaries: {
          carriers: {},
          locations: {},
          aircraft: {},
          currencies: {},
        },
      };

      amadeusService.makeRequest.mockResolvedValue(responseWithoutCarrier);
      searchHistoryRepository.create.mockReturnValue({} as any);
      searchHistoryRepository.save.mockResolvedValue({} as any);

      const result = await service.searchFlights(mockSearchDto);

      expect(result.data[0].airline).toBe('IB');
    });

    it('should handle multiple segments in itinerary', async () => {
      const multiSegmentResponse: AmadeusFlightOffersResponse = {
        data: [
          {
            id: '1',
            type: 'flight-offer',
            source: 'GDS',
            instantTicketingRequired: false,
            nonHomogeneous: false,
            oneWay: false,
            lastTicketingDate: '2025-12-14',
            numberOfBookableSeats: 3,
            itineraries: [
              {
                duration: 'PT5H30M',
                segments: [
                  {
                    departure: {
                      iataCode: 'MAD',
                      at: '2025-12-15T10:00:00',
                    },
                    arrival: {
                      iataCode: 'CDG',
                      at: '2025-12-15T12:00:00',
                    },
                    carrierCode: 'AF',
                    number: '1234',
                    aircraft: {
                      code: '320',
                    },
                    duration: 'PT2H00M',
                    id: '1',
                    numberOfStops: 0,
                    blacklistedInEU: false,
                  },
                  {
                    departure: {
                      iataCode: 'CDG',
                      at: '2025-12-15T14:00:00',
                    },
                    arrival: {
                      iataCode: 'BCN',
                      at: '2025-12-15T15:30:00',
                    },
                    carrierCode: 'AF',
                    number: '5678',
                    aircraft: {
                      code: '321',
                    },
                    duration: 'PT1H30M',
                    id: '2',
                    numberOfStops: 0,
                    blacklistedInEU: false,
                  },
                ],
              },
            ],
            price: {
              total: '250.00',
              currency: 'EUR',
              base: '200.00',
              fees: [],
              grandTotal: '250.00',
            },
            pricingOptions: {
              fareType: ['PUBLISHED'],
              includedCheckedBagsOnly: true,
            },
            validatingAirlineCodes: ['AF'],
            travelerPricings: [],
          },
        ],
        dictionaries: {
          carriers: {
            AF: 'Air France',
          },
          locations: {},
          aircraft: {},
          currencies: {},
        },
        meta: {
          count: 1,
          links: {
            self: 'https://test.api.amadeus.com/v2/shopping/flight-offers',
          },
        },
      };

      amadeusService.makeRequest.mockResolvedValue(multiSegmentResponse);
      searchHistoryRepository.create.mockReturnValue({} as any);
      searchHistoryRepository.save.mockResolvedValue({} as any);

      const result = await service.searchFlights(mockSearchDto);

      expect(result.data[0].origin).toBe('MAD');
      expect(result.data[0].destination).toBe('BCN');
      expect(result.data[0].departureDate).toBe('2025-12-15T10:00:00');
      expect(result.data[0].arrivalDate).toBe('2025-12-15T15:30:00');
    });

    it('should use data length as count when meta.count is missing', async () => {
      const responseWithoutMeta: Partial<AmadeusFlightOffersResponse> & { data: AmadeusFlightOffer[], dictionaries: any } = {
        ...mockAmadeusResponse,
        meta: undefined,
      };

      amadeusService.makeRequest.mockResolvedValue(responseWithoutMeta);
      searchHistoryRepository.create.mockReturnValue({} as any);
      searchHistoryRepository.save.mockResolvedValue({} as any);

      const result = await service.searchFlights(mockSearchDto);

      expect(result.meta.count).toBe(1);
    });
  });

  describe('searchLocations', () => {
    const mockLocationDto: SearchLocationDto = {
      keyword: 'Madrid',
    };

    const mockAmadeusLocationsResponse: AmadeusLocationsResponse = {
      data: [
        {
          type: 'location',
          subType: 'AIRPORT',
          name: 'ADOLFO SUAREZ BARAJAS',
          detailedName: 'Madrid/ES:Adolfo Suarez Barajas',
          id: 'AMAD',
          self: {
            href: 'https://test.api.amadeus.com/v1/reference-data/locations/AMAD',
            methods: ['GET'],
          },
          timeZoneOffset: '+01:00',
          iataCode: 'MAD',
          geoCode: {
            latitude: 40.4983,
            longitude: -3.5676,
          },
          address: {
            cityName: 'Madrid',
            cityCode: 'MAD',
            countryName: 'Spain',
            countryCode: 'ES',
            regionCode: 'EUROP',
          },
        },
        {
          type: 'location',
          subType: 'CITY',
          name: 'Madrid',
          detailedName: 'Madrid, Spain',
          id: 'CMAD',
          self: {
            href: 'https://test.api.amadeus.com/v1/reference-data/locations/CMAD',
            methods: ['GET'],
          },
          timeZoneOffset: '+01:00',
          iataCode: 'MAD',
          geoCode: {
            latitude: 40.4165,
            longitude: -3.7026,
          },
          address: {
            cityName: 'Madrid',
            cityCode: 'MAD',
            countryName: 'Spain',
            countryCode: 'ES',
            regionCode: 'EUROP',
          },
        },
      ],
      meta: {
        count: 2,
        links: {
          self: 'https://test.api.amadeus.com/v1/reference-data/locations',
        },
      },
    };

    it('should search locations and return transformed response', async () => {
      amadeusService.makeRequest.mockResolvedValue(
        mockAmadeusLocationsResponse,
      );

      const result = await service.searchLocations(mockLocationDto);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toMatchObject({
        iataCode: 'MAD',
        name: 'ADOLFO SUAREZ BARAJAS',
        detailedName: 'Madrid/ES:Adolfo Suarez Barajas',
        subType: 'AIRPORT',
        countryName: 'Spain',
      });
    });

    it('should call AmadeusService with correct endpoint and params', async () => {
      amadeusService.makeRequest.mockResolvedValue(
        mockAmadeusLocationsResponse,
      );

      await service.searchLocations(mockLocationDto);

      expect(amadeusService.makeRequest).toHaveBeenCalledWith(
        '/v1/reference-data/locations',
        {
          subType: 'CITY,AIRPORT',
          keyword: 'Madrid',
          'page[limit]': 10,
          view: 'LIGHT',
        },
      );
    });

    it('should handle locations without address', async () => {
      const responseWithoutAddress: AmadeusLocationsResponse = {
        data: [
          {
            type: 'location',
            subType: 'AIRPORT',
            name: 'Unknown Airport',
            detailedName: 'Unknown Location',
            id: 'AXYZ',
            self: {
              href: 'https://test.api.amadeus.com/v1/reference-data/locations/AXYZ',
              methods: ['GET'],
            },
            timeZoneOffset: '+00:00',
            iataCode: 'XYZ',
            geoCode: {
              latitude: 0,
              longitude: 0,
            },
          } as any,
        ],
        meta: {
          count: 1,
          links: {
            self: 'https://test.api.amadeus.com/v1/reference-data/locations',
          },
        },
      };

      amadeusService.makeRequest.mockResolvedValue(responseWithoutAddress);

      const result = await service.searchLocations(mockLocationDto);

      expect(result.data[0].countryName).toBe('');
    });

    it('should handle empty results', async () => {
      const emptyResponse: AmadeusLocationsResponse = {
        data: [],
        meta: {
          count: 0,
          links: {
            self: 'https://test.api.amadeus.com/v1/reference-data/locations',
          },
        },
      };

      amadeusService.makeRequest.mockResolvedValue(emptyResponse);

      const result = await service.searchLocations(mockLocationDto);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(0);
    });
  });

  describe('getSearchHistory', () => {
    it('should return search history ordered by createdAt DESC', async () => {
      const mockHistory: SearchHistory[] = [
        {
          id: '1',
          origin: 'MAD',
          destination: 'BCN',
          departureDate: '2025-12-15',
          returnDate: '2025-12-20',
          resultsCount: 5,
          createdAt: new Date('2025-12-08T10:00:00'),
        },
        {
          id: '2',
          origin: 'BCN',
          destination: 'MAD',
          departureDate: '2025-12-20',
          returnDate: '2025-12-25',
          resultsCount: 3,
          createdAt: new Date('2025-12-07T10:00:00'),
        },
      ];

      searchHistoryRepository.find.mockResolvedValue(mockHistory);

      const result = await service.getSearchHistory();

      expect(result).toBeDefined();
      expect(result).toEqual(mockHistory);
      expect(searchHistoryRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
        take: 50,
      });
    });

    it('should limit results to 50', async () => {
      searchHistoryRepository.find.mockResolvedValue([]);

      await service.getSearchHistory();

      expect(searchHistoryRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 50,
        }),
      );
    });

    it('should handle empty history', async () => {
      searchHistoryRepository.find.mockResolvedValue([]);

      const result = await service.getSearchHistory();

      expect(result).toEqual([]);
    });
  });
});
