"use client";

import React from "react";
import { useSession } from "next-auth/react";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import Link from "next/link";

import Loading from "@/components/screens/Loading";

export default function ViewInvoicePage(id: string) {
    const { data: session } = useSession();

    const invoiceId = id.invoiceId;

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
                    <div className="page-header-inner">
                        <div className="page-header-title">
                            <h1>Invoice</h1>
                            <p>View your invoice</p>
                        </div>
                        <div className="page-header-actions">
                            {data.invoice.status === "paid" ? (
                                <Link href={`/client/invoices/view/${invoiceId}/receipt`} className="btn btn-success">
                                    View Receipt
                                </Link>
                            ) : (
                                <Link href={`/client/invoices/pay/${invoiceId}`} className="btn btn-primary">
                                    Pay Invoice
                                </Link>
                            )}

                            <Link href="/client/invoices" className="btn btn-secondary">
                                Back to Invoices
                            </Link>
                        </div>
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
                                <div className="invoice-tabs">
                                    <ul className="invoice-tabs" role="tablist">
                                        <li className="nav-item active">
                                            <Link className="nav-link" href="#details" data-bs-toggle="tab" data-tab="details" onClick={(e) => openTab(e, "details")}>Details</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" href="#items" data-bs-toggle="tab" data-tab="items" onClick={(e) => openTab(e, "items")}>Items</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link href="#notifications" className="nav-link" data-bs-toggle="tab" data-tab="notifications" onClick={(e) => openTab(e, "notifications")}>Notifications</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link href="#payments" className="nav-link" data-bs-toggle="tab" data-tab="payments" onClick={(e) => openTab(e, "payments")}>Payments</Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="tab-content tab-items">
                                    <div className="tab-pane fade show active" id="details">
                                        <h3>Invoice Details</h3>
                                        <p><strong>Notes:</strong> <p>{data.invoice.notes || "No additional notes."}</p></p>
                                        <p><strong>Terms:</strong> <p>{data.invoice.terms || "No specific terms."}</p></p>
                                    </div>
                                    <div className="tab-pane fade" id="items">
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
                                    <div className="tab-pane fade" id="notifications">
                                        <h3>Notifications</h3>
                                        {data.notifications.length > 0 ? (
                                            <ul className="list-group">
                                                {data.notifications.map((notification) => (
                                                    <li key={notification.id} className="list-group-item">
                                                        <p><strong>{new Date(notification.created_at).toLocaleDateString()}:</strong> {notification.action} - {notification.description}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No notifications for this invoice.</p>
                                        )}
                                    </div>
                                    <div className="tab-pane fade" id="payments">
                                        <h3>Payments</h3>
                                        {data.payments.length > 0 ? (
                                            <table className="invoice-payments table">
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Amount</th>
                                                        <th>Method</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.payments.map((payment) => (
                                                        <tr key={payment.id}>
                                                            <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                                                            <td>${payment.amount}</td>
                                                            <td>{payment.method}</td>
                                                            <td>{payment.status}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p>No payments recorded for this invoice.</p>
                                        )}
                                    </div>
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