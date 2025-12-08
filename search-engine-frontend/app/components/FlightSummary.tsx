'use client';

import { FlightOffer, ConfirmedPrice } from '../lib/type';
import { formatDuration, formatCurrency } from '../lib/utils';
import { Plane, Loader2 } from 'lucide-react';

interface FlightSummaryProps {
  flight: FlightOffer;
  confirmedPrice: ConfirmedPrice | null;
  loading: boolean;
}

export function FlightSummary({ flight, confirmedPrice, loading }: FlightSummaryProps) {
  const originalPrice = flight.price;
  const currentPriceStr = confirmedPrice?.flightOffers?.[0]?.price?.total;
  const currentPrice = currentPriceStr ? parseFloat(currentPriceStr) : originalPrice;
  const priceChanged = currentPriceStr && currentPrice !== originalPrice;
  const priceDiff = currentPriceStr ? currentPrice - originalPrice : 0;

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Flight Summary</h3>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Airline</span>
          <span className="font-semibold text-gray-900">{flight.airline}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Flight Number</span>
          <span className="font-semibold text-gray-900">{flight.flight_number}</span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 mb-6">
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{flight.origin}</div>
            <div className="text-sm text-gray-600 mt-1">{formatDateTime(flight.departureDate)}</div>
          </div>

          <div className="flex flex-col items-center">
            <Plane className="h-6 w-6 text-gray-400 rotate-90 mb-2" />
            <div className="text-sm text-gray-600">{formatDuration(flight.duration)}</div>
            <div className="w-full h-0.5 bg-gray-200 my-2"></div>
            <div className="text-xs text-green-600 font-medium">Direct Flight</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{flight.destination}</div>
            <div className="text-sm text-gray-600 mt-1">{formatDateTime(flight.arrivalDate)}</div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Price</h4>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Initial price</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(originalPrice, flight.currency)}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 p-4 bg-gray-100 rounded-lg">
              <Loader2 className="h-5 w-5 text-brand-primary animate-spin" />
              <span className="text-gray-600">Confirming current price...</span>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Current price</span>
              <div className="flex items-center gap-2">
                <span className={`font-bold text-lg ${priceChanged ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(currentPrice, flight.currency)}
                </span>
                {priceChanged && (
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    priceDiff > 0
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {priceDiff > 0 ? '+' : ''}{formatCurrency(Math.abs(priceDiff), flight.currency)}
                  </span>
                )}
              </div>
            </div>
          )}

          {priceChanged && !loading && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
              <p className="text-sm text-yellow-800">
                The price has changed since your initial search
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mt-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
            {flight.numberOfBookableSeats} seats available
          </span>
        </div>
      </div>
    </div>
  );
}
