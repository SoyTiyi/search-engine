import { Calendar, Search, ArrowRightLeft } from 'lucide-react';
import { SearchFormProps } from '../lib/type';
import { LocationInput } from './LocationInput';
import { useSearchForm } from '../hooks/useSearchForm';

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const {
    origin,
    setOrigin,
    destination,
    setDestination,
    date,
    setDate,
    handleSearch,
    handleSwap
  } = useSearchForm(onSearch);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-5xl mx-auto -mt-24 relative z-10">
      <div className="flex flex-col lg:flex-row gap-4 items-end">
        
        <div className="flex-1 flex flex-col md:flex-row gap-2 w-full relative">
          <LocationInput
            label="From"
            placeholder="Origin"
            value={origin}
            onChange={setOrigin}
          />
          
          <button 
            onClick={handleSwap}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 p-2 rounded-full hover:bg-gray-50 hover:rotate-180 transition-all duration-300 hidden md:block shadow-sm"
            aria-label="Swap locations"
          >
            <ArrowRightLeft className="h-4 w-4 text-brand-teal" />
          </button>

          <LocationInput
            label="To"
            placeholder="Destination"
            value={destination}
            onChange={setDestination}
            icon={<MapPinIcon className="h-5 w-5" />}
          />
        </div>

        <div className="w-full lg:w-48">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">
            Departure
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Calendar className="h-5 w-5" />
            </div>
            <input
              type="date"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-lg font-semibold rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition-all"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={!origin || !destination || !date || isLoading}
          className="w-full lg:w-auto bg-brand-teal hover:bg-[#3bcbc1] text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Search className="h-5 w-5" />
              <span>Search</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M20 10c0 6-9 13-9 13s-9-7-9-13a9 9 0 0 1 18 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
