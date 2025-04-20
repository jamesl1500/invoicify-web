 "use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import Loading from "@/components/screens/Loading";

import { Popconfirm } from "antd";
import { toast } from "react-toastify";

export default function ViewPaymentPage({ paymentId }: { paymentId: { invoiceId: string } }) {
    // Get the session
    const { data: session } = useSession();

    // Fetch the payment details
    const fetchPayment = async (paymentId: string, token: string) => {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/payments/${paymentId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch payment");
        }
    };

    // Use react-query to fetch the payment details
    const { data, error, isLoading } = useQuery({
        queryKey: ["payment", paymentId],
        queryFn: () => fetchPayment(paymentId, session?.accessToken || ""),
        enabled: !!session?.accessToken,
    });

    const refundPayment = async (paymentId: string) => {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/payments/${paymentId}/refund`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            }
        );

        if (response.status === 200) {
            toast.success("Payment refunded successfully");
            // Optionally, you can refetch the payment data to update the UI
            window.location.reload();
        } else {
            alert("Failed to refund payment");
        }
    };

    // Loading state
    if (isLoading) {
        return <Loading text="Loading your payment..." />;
    }

    return (
        <div className="page page-invoice">
            <div className="page-inner">
                <div className="page-header">
                    <div className="page-header-inner">
                        <div className="page-header-title">
                            <h1>Payment</h1>
                            <p>View your payment</p>
                        </div>
                        <div className="page-header-actions">
                            <Link href={`/invoices/view/${data?.payment.invoice_id}`} className="btn btn-primary">
                                View Invoice
                            </Link>
                            {data?.payment.status !== "refunded" && (
                                <Popconfirm
                                    title="Are you sure you want to refund this payment?"
                                    onConfirm={() => refundPayment(data.payment.id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <button className="btn btn-danger">
                                        Refund Payment
                                    </button>
                                </Popconfirm>
                            )}
                        </div>
                    </div>
                </div>
                <div className="page-content">
                    <div className="page-content-inner">
                        {data ? (
                            <div className="invoice-details">
                                <h2>Payment from <Link href={`/clients/view/${data.payment.client_id}`}>{data.payment.client.name}</Link></h2>
                                <p>
                                    <strong>Amount:</strong> ${data.payment.amount}
                                </p>
                                <p>
                                    <strong>Date:</strong> {new Date(data.payment.created_at).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>Status:</strong> {data.payment.status}
                                </p>
                            </div>
                        ) : (
                            <p>Unable to load payment details.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}