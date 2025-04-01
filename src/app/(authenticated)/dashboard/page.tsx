import React from 'react';
import axios from 'axios';

import { useSession, signOut } from 'next-auth/react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

export const metadata = {
    title: "Dashboard | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "Dashboard page",
};

const DashboardPage = () => {

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to your dashboard!</p>
            <p>
                <FontAwesomeIcon icon={faCheck} /> Your session is active.
            </p>
        </div>
    );
};

export default DashboardPage;