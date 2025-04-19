import React from 'react';
import { Metadata } from 'next';

import DashboardPage from './components/DashboardPage';

export const metadata: Metadata = {
    title: "Dashboard | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "View your dashboard",
};

const ClientDashboard = () => {

    return <DashboardPage />;
};

export default ClientDashboard;