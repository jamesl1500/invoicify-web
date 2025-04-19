import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Loading from '@/components/screens/Loading';

import { setApiToken } from '@/libs/api';

interface UserAuthWrapperProps {
    children: ReactNode;
}

const UserAuthWrapper: React.FC<UserAuthWrapperProps> = ({ children }) => {
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
            // Set the API token for authenticated requests
            setApiToken(session.accessToken);
            return;
        }
    }, [session, status, router]);

    if (!session || !session.accessToken) {
        return <Loading text="Loading your user portal..." />;
    }

    return <>{children}</>;
};

export default UserAuthWrapper;