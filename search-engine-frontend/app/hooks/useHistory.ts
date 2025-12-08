import { useState, useEffect } from 'react';
import { SearchHistory } from '../lib/type';

export function useHistory() {
    const [history, setHistory] = useState<SearchHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/flights/history');

            if (!response.ok) {
                throw new Error('Failed to fetch history');
            }

            const data = await response.json();
            setHistory(data);
        } catch (err) {
            setError('An error occurred while fetching search history.');
            console.error('Error fetching history:', err);
        } finally {
            setLoading(false);
        }
    };

    return {
        history,
        loading,
        error,
        refetch: fetchHistory
    };
}
