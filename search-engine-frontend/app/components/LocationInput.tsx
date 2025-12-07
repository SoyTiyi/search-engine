import { useState, useEffect, useRef } from 'react';
import { MapPin, Plane } from 'lucide-react';
import { debounce } from '../lib/utils';

export interface Location {
  iataCode: string;
  name: string;
  detailedName: string;
  subType: string;
  countryName: string;
}

interface LocationInputProps {
  label: string;
  placeholder: string;
  value: Location | null;
  onChange: (location: Location) => void;
  icon?: React.ReactNode;
}

export function LocationInput({ label, placeholder, value, onChange, icon }: LocationInputProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setQuery(`${value.name} (${value.iataCode})`);
    }
  }, [value]);

  const fetchLocations = async (keyword: string) => {
    if (!keyword || keyword.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/flights/locations?keyword=${encodeURIComponent(keyword)}`);
      const data = await response.json();
      if (data.success) {
        setSuggestions(data.data);
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetch = debounce(fetchLocations, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    debouncedFetch(newValue);
  };

  const handleSelect = (location: Location) => {
    onChange(location);
    setQuery(`${location.name} (${location.iataCode})`);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  return (
    <div className="relative flex-1" ref={wrapperRef}>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-brand-teal transition-colors">
          {icon || <MapPin className="h-5 w-5" />}
        </div>
        <input
          type="text"
          className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-lg font-semibold rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-brand-teal focus:border-transparent outline-none transition-all"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
        />
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-80 overflow-y-auto">
          {suggestions.map((location) => (
            <button
              key={location.iataCode}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-0"
              onClick={() => handleSelect(location)}
            >
              <div className="bg-gray-100 p-2 rounded-lg">
                {location.subType === 'AIRPORT' ? (
                  <Plane className="h-4 w-4 text-gray-600" />
                ) : (
                  <MapPin className="h-4 w-4 text-gray-600" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{location.name}</span>
                  <span className="text-xs font-bold bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                    {location.iataCode}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">{location.detailedName}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
