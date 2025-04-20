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
        `${process.env.NEXT_PUBLIC_API_URL}/client/dashboard`,
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
    });

    if (status === "loading" || !session || isLoading) {
        return <Loading text="Loading your dashboard..." />;
    }

    return (
        <div className="page page-client-dashboard">
            <div className="page-inner">
                <div className="page-header">
                    <div className="page-header-inner container">
                        <div className="page-header-title">
                            <h1>Dashboard</h1>
                            <p>Welcome back, {session.user.name}</p>
                        </div>
                        <div className="page-header-actions">
                            
                        </div>
                    </div>
                </div>
                <div className="page-content container no-border">
                    <div className="page-content-inner">
                        <div className="page-content-kpis">
                            <div className="page-content-kpi primary">
                                <div className="page-content-kpi-icon">
                                    <FontAwesomeIcon icon={faMoneyBill} />
                                </div>
                                <div className="page-content-kpi-content">
                                    <div className="page-content-kpi-title">
                                        <h1>Amount you owe</h1>
                                        <p>Total amount due</p>
                                    </div>
                                    <div className="page-content-kpi-value">
                                        {data?.total_owed ? (
                                            <h1>${data?.total_owed}</h1>
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
                                        <h1>Amout you've paid</h1>
                                        <p>Total amount paid by you</p>
                                    </div>
                                    <div className="page-content-kpi-value">
                                        {data?.total_paid ? (
                                            <h1>${data?.total_paid}</h1>
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

                            {data?.invoices.length === 0 && (
                                <div className="alert alert-info">
                                    No recent invoices found.
                                </div>
                            )}

                            {data?.invoices.length > 0 && (
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
                                        {data.invoices.map((invoice: any) => (
                                            <tr key={invoice.id}>
                                                <td>{invoice.invoice_number}</td>
                                                <td>{invoice.status}</td>
                                                <td>${invoice.total_amount}</td>
                                                <td>
                                                    <Link className="btn btn-sm btn-primary" href={`/client/invoices/pay/${invoice.id}`}>
                                                        Pay
                                                    </Link>
                                                    <Link className="btn btn-sm btn-secondary" href={`/client/invoices/view/${invoice.id}`}>
                                                        View
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
        </div>
    );
};

export default DashboardPage;