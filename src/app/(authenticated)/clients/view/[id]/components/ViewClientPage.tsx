"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import Link from "next/link";

import Loading from "@/components/screens/Loading";

const fetchClient = async (clientId: string, token: string) => {
    const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/clients/${clientId}`,
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
        throw new Error("Failed to fetch client");
    }
}

export default function ViewClientPage(id: number) {
    const { data: session } = useSession();
    const clientId = id.clientId;

    const { data, error, isLoading } = useQuery({
        queryKey: ["client", clientId],
        queryFn: () => fetchClient(clientId, session?.accessToken || ""),
        enabled: !!session?.accessToken,
    }) as { data: Client | undefined; error: any; isLoading: boolean };

    if (isLoading) {
        return <Loading text="Loading your client"/>;
    }

    if (error) {
        return <div>Error fetching client: {error.message}</div>;
    }

    return (
        <div className="page page-client-view">
            <div className="page-inner">
                <div className="page-header">
                    <div className="page-header-inner">
                        <div className="page-header-title">
                            <h1>Client Details</h1>
                            <p>View client details</p>
                        </div>
                        <div className="page-header-actions">
                            <Link href="/clients/edit/[id]" as={`/clients/edit/${clientId}`} className="btn btn-primary">
                                Edit Client
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="page-content">
                    <div className="page-content-inner">
                        <h2>{data?.client.name}</h2>
                        <p>Email: {data?.client.email}</p>
                        <p>Phone: {data?.client.phone}</p>
                        <p>Address: {data?.client.address}</p>
                        <p>Created At: {new Date(data?.client.created_at).toLocaleDateString()}</p>
                        <p>Updated At: {new Date(data?.client.updated_at).toLocaleDateString()}</p>

                        <div className="page-content-invoices">
                            <h3>Invoices</h3>
                            {data?.invoices.length ? (
                                <ul>
                                    {data.invoices.map((invoice) => (
                                        <li key={invoice.id}>
                                            <Link href={`/invoices/view/${invoice.id}`}>
                                                Invoice #{invoice.invoice_number} - {new Date(invoice.created_at).toLocaleDateString()}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No invoices found for this client.</p>
                            )}
                        </div>

                        <div className="page-content-payments">
                            <h3>Payments</h3>
                            {data?.payments.length ? (
                                <ul>
                                    {data.payments.map((payment) => (
                                        <li key={payment.id}>
                                            Payment of ${payment.amount} on {new Date(payment.created_at).toLocaleDateString()}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No payments found for this client.</p>
                            )}
                        </div>

                        <div className="page-content-actions">
                            <Link href="/clients" className="btn btn-secondary">
                                Back to Clients
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}