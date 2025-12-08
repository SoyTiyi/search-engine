'use client';

import { Header } from '../components/Header';
import { useHistory } from '../hooks/useHistory';
import { Clock, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

export default function HistoryPage() {
  const { history, loading, error } = useHistory();

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  };

  const formatDateTime = (dateString: string) => {
    return format(parseISO(dateString), 'MMM dd, yyyy - HH:mm');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="bg-gradient-to-br from-brand-primary to-brand-blue pb-20 pt-20 px-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-teal opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-brand-teal opacity-10 rounded-full blur-3xl"></div>

          <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
                <Clock className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Search History
            </h1>
            <p className="text-blue-50 text-lg max-w-2xl mx-auto font-medium">
              View your previous flight searches and find deals you've explored
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-8 px-4 sm:px-6 lg:px-8 -mt-8 pb-20">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 text-center">
              {error}
            </div>
          )}

          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 h-32 animate-pulse border border-gray-200 shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          )}

          {!loading && history.length === 0 && !error && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="bg-gray-50 rounded-full p-6 inline-block mb-4">
                <Clock className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No search history yet</h3>
              <p className="text-gray-500 mb-6">
                Start searching for flights to see your history here
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-blue text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Search Flights
              </Link>
            </div>
          )}

          <div className="space-y-4">
            {history.map((search) => (
              <div
                key={search.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="bg-brand-primary/10 p-2 rounded-lg">
                          <MapPin className="h-5 w-5 text-brand-primary" />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xl font-bold text-gray-900">
                            {search.origin}
                          </span>
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                          <span className="text-xl font-bold text-gray-900">
                            {search.destination}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">
                          {formatDate(search.departureDate)}
                          {search.returnDate && ` - ${formatDate(search.returnDate)}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-brand-teal" />
                        <span className="font-semibold text-brand-teal">
                          {search.resultsCount} {search.resultsCount === 1 ? 'result' : 'results'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>Searched on {formatDateTime(search.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/?origin=${search.origin}&destination=${search.destination}&date=${search.departureDate}`}
                      className="bg-brand-primary hover:bg-brand-blue text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md group-hover:scale-105"
                    >
                      <span>Search Again</span>
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
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
            &copy; {new Date().getFullYear()} Deal Engine. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
