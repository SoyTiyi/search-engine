'use client';

import { useState } from 'react';
import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { FlightCard, FlightOffer } from './components/FlightCard';

export default function Home() {
  const [offers, setOffers] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (origin: string, destination: string, date: string) => {
    setLoading(true);
    setError('');
    setSearched(true);
    setOffers([]);

    try {
      const url = new URL('http://localhost:3000/flights/search');
      url.searchParams.append('origin', origin);
      url.searchParams.append('destination', destination);
      url.searchParams.append('departureDate', date);

      const response = await fetch(url.toString());
      const data = await response.json();

      if (data.success) {
        setOffers(data.data);
      } else {
        setError('Failed to fetch flights. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while searching for flights.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-gradient-to-br from-brand-primary to-brand-blue pb-32 pt-20 px-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-teal opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-brand-teal opacity-10 rounded-full blur-3xl"></div>
          
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
              Find your next <span className="text-brand-teal">adventure</span>
            </h1>
            <p className="text-blue-50 text-xl max-w-2xl mx-auto font-medium">
              Search deals on flights, hotels, and much more.
            </p>
          </div>
        </div>

        <div className="px-4 mb-12">
          <SearchForm onSearch={handleSearch} isLoading={loading} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 text-center">
              {error}
            </div>
          )}

          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 h-48 animate-pulse border border-gray-200">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          )}

          {!loading && searched && offers.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="bg-white rounded-full p-4 inline-block mb-4 shadow-sm">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No flights found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your search dates or locations.</p>
            </div>
          )}

          <div className="space-y-4">
            {offers.map((offer) => (
              <FlightCard key={offer.id} offer={offer} />
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Deal Engine</h4>
              <p className="text-gray-500 text-sm">
                Digital transformation for the travel industry.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-brand-teal">About Us</a></li>
                <li><a href="#" className="hover:text-brand-teal">Careers</a></li>
                <li><a href="#" className="hover:text-brand-teal">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-brand-teal">Help Center</a></li>
                <li><a href="#" className="hover:text-brand-teal">Terms of Service</a></li>
                <li><a href="#" className="hover:text-brand-teal">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>info@deal-engine.com</li>
                <li>Miami, FL</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Deal Engine. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
