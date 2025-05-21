export default function PublicHeader(){

    return (
        <header className="public-header">
            <div className="public-header-inner">
                <div className="public-header-logo">
                    <img src="/logo.png" alt="Invoicify Logo" />
                </div>
                <div className="public-header-nav">
                    
                </div>
                <div className="public-header-buttons">
                    <a href="/login" className="btn btn-primary">Login</a>
                    <a href="/signup" className="btn btn-secondary">Sign Up</a>
                </div>
            </div>
        </header>
    );
}