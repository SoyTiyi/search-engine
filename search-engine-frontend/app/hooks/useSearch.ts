import { useState } from 'react';
import { FlightOffer, FlightSearchRequest } from '../lib/type';

export function useSearch() {

    const [offers, setOffers] = useState<FlightOffer[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState('');


    const handleSearch = async (flightSearchRequest: FlightSearchRequest) => {
        setLoading(true);
        setError('');
        setSearched(true);
        setOffers([]);

        try {
            const response = await fetch(`/api/flights/search`, {
                body: JSON.stringify(flightSearchRequest),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setOffers(data.data);
            } else {
                setError('Failed to fetch flights. Please try again.');
            }
        } catch (error) {
            setError('An error occurred while searching for flights.');
        } finally {
            setLoading(false);
        }
    }

    return {
        offers,
        loading,
        searched,
        error,
        handleSearch
    };
}