"use client";

import React from 'react';
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import Link from "next/link";

export default function ViewPaymentsPage()
{
    const { data: session } = useSession();

    const getClientPayments = async (token: string) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client/payments`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                return response.data.payments;
            }else{
                throw new Error("Failed to fetch client payments" + response.status);            
            }
        } catch (error) {
            console.error("Error fetching client payments:", error);
            throw new Error("Failed to fetch client payments");
        }
    };

    // Fetch client payments using React Query
    const { data: payments, error, isLoading } = useQuery({
        queryKey: ["clientPayments", session?.accessToken],
        queryFn: () => getClientPayments(session?.accessToken),
        enabled: !!session?.accessToken,
    });

    return (
        <div className="page page-client-payments">
            <div className="page-inner client-payments-inner">
                <div className="page-header">
                    <div className="page-header-inner">
                        <div className="page-header-title">
                            <h1>Payments</h1>
                            <p>View your payments you've made</p>
                        </div>
                        <div className="page-header-actions">

                        </div>
                    </div>
                </div>
                <div className="page-content">
                    <div className="page-content-inner">
                        {payments && payments.length > 0 ? (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Invoice Number</th>
                                        <th>To</th>
                                        <th>Status</th>
                                        <th>Total Amount</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map((payment: any) => (
                                        <tr key={payment.id}>
                                            <td>{payment.invoice.invoice_number}</td>
                                            <td>{payment.user.name}</td>
                                            <td>{payment.status}</td>
                                            <td>${payment.amount}</td>
                                            <td>
                                                <Link href={`/client/payments/view/${payment.id}`} className="btn btn-sm btn-primary">
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No payments found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}