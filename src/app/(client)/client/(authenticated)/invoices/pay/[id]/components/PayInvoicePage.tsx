"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import Link from "next/link";

import Loading from "@/components/screens/Loading";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCcVisa, faCcMastercard, faCcAmex, faCcDiscover } from "@fortawesome/free-brands-svg-icons";
import { toast } from "react-toastify";

const brandIconMap = {
    "visa" : <FontAwesomeIcon icon={faCcVisa} />,
    "mastercard" : <FontAwesomeIcon icon={faCcMastercard} />,
    "amex" : <FontAwesomeIcon icon={faCcAmex} />,
    "discover" : <FontAwesomeIcon icon={faCcDiscover} />,
    "default" : <FontAwesomeIcon icon={faCcVisa} />,
}

interface PaymentMethod {
    id: string;
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
}

interface Props {
    methods: PaymentMethod[];
    onSelete: (methodId: string) => void;
}

export default function PayInvoicePage({ invoiceId }: { invoiceId: string }) {
    const { data: session } = useSession();

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

    const [cards, setCards] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.accessToken) {
            return;
        }

        axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/stripe/saved-cards`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            }
        ).then((response) => {
            if (response.status === 200) {
                setCards(response.data);
            } else {
                console.error("Failed to fetch payment methods");
            }
            setLoading(false);
        });
    }, [session?.accessToken]);

    const [selectedCard, setSelectedCard] = useState<string | null>(null);

    const selectCard = (cardId: string) => {
        setSelectedCard(cardId);
        console.log("Selected card ID:", cardId);
        toast.success("Payment method selected successfully");
        return false;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedCard) {
            toast.error("Please select a payment method.");
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/client/invoices/${invoiceId}/pay`,
                { payment_method: selectedCard },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }
            );

            if (response.status === 200) {
                toast.success("Invoice paid successfully!");
                // Redirect or perform additional actions
            }
        } catch (error) {
            toast.error("An error occurred while paying the invoice.");
            console.error("Error paying invoice:", error);
        }
    };

    // Fetch the invoice data using the invoiceId
    const { data, error, isLoading } = useQuery({
        queryKey: ["invoice", invoiceId],
        queryFn: () => fetchInvoice(invoiceId, session?.accessToken || ""),
        enabled: !!session?.accessToken,
    });

    // This is the view invoice page
    if( isLoading || !session) {
        return <Loading text="Loading your invoice..." />;
    }

    return (
        <div className="page page-pay-invoice">
            <div className="page-inner">
                <div className="page-header">
                    <div className="page-header-inner">
                        <div className="page-header-title">
                            <h1>Pay Invoice</h1>
                            <p>Pay your invoice</p>
                        </div>
                        <div className="page-header-actions">
                            <Link href={`/client/invoices/view/${invoiceId}`} className="btn btn-secondary">
                                Back to Invoice
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="page-content">
                    <div className="page-content-inner">
                        <div className="pay-invoice-left">
                            <div className="pay-invoice-left-inner">
                                {data && (
                                    <div className="invoice-details">
                                        <h2>Invoice Details</h2>
                                        <p><strong>Invoice Number:</strong> {data.invoice.invoice_number}</p>
                                        <p><strong>Due Date:</strong> {data.invoice.due_date}</p>
                                        <p><strong>Total Amount:</strong> ${data.invoice.total_amount}</p>
                                        <p><strong>Status:</strong> {data.invoice.status}</p>
                                        <p><strong>Created At:</strong> {new Date(data.invoice.created_at).toLocaleDateString()}</p>
                                        <p><strong>Last Updated At:</strong> {new Date(data.invoice.updated_at).toLocaleDateString()}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="pay-invoice-right">
                            <div className="pay-invoice-right-inner">
                                <div className="checkout-summary">
                                    <h2>Checkout Summary</h2>
                                    <p><strong>Subtotal</strong>: ${data?.invoice.sub_total}</p>
                                    <p><strong>Tax</strong>: ${data?.invoice.tax_amount}</p>
                                    <p><strong>Total</strong>: ${data?.invoice.total_amount}</p>
                                </div>
                                <div className="payment-methods">
                                    <h2>Select Payment Method</h2>
                                    {loading ? (
                                        <Loading text="Loading your payment methods..." />
                                    ) : (
                                        <form onSubmit={handleSubmit}>
                                            {cards.map((card) => (
                                                <div key={card.id} className="payment-method">
                                                    <div className="payment-method-icon">
                                                        {brandIconMap[card.brand as keyof typeof brandIconMap] || brandIconMap["default"]}
                                                    </div>
                                                    <div className="payment-method-details">
                                                        <div className="payment-method-name">
                                                            <p>{card.brand} ending in {card.last4}</p>
                                                            <p className="expiry">Expires {card.exp_month}/{card.exp_year}</p>
                                                        </div>
                                                        <div className="payment-method-actions">
                                                            <button
                                                                type="button"
                                                                className={`btn btn-sm ${selectedCard === card.id ? "btn-secondary" : "btn-primary"}`}
                                                                onClick={() => selectCard(card.id)}
                                                            >
                                                                {selectedCard === card.id ? "Selected" : "Select"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button type="submit" className="btn submit-btn btn-primary">Pay Invoice</button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}