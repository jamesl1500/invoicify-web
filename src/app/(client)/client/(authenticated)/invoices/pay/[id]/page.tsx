"use client";

import React from "react";
import { useSession } from "next-auth/react";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import Link from "next/link";

import Loading from "@/components/screens/Loading";

export default function PayInvoicePage({ params }: { params: { id: string } }) {
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

    const openTab = (event: React.MouseEvent<HTMLAnchorElement>, tabId: string) => {
        event.preventDefault();
        const tabContent = document.querySelectorAll(".tab-pane");
        tabContent.forEach((tab) => {
            (tab as HTMLElement).classList.remove("show", "active");
        });
        const activeTab = document.getElementById(tabId);

        if (activeTab) {
            (activeTab as HTMLElement).classList.add("show", "active");
        }

        // Remove active class from all tabs
        const navLinks = document.querySelectorAll(".nav-item");
        navLinks.forEach((link) => {
            (link as HTMLElement).classList.remove("active");
        });

        // Add active class to the clicked tab
        const clickedLink = event.currentTarget;

        if (clickedLink) {
            clickedLink.parentElement.classList.add("active");
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
                        <h1>Pay Invoice</h1>
                        <p>Pay your invoice</p>
                    </div>
                    <div className="page-header-actions">
                        <Link href="/client/invoices" className="btn btn-secondary">
                            Back to Invoices
                        </Link>
                    </div>
                </div>
                <div className="page-content">
                    <div className="page-content-inner">
                        {data ? (
                            <div className="invoice-details">
                                <h2>Invoice #{data.invoice.invoice_number}</h2>
                                <p><strong>Date:</strong> {new Date(data.invoice.issue_date).toLocaleDateString()}</p>
                                <p><strong>Total Amount:</strong> ${data.invoice.total_amount}</p>
                                <div className="payment-options">
                                    
                                </div>
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