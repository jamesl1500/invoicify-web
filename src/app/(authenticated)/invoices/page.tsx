"use client";

import Loading from "@/components/screens/Loading";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function InvoicesPage(){
    const { data: session } = useSession();

    const [paidInvoiceAmount, setPaidInvoiceAmount] = useState(0);
    const [pendingInvoiceAmount, setPendingInvoiceAmount] = useState(0);
    const [overdueInvoiceAmount, setOverdueInvoiceAmount] = useState(0);

    const fetchInvoices = async () => {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/invoices`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            }
        );

        if (response.status === 200) 
        {
            setPaidInvoiceAmount(response.data.numbers.paid);
            setPendingInvoiceAmount(response.data.numbers.unpaid);
            setOverdueInvoiceAmount(response.data.numbers.overdue);
            return response.data.invoices;
        } else {
            throw new Error("Failed to fetch invoices");
        }
    };

    // Use react qwery to fetch the invoices for the client
    const { data: invoices, isLoading } = useQuery(
        {
            queryKey: ["invoices"],
            queryFn: fetchInvoices,
            enabled: !!session?.accessToken,
        },
    );

    // tabbing system
    const openTab = (event: React.MouseEvent<HTMLElement>, tabName: string) => {
        const tablinks = document.getElementsByClassName("tab-link");
        const tabcontent = document.getElementsByClassName("page-content-tab");
        for (let i = 0; i < tablinks.length; i++) {
            tablinks[i].classList.remove("active");
            tabcontent[i].classList.remove("show");
        }
        event.currentTarget.classList.add("active");
        const tabContent = document.getElementsByClassName(tabName);
        for (let i = 0; i < tabContent.length; i++) {
            tabContent[i].classList.add("show");
        }
    };

    // Loading state
    if (isLoading) {
        return <Loading text="Loading your invoices..." />;
    }

    return (
        <div className="page page-view-invoices">
            <div className="page-inner invoices-inner">
                <div className="page-header">
                    <div className="page-header-inner">
                        <div className="page-header-title">
                            <h1>Invoices</h1>
                            <p>View your invoices</p>
                        </div>
                        <div className="page-header-actions">
                            <Link className="btn btn-primary" href="/invoices/create">
                                Create Invoice
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="page-content">
                    <div className="page-content-inner">
                        <div className="page-content-inline-blocks">
                            <div className="page-content-block special">
                                <div className="page-content-block-title">
                                    <h2>Paid</h2>
                                </div>
                                <div className="page-content-block-content">
                                    <h2>${paidInvoiceAmount} USD</h2>
                                </div>
                            </div>
                            <div className="page-content-block openDrawer" >
                                <div className="page-content-block-title">
                                    <h2>Pending</h2>
                                </div>
                                <div className="page-content-block-content">
                                    <h2>${pendingInvoiceAmount} USD</h2>
                                </div>
                            </div>
                            <div className="page-content-block">
                                <div className="page-content-block-title">
                                    <h2>Overdue</h2>
                                </div>
                                <div className="page-content-block-content">
                                    <h2>${overdueInvoiceAmount} USD</h2>
                                </div>
                            </div>
                        </div>
                        <div className="page-content-navigation">
                            <ul className="inner-nav">
                                <li className="tab-link active" onClick={(e) => openTab(e, "invoices")}>
                                    All Invoices
                                </li>
                                <li className="tab-link" onClick={(e) => openTab(e, "paid")}>
                                    Paid
                                </li>
                                <li className="tab-link" onClick={(e) => openTab(e, "pending")}>
                                    Pending
                                </li>
                                <li className="tab-link" onClick={(e) => openTab(e, "overdue")}>
                                    Overdue
                                </li>
                            </ul>
                        </div>
                        <div className="page-content-tabs">
                            <div className="page-content-tab invoices show">
                                {invoices && invoices.length > 0 ? (
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Invoice Number</th>
                                                <th>Client</th>
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
                                                        <Link className="btn btn-sm btn-primary" href={`/invoices/edit/${invoice.id}`}>
                                                            Edit
                                                        </Link>
                                                        <Link className="btn btn-sm btn-secondary" href={`/invoices/view/${invoice.id}`}>
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
                            <div className="page-content-tab paid">
                                {invoices && invoices.filter((invoice: any) => invoice.status === "paid").length > 0 ? (
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Invoice Number</th>
                                                <th>Client</th>
                                                <th>Status</th>
                                                <th>Total Amount</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoices.filter((invoice: any) => invoice.status === "paid").map((invoice: any) => (
                                                <tr key={invoice.id}>
                                                    <td>{invoice.invoice_number}</td>
                                                    <td>{invoice.client.name}</td>
                                                    <td>{invoice.status}</td>
                                                    <td>${invoice.total_amount}</td>
                                                    <td>
                                                        <Link className="btn btn-sm btn-primary" href={`/invoices/edit/${invoice.id}`}>
                                                            Edit
                                                        </Link>
                                                        <Link className="btn btn-sm btn-secondary" href={`/invoices/view/${invoice.id}`}>
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No paid invoices found.</p>
                                )}
                            </div>
                            <div className="page-content-tab pending">
                                {invoices && invoices.filter((invoice: any) => invoice.status === "pending").length > 0 ? (
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Invoice Number</th>
                                                <th>Client</th>
                                                <th>Status</th>
                                                <th>Total Amount</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoices.filter((invoice: any) => invoice.status === "pending").map((invoice: any) => (
                                                <tr key={invoice.id}>
                                                    <td>{invoice.invoice_number}</td>
                                                    <td>{invoice.client.name}</td>
                                                    <td>{invoice.status}</td>
                                                    <td>${invoice.total_amount}</td>
                                                    <td>
                                                        <Link className="btn btn-sm btn-primary" href={`/invoices/edit/${invoice.id}`}>
                                                            Edit
                                                        </Link>
                                                        <Link className="btn btn-sm btn-secondary" href={`/invoices/view/${invoice.id}`}>
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No pending invoices found.</p>
                                )}
                            </div>
                            <div className="page-content-tab overdue">
                                {invoices && invoices.filter((invoice: any) => invoice.due_date > new Date()).length > 0 ? (
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Invoice Number</th>
                                                <th>Client</th>
                                                <th>Status</th>
                                                <th>Total Amount</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoices.filter((invoice: any) => invoice.status === "overdue").map((invoice: any) => (
                                                <tr key={invoice.id}>
                                                    <td>{invoice.invoice_number}</td>
                                                    <td>{invoice.client.name}</td>
                                                    <td>{invoice.status}</td>
                                                    <td>${invoice.total_amount}</td>
                                                    <td>
                                                        <Link className="btn btn-sm btn-primary" href={`/invoices/edit/${invoice.id}`}>
                                                            Edit
                                                        </Link>
                                                        <Link className="btn btn-sm btn-secondary" href={`/invoices/view/${invoice.id}`}>
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No overdue invoices found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}