import { Plane, Clock, Luggage } from 'lucide-react';
import { formatDuration, formatTime, formatCurrency } from '../lib/utils';

export interface FlightOffer {
  type: string;
  id: string;
  origin: string;
  destination: string;
  airline: string;
  flight_number: string;
  departureDate: string;
  arrivalDate: string;
  duration: string;
  price: number;
  currency: string;
  numberOfBookableSeats: number;
}

interface FlightCardProps {
  offer: FlightOffer;
}

export function FlightCard({ offer }: FlightCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 mb-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Plane className="h-5 w-5 text-brand-navy" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{offer.airline}</h3>
              <p className="text-sm text-gray-500">Flight {offer.flight_number}</p>
            </div>
          </div>

          <div className="flex items-center justify-between w-full">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{formatTime(offer.departureDate)}</p>
              <p className="text-lg font-medium text-gray-600">{offer.origin}</p>
            </div>

            <div className="flex-1 px-4 flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-1">{formatDuration(offer.duration)}</p>
              <div className="w-full h-[2px] bg-gray-200 relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                  <Plane className="h-4 w-4 text-gray-400 rotate-90" />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-1 font-medium">Direct</p>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{formatTime(offer.arrivalDate)}</p>
              <p className="text-lg font-medium text-gray-600">{offer.destination}</p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 flex flex-row md:flex-col justify-between items-center gap-4">
          <div className="text-right">
            <p className="text-3xl font-bold text-brand-primary">
              {formatCurrency(offer.price, offer.currency)}
            </p>
            <p className="text-sm text-gray-500">per passenger</p>
          </div>
          
          <button className="w-full md:w-auto bg-brand-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-blue transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2">
            Select
          </button>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Luggage className="h-4 w-4" />
          <span>Included: 1 Carry-on bag</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
            {offer.numberOfBookableSeats} seats left
          </span>
        </div>
      </div>
    </div>
  );
}
