"use client";

import React from 'react';
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import Loading from "@/components/screens/Loading";

export default function PaymentViewPage({ params }: { params: { id: string } }) {
    const { data: session } = useSession();
    const { id } = params;

    const fetchPayment = async () => {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/client/payments/${id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            }
        );

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch payment");
        }
    };
    // Use react qwery to fetch the payment for the client
    const { data: payment, isLoading } = useQuery(
        {
            queryKey: ["client-payment", id],
            queryFn: fetchPayment,
            enabled: !!session?.accessToken,
        },
    );

    return (
        <div className="page page-client-payment-view">
            <div className="page-inner client-payment-view-inner">
                <div className="page-header">
                    <div className="page-header-inner">
                        <div className="page-header-title">
                            <h1>Payment</h1>
                            <p>View your payment to {payment?.user?.name}</p>
                        </div>
                        <div className="page-header-actions">
                            <Link href="/client/payments" className="btn ">Back to Payments</Link>
                        </div>
                    </div>
                </div>
                <div className="page-content">
                    <div className="page-content-inner">
                        {isLoading ? (
                            <Loading text="Loading your payment..." />
                        ) : (
                            <div className="payment-details">
                                <h2>Payment Details</h2>
                                <p><strong>ID:</strong> {payment?.payment.id}</p>
                                <p><strong>Amount:</strong> ${payment?.payment.amount}</p>
                                <p><strong>Status:</strong> {payment?.payment.status}</p>
                                {/* Add more payment details as needed */}
                                <h3>Payment Method</h3>
                                <p><strong>Type:</strong> {payment?.payment_method?.type}</p>
                                <p><strong>Card Brand:</strong> {payment?.payment_method?.card?.brand}</p>
                                <p><strong>Card Last 4:</strong> {payment?.payment_method?.card?.last4}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}