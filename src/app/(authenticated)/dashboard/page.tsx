"use client";

import React from 'react';
import axios from 'axios';

import { useSession, signOut } from 'next-auth/react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faMoneyBill } from "@fortawesome/free-solid-svg-icons";

import Loading from "@/components/screens/Loading";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import Link from "next/link";

// Fetch dashboard data function
const fetchDashboardData = async (token: string) => {
    const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token || ""}`,
            },
        }
    );

    return response.data;
};

const DashboardPage = () => {
    const { data: session, status } = useSession();

    // Use React Query to fetch and manage dashboard data
    const { data, error, isLoading } = useQuery({
        queryKey: ["dashboard"],
        queryFn: () => fetchDashboardData(session?.accessToken || ""),
        enabled: status === "authenticated" && !!session?.accessToken, // Wait for session to load and ensure token is available
    }) as { data: any, error: any, isLoading: boolean };

    if (status === "loading" || !session || isLoading) {
        return <Loading text="Loading your dashboard..." />;
    }

    return (
        <div className="page page-dashboard">
            <div className="page-inner">
                <div className="page-header">
                    <div className="page-header-title">
                        <h1>Dashboard</h1>
                        <p>Welcome back, {session.user.name}</p>
                    </div>
                    <div className="page-header-actions">
                        <button className="btn btn-primary" onClick={() => signOut()}>
                            Sign Out
                        </button>
                    </div>
                </div>
                <div className="page-content no-border">
                    <div className="page-content-kpis">
                        <div className="page-content-kpi primary">
                            <div className="page-content-kpi-icon">
                                <FontAwesomeIcon icon={faMoneyBill} />
                            </div>
                            <div className="page-content-kpi-content">
                                <div className="page-content-kpi-title">
                                    <h1>Total Outstanding</h1>
                                    <p>Total amount due</p>
                                </div>
                                <div className="page-content-kpi-value">
                                    {data?.totalOutstanding ? (
                                        <h1>${data?.totalOutstanding}</h1>
                                    ) : (
                                        <h1>$0.00</h1>
                                    )}
                                </div>  
                            </div>                              
                        </div>

                        <div className="page-content-kpi">
                            <div className="page-content-kpi-icon">
                                <FontAwesomeIcon icon={faCheck} />
                            </div>
                            <div className="page-content-kpi-content">
                                <div className="page-content-kpi-title">
                                    <h1>Income</h1>
                                    <p>Total amount paid by clients</p>
                                </div>
                                <div className="page-content-kpi-value">
                                    {data?.totalPaid ? (
                                        <h1>${data?.totalPaid}</h1>
                                    ) : (
                                        <h1>$0.00</h1>
                                    )}
                                </div>  
                            </div>                              
                        </div>
                    </div>

                    <div className="page-content-recent-invoices">
                        <div className="page-content-recent-invoices-header">
                            <h1>Recent Invoices</h1>
                            <p>View your recent invoices</p>
                        </div>

                        {data?.recentInvoices.length === 0 && (
                            <div className="alert alert-info">
                                No recent invoices found.
                            </div>
                        )}

                        {data?.recentInvoices.length > 0 && (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Invoice Number</th>
                                        <th>Status</th>
                                        <th>Total</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.recentInvoices.map((invoice: any) => (
                                        <tr key={invoice.id}>
                                            <td>{invoice.invoice_number}</td>
                                            <td>{invoice.status}</td>
                                            <td>${invoice.total_amount}</td>
                                            <td>
                                                <Link href={`/invoices/view/${invoice.id}`} className="btn btn-sm btn-primary">
                                                    View
                                                </Link>
                                                <Link href={`/invoices/edit/${invoice.id}`} className="btn btn-sm btn-secondary">
                                                    Edit
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;