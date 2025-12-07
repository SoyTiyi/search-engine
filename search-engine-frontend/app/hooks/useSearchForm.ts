import { useState } from "react";
import { Location } from "../lib/type";

export function useSearchForm(onSearch: (origin: string, destination: string, date: string) => void) {
  const [origin, setOrigin] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [date, setDate] = useState('');

  const handleSearch = () => {
    if (origin && destination && date) {
      onSearch(origin.iataCode, destination.iataCode, date);
    }
  };

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  return {
    origin,
    setOrigin,
    destination,
    setDestination,
    date,
    setDate,
    handleSearch,
    handleSwap
  };
}   