"use client";

import React from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faHome, faFileInvoice, faUser, faCog, faXmark, faMoneyBill } from '@fortawesome/free-solid-svg-icons';

import Link from 'next/link';
import Image from 'next/image';

import { usePathname } from 'next/navigation';

// Import images 
const logo = "/static/images/invoicify-logo.png";

// Logout


export default function Sidebar() {

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
                    <Link href="/invoices/create" className="btn btn-primary btn-fullwidth">
                        <FontAwesomeIcon icon={faFileInvoice} />
                        Create Invoice
                    </Link>
                </div>
                <div className="sidebar-content">
                    <h3>Menu</h3>
                    <ul>
                        <li>
                            <Link href="/">
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
                                Payment
                            </Link>
                        </li>
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
                            <Link href="/logout">
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