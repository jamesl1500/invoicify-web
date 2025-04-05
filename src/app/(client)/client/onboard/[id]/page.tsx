"use client";

import React from "react";

import axios from "axios";

import Loading from "@/components/screens/Loading";

import { useQuery } from "@tanstack/react-query";

import { useState } from "react";

export default function ClientOnboardPage({ params }: { params: { id: string } }) {
    const [clientId, setClientId] = useState<string | null>(null);
    const [clientName, setClientName] = useState<string | null>(null);
    const [clientEmail, setClientEmail] = useState<string | null>(null);
    const [clientPhone, setClientPhone] = useState<string | null>(null);
    const [clientAddress, setClientAddress] = useState<string | null>(null);

    // This is the client login page component
    const onboardToken = params.id;

    // Check if the onboardToken is present
    if (!onboardToken) {
        return (
            <div className="error-page">
                <h1>Error</h1>
                <p>No onboard token provided.</p>
            </div>
        );
    }

    // Use the onboardToken to fetch client data or perform any necessary actions
    const fetchClientData = async () => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client/verifyOnboardToken/${onboardToken}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 200) {
            const clientData = response.data;
            setClientId(clientData.client.id);
            setClientName(clientData.client.name);
            setClientEmail(clientData.client.email);
            setClientPhone(clientData.client.phone);
            setClientAddress(clientData.client.address);

            return response.data;
        } else {
            throw new Error("Failed to fetch client data");
        }
    };

    // Fetch client data using React Query
    const { data, error, isLoading } = useQuery({
        queryKey: ["clientData", onboardToken],
        queryFn: fetchClientData,
    }) as { data: any; error: any; isLoading: boolean };

    // Handle loading state
    if (isLoading) {
        return <Loading text="Loading client data..." />;
    }

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const data = {
            onboard_token: onboardToken,
            id: clientId,
            name: clientName,
            email: clientEmail,
            phone: clientPhone,
            address: clientAddress,
            password: (e.target as HTMLFormElement).password.value,
            password_confirmation: (e.target as HTMLFormElement).confirmPassword.value,
        };

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/client/onboard`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 201) {
                // Handle successful onboarding
                alert("Client onboarded successfully!");
            } else {
                throw new Error("Failed to onboard client");
            }
        } catch (error) {
            console.error("Error during onboarding:", error);
            alert("An error occurred during onboarding.");
        }
    };

    return (
        <div className="login-page">
            <div className="login-page-inner">
                <h1>Client Onboarding</h1>
                <p>Please enter your new credentials to login.</p>
                <form onSubmit={submitForm} className="login-form">
                    <div className="form-group">
                        <input
                            type="hidden"
                            id="clientId"
                            value={clientId || ""}
                            onChange={(e) => setClientId(e.target.value)}
                            required
                        />
                        <input type="hidden" id="onboardToken" value={onboardToken} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="clientName">Client Name</label>
                        <input
                            type="text"
                            id="clientName"
                            value={clientName || ""}
                            onChange={(e) => setClientName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="clientEmail">Client Email</label>
                        <input
                            type="email"
                            id="clientEmail"
                            value={clientEmail || ""}
                            onChange={(e) => setClientEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="clientPhone">Client Phone</label>
                        <input
                            type="text"
                            id="clientPhone"
                            value={clientPhone || ""}
                            onChange={(e) => setClientPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="clientAddress">Client Address</label>
                        <input
                            type="text"
                            id="clientAddress"
                            value={clientAddress || ""}
                            onChange={(e) => setClientAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
            </div>
        </div>
    );
}