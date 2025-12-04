export interface AmadeusFlightDestinationsResponse {
  data: AmadeusFlightDestination[];
  meta: {
    currency: string;
    links: {
      self: string;
    };
    defaults: {
      departureDate: string;
      oneWay: boolean;
      duration: string;
      nonStop: boolean;
      viewBy: string;
    };
  };
  dictionaries: {
    currencies: Record<string, string>;
    locations: Record<string, AmadeusLocation>;
  };
  warnings?: any[];
}

export interface AmadeusFlightDestination {
  type: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  price: {
    total: string;
  };
  links: {
    flightDates?: string;
    flightOffers?: string;
  };
}

export interface AmadeusLocation {
  subType: string;
  detailedName: string;
}