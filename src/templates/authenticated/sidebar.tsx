"use client";

import React from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faHome, faFileInvoice, faUser, faCog, faXmark, faMoneyBill } from '@fortawesome/free-solid-svg-icons';

import Link from 'next/link';
import Image from 'next/image';

import { usePathname } from 'next/navigation';

import { useSession } from 'next-auth/react';

import { signOut } from 'next-auth/react';

// Import images 
const logo = "/static/images/invoicify-logo.png";

// Logout

export default function Sidebar() {
    // Get session
    const { data: session, status } = useSession();

    // Determine which page is active
    const pathname = usePathname() as keyof typeof pageName;
    const pageName: Record<string, string | { title: string; subtitle: string }> = {
        "/dashboard": "Dashboard",
        "/invoices": "Invoices",
        "/invoices/create": { title: "Invoices", subtitle: "New invoice" },
        "/clients": "Clients",
        "/clients/create": { title: "Clients", subtitle: "New client" },
        "/clients/view/[id]": { title: "Clients", subtitle: "View client" },
        "/clients/edit/[id]": { title: "Clients", subtitle: "Edit client" },
        "/settings": "Settings",
        "/billing": "Billing",
        "/create-invoice": "Create Invoice",
        "/profile": "Profile",
        "/invoice/view": { title: "Invoice", subtitle: "View Invoice" },
    };

    // Logout
    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            });

            // Signout the user
            await signOut({ redirect: false });

            // Redirect to login page or perform any other action after logout
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-inner">
                <div className="sidebar-header">
                    <div className="sidebar-branding">
                        <Link href="/">
                            <Image src={logo} alt="Invoicify Logo" width={40} height={40} />
                            <h1 className="sidebar-title">Invoicify</h1>
                        </Link>
                    </div>
                    <div className="sidebar-user">
                        <Link href="/profile">
                            <FontAwesomeIcon icon={faXmark} />
                        </Link>
                    </div>
                </div>
                <div className="sidebar-action">
                    {session?.user.role === "user" && (
                        <Link href="/invoices/create" className="btn btn-primary btn-fullwidth">
                            <FontAwesomeIcon icon={faFileInvoice} />
                            Create Invoice
                        </Link>
                    )}
                </div>
                <div className="sidebar-content">
                    <h3>Menu</h3>
                    <ul>
                        {session?.user && (
                            <ul>
                                {session.user.role === "user" ? (
                                    <>
                                        <li className={pathname === "/dashboard" ? "active" : ""}>
                                            <Link href="/dashboard">
                                                <FontAwesomeIcon icon={faHome} />
                                                Dashboard
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/invoices">
                                                <FontAwesomeIcon icon={faFileInvoice} />
                                                Invoices
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/clients">
                                                <FontAwesomeIcon icon={faUser} />
                                                Clients
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/payments">
                                                <FontAwesomeIcon icon={faMoneyBill} />
                                                Payments
                                            </Link>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className={pathname === "/dashboard" ? "active" : ""}>
                                            <Link href="/client/dashboard">
                                                <FontAwesomeIcon icon={faHome} />
                                                Dashboard
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/client/invoices">
                                                <FontAwesomeIcon icon={faFileInvoice} />
                                                My Invoices
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/client/payments">
                                                <FontAwesomeIcon icon={faMoneyBill} />
                                                My Payments
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        )}
                    </ul>
                </div>
                <div className="sidebar-footer">
                    <h3>Account</h3>
                    <ul>
                        <li>
                            <Link href="/profile">
                                <FontAwesomeIcon icon={faUser} />
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link href="/settings">
                                <FontAwesomeIcon icon={faCog} />
                                Settings
                            </Link>
                        </li>
                        <li>
                            <Link href="/logout" onClick={handleLogout}>
                                <FontAwesomeIcon icon={faXmark} />
                                Logout
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </aside>
    );
}