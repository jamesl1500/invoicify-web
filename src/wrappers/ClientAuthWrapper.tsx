import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Loading from '@/components/screens/Loading';

interface ClientAuthWrapperProps {
    children: ReactNode;
}

const ClientAuthWrapper: React.FC<ClientAuthWrapperProps> = ({ children }) => {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session || !session.accessToken) {
            router.push('/'); // Redirect to the home page if not authenticated
        }
    }, [session, router]);

    console.log(session);

    if (!session || !session.accessToken) {
        return <Loading text="Loading your client portal..." />;
    }

    return <>{children}</>;
};

export default ClientAuthWrapper;