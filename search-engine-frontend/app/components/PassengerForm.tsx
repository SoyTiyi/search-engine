'use client';

import { useState } from 'react';

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

interface PassengerFormProps {
  onSubmit: (data: PassengerData) => void;
  disabled: boolean;
  price: number;
  currency: string;
}

export function PassengerForm({ onSubmit, disabled, price, currency }: PassengerFormProps) {
  const [formData, setFormData] = useState<PassengerData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'MALE',
    email: '',
    phone: '',
    passportNumber: '',
    passportExpiry: '',
    passportCountry: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Passenger Details</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
                disabled={disabled}
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
                disabled={disabled}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
                disabled={disabled}
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
                disabled={disabled}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h4>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
                disabled={disabled}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+52 55 1234 5678"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
                disabled={disabled}
              />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Passport Information</h4>

          <div className="space-y-4">
            <div>
              <label htmlFor="passportNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Passport Number *
              </label>
              <input
                type="text"
                id="passportNumber"
                name="passportNumber"
                value={formData.passportNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
                disabled={disabled}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="passportExpiry" className="block text-sm font-medium text-gray-700 mb-2">
                  Expiration Date *
                </label>
                <input
                  type="date"
                  id="passportExpiry"
                  name="passportExpiry"
                  value={formData.passportExpiry}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                  disabled={disabled}
                />
              </div>

              <div>
                <label htmlFor="passportCountry" className="block text-sm font-medium text-gray-700 mb-2">
                  Issuing Country *
                </label>
                <select
                  id="passportCountry"
                  name="passportCountry"
                  value={formData.passportCountry}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                  disabled={disabled}
                >
                  <option value="">Select country</option>
                  <option value="MX">Mexico</option>
                  <option value="US">United States</option>
                  <option value="ES">Spain</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="FR">France</option>
                  <option value="DE">Germany</option>
                  <option value="IT">Italy</option>
                  <option value="BR">Brazil</option>
                  <option value="AR">Argentina</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-brand-primary text-white py-4 rounded-lg text-lg font-bold hover:bg-brand-blue transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          disabled={disabled}
        >
          {disabled ? 'Loading...' : `Confirm Booking - ${new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
          }).format(price)}`}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          * By confirming, you accept our terms and conditions
        </p>
      </form>
    </div>
  );
}
