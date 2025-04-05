import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Loading from '@/components/screens/Loading';

interface ClientAuthWrapperProps {
    children: ReactNode;
}

const ClientAuthWrapper: React.FC<ClientAuthWrapperProps> = ({ children }) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") {
            // Still loading session, do nothing
            console.log("Session is loading...");
            return;
        }else if (status === "unauthenticated" || !session || !session.accessToken) {
            console.log("Session is unauthenticated or access token is missing. Redirecting to login...");
            router.push("/login");
            return;
        } else if (status === "authenticated" && session.accessToken) {
            // User is authenticated and has an access token, do nothing
            console.log("User is authenticated. Access token found. Do nothing");
            return;
        }
    }, [session, status, router]);

    if (!session || !session.accessToken) {
        return <Loading text="Loading your client portal..." />;
    }

    return <>{children}</>;
};

export default ClientAuthWrapper;