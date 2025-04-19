import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import API from '@/libs/api';

interface User {
    id: string;
    name: string;
    email: string;
}

const useUser = (token: string) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            console.log('Fetching user data...');
            try {
                setLoading(true);
                const response = await API.get('/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }); // Replace with your API endpoint

                const data: User = response.data;
                console.log('User data fetched:', data);
                setUser(data);
            } catch (err: any) {
                console.error('Error fetching user data:', err);
                setError(err.message || 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, loading, error };
};

export default useUser;