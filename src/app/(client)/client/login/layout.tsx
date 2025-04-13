import React from 'react';
import Link from "next/link";
import Image from "next/image";
import "@/styles/styles.scss";

// Import images 
const logo = "/static/images/invoicify-logo.png";

export default function ClientLoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html>
            <body>
                <div className="client-auth-layout">
                    <div className="client-auth-layout-header">
                        <div className="client-auth-layout-header-inner container">
                            <div className="client-auth-layout-header-branding">
                                <Link href="/" className="client-auth-layout-header-branding-link">
                                    <Image src={logo} alt="Invoicify Logo" width={50} height={50} className="client-auth-layout-header-branding-logo" />
                                    <span className="client-auth-layout-header-branding-text">Invoicify</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="client-auth-layout-inner">
                        <div className="client-auth-layout-inner-banner">
                            <div className="client-auth-layout-inner-banner-inner container">
                                <h1 className="client-auth-layout-inner-banner-title">Client Portal</h1>
                                <p className="client-auth-layout-inner-banner-subtitle">Manage your invoices and payments</p>
                            </div>
                        </div>
                        <div className="client-auth-layout-inner-content">
                            {children}
                        </div>
                    </div>
                    <div className="client-auth-layout-footer">
                        
                    </div>
                </div>
            </body>
        </html>
    );
}