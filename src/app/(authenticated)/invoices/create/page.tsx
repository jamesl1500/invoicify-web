"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";

import { useMemo } from "react";
import { useSession } from "next-auth/react";

const fetchClients = async (token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 200) {
        return response.json();
    } else if (response.status === 404) {
        return { data: [] }; // Return an empty array if no clients are found
    } else {
        throw new Error("Failed to fetch clients");
    }
}

export default function CreateInvoicePage() {
    // Let generate an invoice number 
    const invoiceNumber = useMemo(() => {
        const date = new Date();
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${Math.floor(Math.random() * 10000)}`;
    }
    , []);

    // Get the user session
    const { data: session } = useSession();

    // Get clients that belong to the user
    const { data: clients, error, isLoading } = useQuery({
        queryKey: ["clients"],
        queryFn: () => fetchClients(session?.accessToken || ""),
        enabled: !!session?.accessToken,
    }) as { data: { id: string; name: string }[] | undefined, error: any, isLoading: boolean };

    return (
        <div className="page page-create-invoice">
            <div className="page-inner">
                <div className="page-header">
                    <div className="page-header-title">
                        <h1>Create Invoice</h1>
                        <p>Create a new invoice for your clients</p>
                    </div>
                </div>
                <div className="page-content">
                    <div className="page-content-inner">
                        <div className="page-content-inner-client-select">
                            {/* Client selection dropdown */}
                            <div className="form-group">
                                {clients?.clients.length === 0 ? (
                                    <p>No clients found. Please create a client first.</p>
                                ) : (
                                    <>
                                        <label htmlFor="client-select">Select Client</label>
                                        <select id="client-select" className="form-control">
                                            {clients?.clients.map((client: { id: string; name: string }) => (
                                                <option key={client.id} value={client.id}>
                                                    {client.name}
                                                </option>
                                            ))}
                                        </select>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="page-content-inner-form">
                            {/* Form for creating a new invoice */}
                            <form>
                                {/* Invoice Number */}
                                <div className="form-group">
                                    <label htmlFor="invoice-number">Invoice Number</label>
                                    <input type="text" id="invoice-number" className="form-control" placeholder="Enter invoice number" />
                                </div>
                                <div className="form-group-inline">
                                    <div className="form-group">
                                        <label htmlFor="invoice-date">Invoice Date</label>
                                        <input type="date" id="invoice-date" className="form-control" value={new Date().toISOString().split("T")[0]} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="due-date">Due Date</label>
                                        <input type="date" id="due-date" className="form-control" value={new Date().toISOString().split("T")[0]} />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="page-content-inner-actions">
                            <button type="submit" className="btn btn-primary">
                                Create Invoice
                            </button>
                            <button type="button" className="btn btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}