'use client';

import { useState, useEffect, useCallback } from 'react';
import { FlightOffer, ConfirmedPrice } from '../lib/type';
import { FlightSummary } from './FlightSummary';
import { PassengerForm } from './PassengerForm';
import { X, AlertCircle } from 'lucide-react';

interface BookingModalProps {
  flight: FlightOffer;
  isOpen: boolean;
  onClose: () => void;
}

interface PassengerData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE';
  email: string;
  phone: string;
  passportNumber: string;
  passportExpiry: string;
  passportCountry: string;
}

export function BookingModal({ flight, isOpen, onClose }: BookingModalProps) {
  const [confirmedPrice, setConfirmedPrice] = useState<ConfirmedPrice | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [priceError, setError] = useState<string | null>(null);

  const confirmFlightPrice = useCallback(async () => {
    setLoadingPrice(true);
    setError(null);

    try {
      const response = await fetch('/api/flights/price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flightOffer: flight.originalOffer
        }),
      });

      const data = await response.json();

      if (data.success) {
        setConfirmedPrice(data.data);
      } else {
        throw new Error(data.message || 'Error confirming price');
      }
    } catch (error) {
      console.error('Error confirming price:', error);
      setError('This Order Already Expired. Please search for flights again to get the latest prices.');
    } finally {
      setLoadingPrice(false);
    }
  }, [flight.originalOffer]);

  useEffect(() => {
    if (isOpen) {
      confirmFlightPrice();
    }
  }, [isOpen, confirmFlightPrice]);

  const handleBooking = async (passengerData: PassengerData) => {
    console.log('Booking flight with data:', {
      flight: confirmedPrice,
      passenger: passengerData
    });
    // TODO: Implement call to /flights/book endpoint
    alert('Booking functionality will be implemented in the next step!');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Confirm Your Booking</h2>

          {priceError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800">{priceError}</p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="mt-2 text-sm font-semibold text-red-600 hover:text-red-800"
                >
                  Search Again
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FlightSummary
              flight={flight}
              confirmedPrice={confirmedPrice}
              loading={loadingPrice}
            />

            <PassengerForm
              onSubmit={handleBooking}
              disabled={loadingPrice || !!priceError}
              price={confirmedPrice?.flightOffers?.[0]?.price?.total ? parseFloat(confirmedPrice.flightOffers[0].price.total) : flight.price}
              currency={flight.currency}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
