"use client";

import React from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Loading from '@/components/screens/Loading';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faMoneyBill } from "@fortawesome/free-solid-svg-icons";

// Fetch stripe payout info
const fetchStripePayoutInfo = async (token: string) => {
    const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/stripe/user/account/get`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token || ""}`,
            },
        }
    );

    return response.data;
};

// Fetch payouts
const fetchPayouts = async (token: string) => {
    const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/stripe/user/account/payouts`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token || ""}`,
            },
        }
    );

    return response.data;
};

export default function StripePageClient() {
    const { data: session, status } = useSession();

    // Get link to stripe dashboard
    const getStripeDashboardLink = async () => {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/stripe/user/account/settingsLink`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.accessToken || ""}`,
                },
            }
        );

        if (response.status === 200) {
            window.open(response.data.url, "_blank");
        } else {
            console.error("Error fetching Stripe dashboard link:", response);
        }

        return response.data;
    };

    // Get stripe info
    const { data: stripeInfo, error: stripeError, isLoading: stripeLoading } = useQuery({
        queryKey: ["stripeInfo"],
        queryFn: () => fetchStripePayoutInfo(session?.accessToken || ""),
        enabled: status === "authenticated" && !!session?.accessToken, // Wait for session to load and ensure token is available
    });

    // Get payouts
    const { data: payouts, error: payoutsError, isLoading: payoutsLoading } = useQuery({
        queryKey: ["payouts"],
        queryFn: () => fetchPayouts(session?.accessToken || ""),
        enabled: status === "authenticated" && !!session?.accessToken, // Wait for session to load and ensure token is available
    });

    return (
        <div className="page page-stripe-dash">
            <div className="page-inner">
                <div className="page-header">
                    <div className="page-header-inner">
                        <div className="page-header-title">
                            <h1>Stripe & Payouts</h1>
                            <p>Manage your Stripe account and payouts</p>
                        </div>
                        <div className="page-header-actions">
                            <button onClick={getStripeDashboardLink} className="btn btn-primary">
                                Stripe settings
                            </button>
                        </div>
                    </div>
                </div>
                <div className="page-content">
                    <div className="page-content-inner">
                        <div className="page-content-kpis">
                            <div className="page-content-kpi primary">
                                <div className="page-content-kpi-icon">
                                    <FontAwesomeIcon icon={faMoneyBill} />
                                </div>
                                <div className="page-content-kpi-content">
                                    <div className="page-content-kpi-title">
                                        <h1>Total Available</h1>
                                        <p>Amount available for you to cash out</p>
                                    </div>
                                    <div className="page-content-kpi-value">
                                        {stripeInfo?.payouts_enabled ? (
                                            stripeInfo?.balances?.available.map((balance) => (
                                                <p key={balance.currency}>
                                                    {balance.currency.toUpperCase()} ${balance.amount / 100}
                                                </p>
                                            ))
                                        ) : (
                                            <p>Loading balance...</p>
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
                                        <h1>Pending </h1>
                                        <p>Amount pending for you to cash out</p>
                                    </div>
                                    <div className="page-content-kpi-value">
                                        {stripeInfo?.payouts_enabled ? (
                                            stripeInfo?.balances?.pending.map((balance) => (
                                                <p key={balance.currency}>
                                                    {balance.currency.toUpperCase()} ${balance.amount / 100}
                                                </p>
                                            ))
                                        ) : (
                                            <p>Loading balance...</p>
                                        )}
                                    </div>  
                                </div>                              
                            </div>
                        </div>

                        <div className="page-content-recent-payouts">
                            <div className="page-content-recent-payouts-header">
                                <h1>Recent Payouts</h1>
                                <p>View your recent payouts</p>
                            </div>
                            <div className="page-content-recent-payouts-list">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payoutsLoading ? (
                                            <tr>
                                                <td colSpan={3}>
                                                    <Loading />
                                                </td>
                                            </tr>
                                        ) : payouts?.data?.length > 0 ? (
                                            payouts.data.map((payout) => (
                                                <tr key={payout.id}>
                                                    <td>{new Date(payout.arrival_date * 1000).toLocaleDateString()}</td>
                                                    <td>${payout.amount / 100}</td>
                                                    <td>{payout.status}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3}>No recent payouts</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}