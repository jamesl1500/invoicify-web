"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { faHome, faFileInvoice, faCog, faMoneyBill, faUser, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import React from "react";

export default function Header() {
    // This is the header component
    const pathname = usePathname() as keyof typeof pageName;

    const pageName: Record<string, string | { title: string; subtitle: string }> = {
        "/dashboard": "Dashboard",
        "/invoices": "Invoices",
        "/invoices/create": { title: "Invoices", subtitle: "New invoice" },
        "/clients": "Clients",
        "/clients/create": { title: "Clients", subtitle: "New client" },
        "/settings": "Settings",
        "/billing": "Billing",
        "/create-invoice": "Create Invoice",
        "/profile": "Profile",
        "/invoice/[id]": { title: "Invoice", subtitle: "View Invoice" },
        "/client/[id]": { title: "Client", subtitle: "View Client" },
    };
    const pageIcon: Record<string, IconDefinition> = {
        "/dashboard": faHome,
        "/invoices": faFileInvoice,
        "/clients": faUser,
        "/clients/create": faUser,
        "/settings": faCog,
        "/billing": faMoneyBill,
        "/invoices/create": faFileInvoice,
        "/profile": faUser,
    };

    const pageTitle = () => {
        if (pageName[pathname]) {
            if (typeof pageName[pathname] === "string") {
                return pageName[pathname];
            }
            if (typeof pageName[pathname] === "object") {
                return pageName[pathname].title;
            }
        }
    }

    const pageSubtitle = () => {
        if (pageName[pathname]) {
            if (typeof pageName[pathname] === "object") {
                return pageName[pathname].subtitle;
            }
        }
    }

    // Removed unused pageSubtitle function
    const pageIconComponent = pageIcon[pathname] || faHome;

    return (
        <header className="header">
            <div className="header-inner container-fluid">
                <div className="header-page-location">
                    <div className="header-page-icon">
                        <FontAwesomeIcon icon={pageIconComponent} />
                    </div>
                    <div className="header-page-name">
                        {pageTitle()} 
                        {pageSubtitle() && <span className="header-page-subtitle"> <span className="header-page-subtitle-arrow">|</span> {pageSubtitle()}</span>}
                    </div>
                </div>
                <div className="header-right">
                    <div className="header-search">
                        <input type="text" placeholder="Search..." />
                    </div>
                    <div className="header-user">
                        <Link href="/profile">
                            <FontAwesomeIcon icon={faUser} />
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
