"use client";

import Link from "next/link";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";

import Loading from "@/components/screens/Loading";

import React from "react";
import { useEffect, useState } from "react";

import { loadStripe } from "@stripe/stripe-js";

import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
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

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || "");

function SaveCardForm(){
    const { data: session } = useSession();
    const elements = useElements();
    const stripe = useStripe();

    const [clientSecret, setClientSecret] = useState("");
    const [customerId, setCustomerId] = useState("");

    useEffect(() => {
        axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/stripe/setup-intent`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            }
        ).then((response) => {
            if (response.status === 200) {
                setClientSecret(response.data.client_secret);
                setCustomerId(response.data.customer_id);
            } else {
                console.error("Failed to fetch client secret");
            }
        });
    }, [session?.accessToken]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            
        });

        if (error) {
            console.error(error);
        } else {
            console.log(paymentMethod);
            // Handle successful payment method creation
            // Send the payment method ID to your server to save it
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/stripe/payment-method`,
                {
                    payment_method_id: paymentMethod.id,
                    customer_id: customerId,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }
            );

            if (response.status === 200) {
                console.log("Card saved successfully");

                toast.success("Card saved successfully");
            } else {
                console.error("Failed to save card");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <CardElement />
            </div>
            <div className="form-group">
                <button className="btn btn-sm" type="submit" disabled={!stripe}>Save Card</button>
            </div>
        </form>
    );
}

export default function PaymentMethodsPage() {
    const { data: session } = useSession();

    const [cards, setCards] = useState<any[]>([]);
    const [selectedCard, setSelectedCard] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCard(event.target.value);                            
    }                   

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

    const deleteCard = async (cardId: string) => {
        try {
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/stripe/payment-method/${cardId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }
            );

            if (response.status === 200) {
                setCards(cards.filter(card => card.id !== cardId));

                toast.success("Card deleted successfully");
            } else {
                console.error("Failed to delete card");
            }
        } catch (error) {
            console.error("Error deleting card:", error);
        }
    };

    return (
        <Elements stripe={stripePromise}>
            <div className="page page-payment-methods">
                <div className="page-inner">
                    <div className="page-header">
                        <div className="page-header-inner">
                            <div className="page-header-title">
                                <h1>Payment Methods</h1>
                                <p>Manage your payment methods</p>
                            </div>
                        </div>
                    </div>
                    <div className="page-content">
                        <div className="page-content-inner">
                            <div className="page-content-inner-block">
                                <h2>Payment Methods</h2>
                                <p>Manage your payment methods</p>
                                {loading ? (
                                    <Loading text="Loading your payment methods..." />
                                ) : (
                                    <div className="payment-methods">
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
                                                            <button className="btn btn-sm btn-danger" onClick={() => deleteCard(card.id)}>Delete</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No saved payment methods found.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="page-content-inner-block new-payment-method">
                                <div className="new-payment-methods">
                                    <h3>Save a new card</h3>
                                    <p>Save a new card to your account for future payments.</p>
                                    <SaveCardForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Elements>
    );
}