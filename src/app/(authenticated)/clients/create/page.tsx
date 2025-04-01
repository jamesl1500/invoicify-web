"use client";

import React from "react";
import axios from "axios";

import { Metadata } from "next";

import { useSession } from "next-auth/react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { z } from "zod";

import { useState } from "react";

const clientSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters."),
    email: z.string().email("Invalid email."),
    phone: z.string().min(10, "Phone number must be at least 10 characters."),
    address: z.string().min(5, "Address must be at least 5 characters."),
});

type ClientFormData = z.infer<typeof clientSchema>;

export default function CreateClientPage() {
    // Get current user session
    const { data: session, status } = useSession();

    // Form settings
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<ClientFormData>({ resolver: zodResolver(clientSchema) });

    const [loading, setLoading] = useState(false);

    const submitForm = async (formData: FormData) => {
        // Handle form submission for creating a new client
        const clientName = formData.get("client-name");
        const clientEmail = formData.get("client-email");
        const clientPhone = formData.get("client-phone");
        const clientAddress = formData.get("client-address");

        // Perform validation and send data to the server
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
                name: clientName,
                email: clientEmail,
                phone: clientPhone,
                address: clientAddress,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.accessToken}`,
                },
            });

            if (response.status === 200) {
                // Handle success (e.g., redirect to the client list page)
                console.log("Client created successfully:", response.data);
            } 
        } catch (error) {
            // Handle network or server error
            console.error("Network error:", error);
        }
    };

    const submitFormAction = (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget as HTMLFormElement);
        submitForm(formData);
    };

    return (
        <div className="page page-create-client">
            <div className="page-inner">
                <div className="page-header">
                    <div className="page-header-title">
                        Create Client
                    </div>
                    <div className="page-header-subtitle">
                        Create a new client for your invoices
                    </div>
                </div>
                <div className="page-content">
                    <div className="page-content-inner">
                        <div className="page-content-inner-title">
                            Client Details
                        </div>
                        <div className="page-content-inner-subtitle">
                            Fill in the details of the client
                        </div>
                        <div className="page-content-inner-form">
                            {/* Form for creating a new client */}
                            <form onSubmit={submitFormAction}>
                                {/* Client Name */}
                                <div className="form-group">
                                    <label htmlFor="client-name">Client Name</label>
                                    <input type="text" id="client-name" className="form-control" placeholder="Enter client name" />
                                </div>

                                {/* Client Email */}
                                <div className="form-group">
                                    <label htmlFor="client-email">Client Email</label>
                                    <input type="email" id="client-email" className="form-control" placeholder="Enter client email" />
                                </div>

                                {/* Client Phone */}
                                <div className="form-group">
                                    <label htmlFor="client-phone">Client Phone</label>
                                    <input type="text" id="client-phone" className="form-control" placeholder="Enter client phone" />
                                </div>

                                {/* Client Address */}
                                <div className="form-group">
                                    <label htmlFor="client-address">Client Address</label>
                                    <input type="text" id="client-address" className="form-control" placeholder="Enter client address" />
                                </div>

                                {/* Submit Button */}
                                <div className="form-group">
                                    <button type="submit" className="btn btn-primary">
                                        Create Client
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