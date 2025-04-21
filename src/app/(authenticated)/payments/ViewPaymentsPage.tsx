"use client";

import { useSession } from "next-auth/react";
import Loading from "@/components/screens/Loading";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import Link from "next/link";

interface Payment {
    id: string;
    client: {
        name: string;
    };
    invoice: {
        invoice_number: string;
    };
    amount: number;
    payment_date: string;
    status: string;
}

export default function ViewPaymentsPage() {
    const { data: session } = useSession();

    const fetchPayments = async () => {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/payments`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            }
        );

        if (response.status === 200) {

            return response.data.payments;
        } else {
            throw new Error("Failed to fetch payments");
        }
    };

    // Use react qwery to fetch the payments for the user
    const { data: payments, isLoading } = useQuery(
        {
            queryKey: ["payments"],
            queryFn: fetchPayments,
            enabled: !!session?.accessToken,
        },
    );

    // Function to fetch the payments data

    // Loading state
    if (isLoading) {
        return <Loading text="Loading your payments..." />;
    }

    return (
        <div className="page page-payments">
            <div className="page-inner payments-inner">
                <div className="page-header">
                    <div className="page-header-inner">
                        <div className="page-header-title">
                            <h1>Payments</h1>
                            <p>View your payments you've received</p>
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
                                        <th>From</th>
                                        <th>Invoice #</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map((payment: Payment) => (
                                        <tr key={payment.id}>
                                            <td>{payment.client.name}</td>
                                            <td>{payment.invoice.invoice_number}</td>
                                            <td>${payment.amount}</td>
                                            <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                                            <td>{payment.status}</td>
                                            <td>
                                                <Link href={`/payments/view/${payment.id}`} className="btn btn-sm btn-primary">
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