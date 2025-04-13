export default function ClientDashboard() {
    return (
        <div className="page client-dashboard-page">
            <div className="client-dashboard-page-banner">
                <div className="client-dashboard-page-banner-inner container">
                    <h1 className="client-dashboard-page-banner-title">Dashboard</h1>
                    <p className="client-dashboard-page-banner-subtitle">Welcome to your dashboard</p>
                </div>
            </div>
            <div className="client-dashboard-page-inner container">
                <div className="client-dashboard-page-inner-block">
                    <h3 className="client-dashboard-page-inner-block-title">Overview</h3>
                    <p className="client-dashboard-page-inner-block-subtitle">View your invoices, payments and more</p>
                </div>
            </div>
        </div>
    );
}