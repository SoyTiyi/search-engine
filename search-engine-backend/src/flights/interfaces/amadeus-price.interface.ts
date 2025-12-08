import { AmadeusFlightOffer } from './amadeus-flight.interface';

export interface AmadeusPriceResponse {
  data: {
    type: string;
    flightOffers: AmadeusFlightOffer[];
  };
  dictionaries?: {
    locations?: Record<string, any>;
    aircraft?: Record<string, string>;
    currencies?: Record<string, string>;
    carriers?: Record<string, string>;
  };
}
