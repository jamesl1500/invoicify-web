"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "react-toastify";

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
        return { data: [] };
    } else {
        throw new Error("Failed to fetch clients");
    }
};

export default function EditInvoicePage({ params }: { params: { id: string } }) {
    const { data: session } = useSession();
    const [invoiceData, setInvoiceData] = useState<any>(null);
    const [invoiceItems, setInvoiceItems] = useState([
        { item: "", description: "", quantity: 1, unit_price: 0 },
    ]);
    const [taxRate, setTaxRate] = useState(5);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/invoices/${params.id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session?.accessToken}`,
                        },
                    }
                );

                if (response.status === 200) {
                    const data = response.data;
                    setInvoiceData(data.invoice);
                    setInvoiceItems(data.items || []);
                    setTaxRate(data.taxRate || 5);
                } else {
                    throw new Error("Failed to fetch invoice");
                }
            } catch (error) {
                toast.error("Error fetching invoice data");
                console.error("Error fetching invoice:", error);
            }
        };

        if (session) {
            fetchInvoice();
        }
    }, [params.id, session]);

    const { data: clients } = useQuery({
        queryKey: ["clients"],
        queryFn: () => fetchClients(session?.accessToken || ""),
        enabled: !!session?.accessToken,
    }) as { data: { id: string; name: string }[] | undefined };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const clientId = formData.get("client-select");
        const invoiceNumber = formData.get("invoice-number");
        const invoiceDate = formData.get("invoice-date");
        const dueDate = formData.get("due-date");
        const notes = formData.get("notes");
        const terms = formData.get("terms");

        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/invoices/${params.id}`,
                {
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
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }
            );

            if (response.status === 200) {
                toast.success("Invoice updated successfully!");
                window.location.href = `/invoices/view/${params.id}`;
            } else {
                toast.error("An error occurred while updating the invoice.");
            }
        } catch (error) {
            toast.error("An error occurred while updating the invoice.");
            console.error("Error updating invoice:", error);
        }
    };

    const addItem = () => {
        setInvoiceItems([
            ...invoiceItems,
            { item: "", description: "", quantity: 1, unit_price: 0 },
        ]);
    };

    const removeItem = (index: number) => {
        setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: string, value: string | number) => {
        const updatedItems = [...invoiceItems];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setInvoiceItems(updatedItems);
    };

    const subtotal = invoiceItems.reduce((acc, item) => acc + item.quantity * item.unit_price, 0);
    const tax = (subtotal * taxRate) / 100;
    const total = subtotal + tax;

    if (!invoiceData) {
        return <p>Loading...</p>;
    }

    return (
        <div className="page page-edit-invoice">
            <div className="page-inner">
                <div className="page-header">
                    <div className="page-header-inner">
                        <div className="page-header-title">
                            <h1>Edit Invoice</h1>
                            <p>Edit the details of your invoice</p>
                        </div>
                    </div>
                </div>
                <div className="page-content">
                    <div className="page-content-inner">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="client-select">Select Client</label>
                                <select
                                    id="client-select"
                                    name="client-select"
                                    className="form-control"
                                    defaultValue={invoiceData.clientId}
                                >
                                    {clients?.clients.map((client) => (
                                        <option key={client.id} value={client.id}>
                                            {client.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="invoice-number">Invoice Number</label>
                                <input
                                    type="text"
                                    name="invoice-number"
                                    id="invoice-number"
                                    className="form-control"
                                    defaultValue={invoiceData.invoice_number}
                                />
                            </div>

                            <div className="form-group-inline">
                                <div className="form-group">
                                    <label htmlFor="invoice-date">Invoice Date</label>
                                    <input
                                        type="date"
                                        name="invoice-date"
                                        id="invoice-date"
                                        className="form-control"
                                        defaultValue={invoiceData.issue_date}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="due-date">Due Date</label>
                                    <input
                                        type="date"
                                        name="due-date"
                                        id="due-date"
                                        className="form-control"
                                        defaultValue={invoiceData.due_date}
                                    />
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
                                        {invoiceItems.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Item name"
                                                        value={item.item}
                                                        onChange={(e) =>
                                                            updateItem(index, "item", e.target.value)
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Description"
                                                        value={item.description}
                                                        onChange={(e) =>
                                                            updateItem(index, "description", e.target.value)
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Quantity"
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            updateItem(index, "quantity", Number(e.target.value))
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Price"
                                                        value={item.unit_price}
                                                        onChange={(e) =>
                                                            updateItem(index, "unit_price", Number(e.target.value))
                                                        }
                                                    />
                                                </td>
                                                <td>${(item.quantity * item.unit_price).toFixed(2)}</td>
                                                <td>
                                                    {invoiceItems.length > 1 && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm"
                                                            onClick={() => removeItem(index)}
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={addItem}
                                >
                                    Add Item
                                </button>
                            </div>

                            <div className="form-group-inline">
                                <div className="form-group">
                                    <label htmlFor="notes">Notes</label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        className="form-control"
                                        defaultValue={invoiceData.notes}
                                        rows={4}
                                    ></textarea>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="terms">Terms</label>
                                    <textarea
                                        id="terms"
                                        name="terms"
                                        className="form-control"
                                        defaultValue={invoiceData.terms}
                                        rows={4}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="tax-rate">Tax Rate (%)</label>
                                <input
                                    type="number"
                                    name="tax-rate"
                                    id="tax-rate"
                                    className="form-control"
                                    value={taxRate}
                                    onChange={(e) => setTaxRate(Number(e.target.value))}
                                />
                            </div>

                            <div className="form-group-inline">
                                <div className="form-group">
                                    <label htmlFor="subtotal">Subtotal</label>
                                    <input
                                        type="text"
                                        id="subtotal"
                                        className="form-control"
                                        value={`$${subtotal.toFixed(2)}`}
                                        readOnly
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="tax">Tax</label>
                                    <input
                                        type="text"
                                        id="tax"
                                        className="form-control"
                                        value={`$${tax.toFixed(2)}`}
                                        readOnly
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="total">Total</label>
                                    <input
                                        type="text"
                                        id="total"
                                        className="form-control"
                                        value={`$${total.toFixed(2)}`}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <button type="submit" className="btn btn-primary">
                                    Update Invoice
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}