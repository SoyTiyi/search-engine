import { LocationInputProps } from '../lib/type';
import { MapPin, Plane } from 'lucide-react';
import useLocations from '../hooks/useLocations';

export function LocationInput({ label, placeholder, value, onChange, icon }: LocationInputProps) {
  const {
    query,
    suggestions,
    isOpen,
    wrapperRef,
    setIsOpen,
    handleInputChange,
    handleSelect: handleSelectLocation
  } = useLocations(value);

  const handleSelect = (location: typeof suggestions[0]) => {
    onChange(location);
    handleSelectLocation(location);
  };

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
          {suggestions.map((location, index) => (
            <button
              key={`${location.iataCode}-${index}`}
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
