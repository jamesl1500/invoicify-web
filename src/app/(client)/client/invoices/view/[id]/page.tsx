"use client";

import React from "react";
import { useSession } from "next-auth/react";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import Loading from "@/components/screens/Loading";

export default function ViewInvoicePage({ params }: { params: { id: string } }) {
    const { data: session } = useSession();

    const invoiceId = params.id;

    // Function to fetch the invoice data
    const fetchInvoice = async (invoiceId: string, token: string) => {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/invoices/${invoiceId}`,
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
            throw new Error("Failed to fetch invoice");
        }
    };

    // Fetch the invoice data using the invoiceId
    const { data, error, isLoading } = useQuery({
        queryKey: ["invoice", invoiceId],
        queryFn: () => fetchInvoice(invoiceId, session?.accessToken || ""),
        enabled: !!session?.accessToken,
    }) as { data: Invoice | undefined; error: any; isLoading: boolean };

    // This is the view invoice page
    if( isLoading || !session) {
        return <Loading text="Loading your invoice..." />;
    }

    return (
        <div className="page page-invoice">
            <div className="page-inner">
                <div className="page-header">
                    <div className="page-header-title">
                        <h1>Invoice</h1>
                        <p>View your invoice</p>
                    </div>
                </div>
                <div className="page-content">
                    <div className="page-content-inner">
                        {data ? (
                            <div className="invoice-details">
                                <h2>Invoice #{data.invoice.invoice_number}</h2>
                                <p><strong>Date:</strong> {new Date(data.invoice.issue_date).toLocaleDateString()}</p>
                                <p><strong>Customer:</strong> {data.client.name}</p>
                                <p><strong>Total Amount:</strong> ${data.invoice.total_amount}</p>
                                <p><strong>Status:</strong> {data.invoice.status}</p>
                                <h3>Items</h3>
                                <table className="invoice-items table">
                                    <thead>
                                        <tr>
                                            <th>Description</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.items.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.description}</td>
                                                <td>{item.quantity}</td>
                                                <td>${item.unit_price}</td>
                                                <td>${(item.quantity * item.unit_price)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>Unable to load invoice details.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}