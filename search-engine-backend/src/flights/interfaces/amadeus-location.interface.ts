export interface AmadeusLocation {
  type: string;
  subType: string;
  name: string;
  detailedName: string;
  id: string;
  self: {
    href: string;
    methods: string[];
  };
  timeZoneOffset: string;
  iataCode: string;
  geoCode: {
    latitude: number;
    longitude: number;
  };
  address: {
    cityName: string;
    cityCode: string;
    countryName: string;
    countryCode: string;
    regionCode: string;
  };
}

export interface AmadeusLocationsResponse {
  meta: {
    count: number;
    links: {
      self: string;
      next?: string;
      last?: string;
    };
  };
  data: AmadeusLocation[];
}
