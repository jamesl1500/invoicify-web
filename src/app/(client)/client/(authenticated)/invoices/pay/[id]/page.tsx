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

    const [cards, setCards] = useState<any[]>([]);
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
                        {data ? (
                            <>
                            <div className="invoice-details">
                                <h2>Invoice #{data.invoice.invoice_number}</h2>
                                <p><strong>Date:</strong> {new Date(data.invoice.issue_date).toLocaleDateString()}</p>
                                <p><strong>Total Amount:</strong> ${data.invoice.total_amount}</p>
                                <p><strong>From:</strong> {data.user.name}</p>
                            </div>
                            <div className="invoice-payment-center">
                                <div className="invoice-payment-header">
                                    <h3>Payment Details</h3>
                                    <p>Pay your invoice using the payment methods below:</p>
                                </div>
                                <div className="invoice-payment-body">
                                    {/* Display saved paytment methods first */}
                                    <div className="invoice-payment-methods">
                                        <h4>Saved Payment Methods</h4>
                                        {cards.length > 0 ? (
                                            cards.map((card) => (
                                                <div key={card.id} className="payment-method">
                                                    <div className="payment-method-icon">
                                                        {brandIconMap[card.brand] || brandIconMap["default"]}
                                                    </div>
                                                    <div className="payment-method-details">
                                                        <div className="payment-method-name">
                                                            <p>{card.brand} ending in {card.last4}</p>
                                                            <p className="expiry">Expires {card.exp_month}/{card.exp_year}</p>
                                                        </div>
                                                        <div className="payment-method-actions">
                                                            <button className="btn btn-sm btn-primary" onClick={() => selectCard(card.id)}>Select</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No saved payment methods found.</p>
                                        )}
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        {/* New payment method */}
                                        <div className="invoice-payment-methods">
                                            <h4>New Payment Method</h4>
                                            <p>Add a new payment method to pay your invoice.</p>
                                            <div className="new-payment-method">
                                                {/* Add your form for adding a new payment method here */}
                                                
                                            </div>
                                        </div>
                                        <div className="invoice-payment-actions">
                                            <button type="submit" className="btn btn-primary">Pay Invoice</button>
                                            <Link href={`/client/invoices/view/${invoiceId}`} className="btn btn-secondary">
                                                Cancel
                                            </Link>
                                        </div>
                                    </form>
                                </div>
                                <div className="invoice-payment-footer">
                                    <p>If you have any questions, please contact us.</p>
                                </div>
                            </div>
                            </>
                        ) : (
                            <p>Unable to load invoice details.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}