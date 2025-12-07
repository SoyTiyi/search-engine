import { useState, useEffect, useCallback, useRef } from 'react';
import { Location } from '../lib/type';
import { debounce } from '../lib/utils';

export default function useLocations(initialValue?: Location | null) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Location[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (initialValue) {
            setQuery(`${initialValue.name} (${initialValue.iataCode})`);
        }
    }, [initialValue]);

    const fetchLocations = async (keyword: string) => {
        if (!keyword || keyword.length < 4) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/flights/locations`, {
                body: JSON.stringify({ keyword }),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                setSuggestions(data.data);
                setIsOpen(true);
            }
        } catch (error) {
            console.error('Error fetching locations:', error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const debouncedFetch = useCallback(debounce(fetchLocations, 600), []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setQuery(newValue);
        debouncedFetch(newValue);
    };

    const handleSelect = (location: Location) => {
        setQuery(`${location.name} (${location.iataCode})`);
        setIsOpen(false);
        return location;
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return {
        query,
        suggestions,
        isOpen,
        isLoading,
        wrapperRef,
        setIsOpen,
        handleInputChange,
        handleSelect
    };
}