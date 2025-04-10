"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";

import axios from "axios";
import { toast } from "react-toastify";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

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
        console.log("Clients not found");
        return response.json(); // Return an empty array if no clients are found
    } else {
        throw new Error("Failed to fetch clients");
    }
}

export default function CreateInvoicePage() {
    const [clientId, setClientId] = useState<string | null>(null);
    const [clientName, setClientName] = useState<string | null>(null);
    const [clientEmail, setClientEmail] = useState<string | null>(null);

    const [invoiceDate, setInvoiceDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [dueDate, setDueDate] = useState<string>(new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split("T")[0]);
    
    // Let generate an invoice number 
    const invoiceNumber = useMemo(() => {
        const date = new Date();
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${Math.floor(Math.random() * 10000)}`;
    }, []);

    const [invoiceNum, setInvoiceNum] = useState<string>(invoiceNumber);
    const [invoiceNotes, setInvoiceNotes] = useState<string>("");
    const [invoiceTerms, setInvoiceTerms] = useState<string>("");

    // For handling submit button status (Make sure form is complete)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

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

    // Check if form is valid
    const checkFormValidity = () => {
        const isValid = invoiceItems.every((item) => item.item && item.description && item.quantity > 0 && item.price > 0);
        const isClientSelected = clientId !== null && clientName !== null && clientEmail !== null;
        const isInvoiceDateValid = invoiceDate !== "";
        const isDueDateValid = dueDate !== "";
        const isTaxRateValid = taxRate > 0;

        if (isValid && isClientSelected && isInvoiceDateValid && isDueDateValid && isTaxRateValid) {
            setIsFormValid(true);
            return true;
        }
        return false;
    };

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
        const taxRate = invoiceData.get("tax-rate");
        const notes = invoiceData.get("notes");
        const terms = invoiceData.get("terms");

        // Create the invoice
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/invoices`, {
                clientId,
                invoiceNumber,
                invoiceDate,
                dueDate,
                items: invoiceItems,
                taxRate,
                subtotal,
                notes,
                terms,
                tax,
                total,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            });

            if (response.status === 201) {
                // Use toastify
                toast.success("Invoice created successfully!");

                // Redirect to the invoice view page
                window.location.href = `/invoices/view/${response.data.invoice.id}`;
            } else {
                toast.error("An error occurred while creating the invoice.");
            }
        } catch (error) {
            toast.error("An error occurred while creating the invoice.");
            console.error("Error creating invoice:", error);
        }
    };

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

    const handleClientChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedClientId = event.target.value;
        clients?.clients?.forEach((client: { id: string; name: string; email: string }) => {
            if (client.id == selectedClientId) {
                setClientId(client.id);
                setClientName(client.name);
                setClientEmail(client.email);
            }
        });
    };

    return (
        <div className="page page-create-invoice">
            <div className="page-inner">
                <div className="page-content">
                    <div className="page-content-inner">
                        <div className="page-content-block left-block">
                            <form onSubmit={handleSubmit}>
                                <div className="page-content-block-header">
                                    <h1>Invoice details</h1>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="invoice-number">Invoice Number</label>
                                    <input
                                        type="text"
                                        id="invoice-number"
                                        name="invoice-number"
                                        className="form-control"
                                        value={invoiceNumber}
                                        readOnly
                                    />
                                </div>
                                <div className="form-group-inline">
                                    <div className="form-group">
                                        <label htmlFor="invoice-date">Invoice Date</label>
                                        <input
                                            type="date"
                                            id="invoice-date"
                                            name="invoice-date"
                                            className="form-control"
                                            defaultValue={new Date().toISOString().split("T")[0]}
                                            onChange={(e) => setInvoiceDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="due-date">Due Date</label>
                                        <input
                                            type="date"
                                            id="due-date"
                                            name="due-date"
                                            className="form-control"
                                            defaultValue={new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split("T")[0]}
                                            onChange={(e) => setDueDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="page-content-block-header">
                                    <h1>Bill Payment</h1>
                                </div>
                                <div className="form-group">
                                    {clients?.clients.length === 0 ? (
                                        <>
                                            <p>No clients found. Please create a client first.</p>
                                            <Link href="/clients/create" className="btn btn-primary">
                                                Create Client
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <label htmlFor="client-select">Select a Client</label>
                                            <select id="client-select" name="client-select" className="form-control" onChange={(e) => handleClientChange(e)}>
                                                <option value="" disabled selected>
                                                    Select a client
                                                </option>
                                                {clients?.clients?.map((client: { id: string; name: string }) => (
                                                    <option key={client.id} value={client.id}>
                                                        {client.name} - {client.email}
                                                    </option>
                                                ))}
                                            </select>
                                        </>
                                    )}
                                </div><br />
                                <div className="page-content-block-header">
                                    <h1>Items</h1>
                                </div>
                                <div className="form-group">
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
                                                        <input type="text" placeholder="Item name" value={item.item} onChange={(e) => updateItem(index, "item", e.target.value)} />
                                                    </td>
                                                    <td>
                                                        <input type="text" placeholder="Description" value={item.description} onChange={(e) => updateItem(index, "description", e.target.value)} />
                                                    </td>
                                                    <td>
                                                        <input type="number" placeholder="Quantity" value={item.quantity} onChange={(e) => updateItem(index, "quantity", Number(e.target.value))} />
                                                    </td>
                                                    <td>
                                                        <input type="number" placeholder="Price" value={item.price} onChange={(e) => updateItem(index, "price", Number(e.target.value))} />
                                                    </td>
                                                    <td>${(item.quantity * item.price).toFixed(2)}</td>
                                                    <td>
                                                    {invoiceItems.length > 1 && (
                                                        <button className="btn btn-sm" onClick={() => removeItem(index)}>
                                                            <FontAwesomeIcon icon={faTrash} />
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
                                </div><br />
                                <div className="page-content-block-header">
                                    <h1>Notes / Term</h1>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="notes">Notes</label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        className="form-control"
                                        rows={4}
                                        placeholder="Notes"
                                        onChange={(e) => setInvoiceNotes(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="terms">Terms</label>
                                    <textarea
                                        id="terms"
                                        name="terms"
                                        className="form-control"
                                        rows={4}
                                        placeholder="Terms"
                                        onChange={(e) => setInvoiceTerms(e.target.value)}
                                    ></textarea>
                                </div><br />
                                <div className="page-content-block-header">
                                    <h1>Pricing</h1>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="tax-rate">Tax Rate (%)</label>
                                    <input
                                        type="number"
                                        id="tax-rate"
                                        name="tax-rate"
                                        className="form-control"
                                        value={taxRate}
                                        onChange={(e) => setTaxRate(Number(e.target.value))}
                                    />
                                </div>
                                <div className="form-group">
                                    <button type="submit" className="btn btn-primary"  onClick={() => { 
                                        setIsSubmitting(true);
                                    }}>
                                        {isSubmitting ? "Creating..." : "Create Invoice"}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="page-content-block right-block invoice-preview">
                            <div className="page-content-block">

                                <div className="invoice-preview-content">
                                    <div className="invoice-logo">
                                        <img src="/static/images/invoicify-logo.png" alt="Invoicify Logo" />
                                    </div>
                                    <div className="invoice-details-section preview-section">
                                        <div className="invoice-welcome">
                                            <p className="invoice-from">Invoice from {session?.user?.name}</p>
                                            <p className="invoice-number">Invoice #: {invoiceNumber}</p>
                                        </div>
                                        <div className="invoice-dates">
                                            <p><span>Invoice Date:</span> {invoiceDate}</p>
                                            <p><span>Due Date:</span> {dueDate}</p>
                                        </div>
                                    </div>
                                    <div className="invoice-bill-section preview-section">
                                        <div className="invoice-bill-from">
                                            <h2>Bill From:</h2>
                                            <p>{session?.user?.name}</p>
                                            <p>{session?.user?.email}</p>
                                        </div>
                                        <div className="invoice-bill-to">
                                            <h2>Bill To:</h2>
                                            <p>{clients?.clients?.find((client: { id: string }) => client.id === clientId)?.name}</p>
                                            <p>{clients?.clients?.find((client: { id: string }) => client.id === clientId)?.email}</p>
                                        </div>
                                    </div>
                                    <div className="invoice-items-section preview-section">
                                        <h2 className="title">Items</h2>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Quantity</th>
                                                    <th>Price</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {invoiceItems.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.item || "N/A"}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>${item.price.toFixed(2)}</td>
                                                        <td>${(item.quantity * item.price).toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="pricing-section preview-section">
                                        <div className="left-pricing">
                                            <h2 className="title">Notes</h2>
                                            <p>{invoiceNotes || "N/A"}</p>
                                        </div>
                                        <div className="right-pricing">
                                            <h2 className="title">Pricing</h2>
                                            <p>Subtotal: <span>${subtotal.toFixed(2)}</span></p>
                                            <p>Tax ({taxRate}%): <span>${tax.toFixed(2)}</span></p>
                                            <p>Total: <span className="total">${total.toFixed(2)}</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}