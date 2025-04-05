"use client";

import { SessionProviderWrapper } from "@/wrappers/SessionProviderWrapper";
import { Providers } from "@/app/providers";
import React from "react";

import ClientAuthWrapper from "@/wrappers/ClientAuthWrapper";

// Import styles
import "@/styles/styles.scss";

// Import templates
import Header from "@/templates/authenticated/header";
import Footer from "@/templates/authenticated/footer";
import Sidebar from "@/templates/authenticated/sidebar";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html>
            <body>
                <SessionProviderWrapper>
                    <ClientAuthWrapper>
                        {/* This is the sidebar component */}
                        <div className="sidebar-holder">
                            <Sidebar />
                        </div>

                        {/* This is the main content area */}
                        <div className="website">

                            <div className="header-holder">
                            {/* This is the header component */}
                            <Header />
                            </div>
                            <div className="website-content container-fluid">
                            <Providers>{children}</Providers>
                            </div>

                            <div className="footer-holder">
                            {/* This is the footer component */}
                            <Footer />
                            </div>
                        </div>
                    </ClientAuthWrapper>
                </SessionProviderWrapper>
            </body>
        </html>
    );
}