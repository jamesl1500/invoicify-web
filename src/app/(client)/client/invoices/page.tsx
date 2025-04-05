"use client";

import Loading from "@/components/screens/Loading";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";

export default function ClientInvoices() {
    const { data: session } = useSession();

    const fetchInvoices = async () => {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/client/invoices`,
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
            throw new Error("Failed to fetch invoices");
        }
    };

    // Use react qwery to fetch the invoices for the client
    const { data: invoices, isLoading } = useQuery(
        {
            queryKey: ["client-invoices"],
            queryFn: fetchInvoices,
            enabled: !!session?.accessToken,
        },
    );

    // Function to fetch the invoices data

    // Loading state
    if (isLoading) {
        return <Loading text="Loading your invoices..." />;
    }
    return (
        <div className="page page-client-invoices">
            <div className="page-inner client-invoices-inner">
                <div className="page-header">
                    <div className="page-header-title">
                        <h1>Invoices</h1>
                        <p>View your invoices</p>
                    </div>
                    <div className="page-header-actions">

                    </div>
                </div>
                <div className="page-content">
                    <div className="page-content-inner">
                        {invoices && invoices.length > 0 ? (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Invoice Number</th>
                                        <th>Client Name</th>
                                        <th>Status</th>
                                        <th>Total Amount</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map((invoice: any) => (
                                        <tr key={invoice.id}>
                                            <td>{invoice.invoice_number}</td>
                                            <td>{invoice.client.name}</td>
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
                        ) : (
                            <p>No invoices found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}