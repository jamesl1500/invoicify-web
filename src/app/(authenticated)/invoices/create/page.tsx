"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";

import axios from "axios";

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
    }, []);

    // Get the user session
    const { data: session } = useSession();

    // Get clients that belong to the user
    const { data: clients, error, isLoading } = useQuery({
        queryKey: ["clients"],
        queryFn: () => fetchClients(session?.accessToken || ""),
        enabled: !!session?.accessToken,
    }) as { data: { id: string; name: string }[] | undefined, error: any, isLoading: boolean };

    // Create invoice form submit
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Get the form data
        const invoiceData = new FormData(event.currentTarget);
        const clientId = invoiceData.get("client-select");
        const invoiceNumber = invoiceData.get("invoice-number");
        const invoiceDate = invoiceData.get("invoice-date");
        const dueDate = invoiceData.get("due-date");

        console.log("Invoice Data", {
            clientId,
            invoiceNumber,
            invoiceDate,
            dueDate,
            items: invoiceItems,
            taxRate,
            subtotal,
            tax,
            total, 
        });

        // Create the invoice
        const response = axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/invoices`,
            {
                clientId,
                invoiceNumber,
                invoiceDate,
                dueDate,
                items: invoiceItems,
                taxRate,
                subtotal,
                tax,
                total,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            }
        );

        if (response.status === 201 || response.status === 200) {
            alert("Invoice created successfully!");
            // Redirect to the invoice page
            window.location.href = "/invoices";
        } else {
            alert("Failed to create invoice");
        }
    };

    // Invoice items
    const [invoiceItems, setInvoiceItems] = useState([
        {
            item: "",
            description: "",
            quantity: 1,
            price: 0,
        },
    ]);

    // Tax rate
    const [taxRate, setTaxRate] = useState(5);

    // Add items
    const addItem = () => {
        setInvoiceItems([
            ...invoiceItems,
            {
                item: "",
                description: "",
                quantity: 1,
                price: 0,
            },
        ]);
    }

    // Remove items
    const removeItem = (index: number) => {
        setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
    }

    // update items
    const updateItem = (index: number, field: string, value: string | number) => {
        const updatedItems = [...invoiceItems];
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value,
        };
        setInvoiceItems(updatedItems);
    }

    // Calc subtotal
    const subtotal = invoiceItems.reduce((acc, item) => {
        return acc + item.quantity * item.price;
    }, 0);

    // Calc taxes and total
    const tax = (subtotal * taxRate) / 100;
    const total = subtotal + tax;

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
                        <div className="page-content-inner-form">
                            {/* Form for creating a new invoice */}
                            <form onSubmit={handleSubmit}>
                                {/* Client selection dropdown */}
                                <div className="form-group">
                                    {clients?.length === 0 ? (
                                        <p>No clients found. Please create a client first.</p>
                                    ) : (
                                        <>
                                            <label htmlFor="client-select">Select Client</label>
                                            <select id="client-select" name="client-select" className="form-control">
                                                {clients?.clients.map((client: { id: string; name: string }) => (
                                                    <option key={client.id} value={client.id}>
                                                        {client.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </>
                                    )}
                                </div>

                                {/* Invoice Number */}
                                <div className="form-group">
                                    <label htmlFor="invoice-number">Invoice Number</label>
                                    <input type="text" name="invoice-number" id="invoice-number" className="form-control" placeholder="Enter invoice number" value={invoiceNumber} readOnly />
                                </div>

                                <div className="form-group-inline">
                                    <div className="form-group">
                                        <label htmlFor="invoice-date">Invoice Date</label>
                                        <input type="date" name="invoice-date" id="invoice-date" className="form-control" value={new Date().toISOString().split("T")[0]} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="due-date">Due Date</label>
                                        <input type="date" name="due-date" id="due-date" className="form-control" value={new Date().toISOString().split("T")[0]} />
                                    </div>
                                </div>

                                <div className="form-group invoice-items">
                                    <label htmlFor="invoice-items">Invoice Items</label>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Item</th>
                                                <th>Description</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                                <th>Total</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoiceItems.map((item, index) => 
                                                <tr key={index}>
                                                    <td>
                                                        <input type="text" className="form-control" placeholder="Item name" value={item.item} onChange={(e) => updateItem(index, "item", e.target.value)} />
                                                    </td>
                                                    <td>
                                                        <input type="text" className="form-control" placeholder="Description" value={item.description} onChange={(e) => updateItem(index, "description", e.target.value)} />
                                                    </td>
                                                    <td>
                                                        <input type="number" className="form-control" placeholder="Quantity" value={item.quantity} onChange={(e) => updateItem(index, "quantity", Number(e.target.value))} />
                                                    </td>
                                                    <td>
                                                        <input type="number" className="form-control" placeholder="Price" value={item.price} onChange={(e) => updateItem(index, "price", Number(e.target.value))} />
                                                    </td>
                                                    <td>${(item.quantity * item.price).toFixed(2)}</td>
                                                    <td>
                                                    {invoiceItems.length > 1 && (
                                                        <button className="btn btn-sm" onClick={() => removeItem(index)}>
                                                        Remove
                                                        </button>
                                                    )}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    <button type="button" className="btn btn-secondary" onClick={addItem}>
                                        Add Item
                                    </button>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="tax-rate">Tax Rate (%)</label>
                                    <input type="number" id="tax-rate" className="form-control" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subtotal">Subtotal</label>
                                    <input type="text" id="subtotal" className="form-control" value={`$${subtotal.toFixed(2)}`} readOnly />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="tax">Tax</label>
                                    <input type="text" id="tax" className="form-control" value={`$${tax.toFixed(2)}`} readOnly />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="total">Total</label>
                                    <input type="text" id="total" className="form-control" value={`$${total.toFixed(2)}`} readOnly />
                                </div>

                                <div className="form-group">
                                    <button type="submit" className="btn btn-primary">
                                        Create Invoice
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={() => window.history.back()}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}