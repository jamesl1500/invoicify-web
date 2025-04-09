"use client";

import React from "react";
import { useSession } from "next-auth/react";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import Loading from "@/components/screens/Loading";

import Link from "next/link";
import { toast } from "react-toastify";
import { Popconfirm } from "antd";

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

    // Delete invoice function
    const deleteInvoice = async () => {
        if (session?.accessToken) {
            try {
                const response = await axios.delete(
                    `${process.env.NEXT_PUBLIC_API_URL}/invoices/${invoiceId}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session.accessToken}`,
                        },
                    }
                );

                if (response.status === 200) {
                    // Handle successful deletion
                    toast.success("Invoice deleted successfully");

                    // Redirect to the invoices page
                    window.location.href = "/invoices";
                }
            } catch (error) {
                console.error("Error deleting invoice:", error);
            }
        }
    };

    // Refund payment function
    const refundPayment = async (paymentId: string) => {
        if (session?.accessToken) {
            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/payments/${paymentId}/refund`,
                    {},
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session.accessToken}`,
                        },
                    }
                );

                if (response.status === 200) {
                    // Handle successful refund
                    toast.success("Payment refunded successfully");
                }
            } catch (error) {
                console.error("Error refunding payment:", error);
            }
        }
    };

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
                    <div className="page-header-actions">
                        <Link href={`/invoices/edit/${invoiceId}`} className="btn btn-primary">
                            Edit Invoice
                        </Link>
                        <button className="btn btn-danger" onClick={deleteInvoice}>Delete Invoice</button>
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
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.payments.map((payment) => (
                                                        <tr key={payment.id}>
                                                            <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                                                            <td>${payment.amount}</td>
                                                            <td>{payment.method}</td>
                                                            <td>{payment.status}</td>
                                                            <td>
                                                                <Link href={`/payments/view/${payment.id}`} className="btn btn-primary btn-sm">
                                                                    View 
                                                                </Link>
                                                                {payment.status !== "refunded" && (
                                                                    <Popconfirm
                                                                        title="Are you sure you want to refund this payment?"
                                                                        onConfirm={() => refundPayment(payment.id)}
                                                                        okText="Yes"
                                                                        cancelText="No"
                                                                    >
                                                                        <button className="btn btn-danger btn-sm">
                                                                            Refund
                                                                        </button>
                                                                    </Popconfirm>
                                                                )}
                                                            </td>
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