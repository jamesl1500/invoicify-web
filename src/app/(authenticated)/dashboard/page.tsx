import DashboardPageClient from './components/Dashboard';

export const metadata = {
    title: "Dashboard | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: 'View your invoices, payments and stats',

}

function DashboardPage() {

    return <DashboardPageClient />;
};

export default DashboardPage;