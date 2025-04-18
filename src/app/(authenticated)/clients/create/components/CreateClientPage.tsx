"use client";

import React from "react";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { z } from "zod";

const clientSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters."),
    email: z.string().email("Invalid email."),
    phone: z.string().min(10, "Phone number must be at least 10 characters."),
    address: z.string().min(5, "Address must be at least 5 characters."),
});

type ClientFormData = z.infer<typeof clientSchema>;

export default function CreateClientPage() {
    const { data: session } = useSession();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<ClientFormData>({ resolver: zodResolver(clientSchema) });

    const [submitting, setSubmitting] = useState(false);

    const submitForm = async (formData: ClientFormData) => {
        setSubmitting(true);

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/clients`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }
            );

            if (response.status === 201) {
                toast.success("Client created successfully!");
                setSubmitting(false);

                // Example: Redirect to the clients list page
                window.location.href = "/clients";
            }
        } catch (error) {
            toast.error("An error occurred while creating the client.");
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 422) {
                    const validationErrors = error.response.data.errors;
                    for (const field in validationErrors) {
                        setError(field as keyof ClientFormData, {
                            type: "manual",
                            message: validationErrors[field][0],
                        });
                    }
                } else if (error.response?.status === 401) {
                    toast.error("Unauthorized. Please log in again.");
                } else {
                    toast.error("An unexpected error occurred.");
                }
            }
        }
    };

    return (
        <div className="page page-create-client">
            <div className="page-inner">
                <div className="page-header">
                    <div className="page-header-inner">
                        <div className="page-header-title">
                            <h1>Create Client</h1>
                            <p>Create a new client for your invoices</p>
                        </div>
                    </div>
                </div>
                <div className="page-content">
                    <div className="page-content-inner">
                        <form onSubmit={handleSubmit(submitForm)}>
                            {/* Client Name */}
                            <div className="form-group">
                                <label htmlFor="client-name">Client Name</label>
                                <input
                                    type="text"
                                    {...register("name")}
                                    id="client-name"
                                    className="form-control"
                                    placeholder="Enter client name"
                                />
                                {errors.name && <span className="text-danger">{errors.name.message}</span>}
                            </div>

                            {/* Client Email */}
                            <div className="form-group">
                                <label htmlFor="client-email">Client Email</label>
                                <p>We will send a email to your client with a link to onboard to your portal.</p>
                                <input
                                    type="email"
                                    {...register("email")}
                                    id="client-email"
                                    className="form-control"
                                    placeholder="Enter client email"
                                />
                                {errors.email && <span className="text-danger">{errors.email.message}</span>}
                            </div>

                            {/* Client Phone */}
                            <div className="form-group">
                                <label htmlFor="client-phone">Client Phone</label>
                                <input
                                    type="text"
                                    {...register("phone")}
                                    id="client-phone"
                                    className="form-control"
                                    placeholder="Enter client phone"
                                />
                                {errors.phone && <span className="text-danger">{errors.phone.message}</span>}
                            </div>

                            {/* Client Address */}
                            <div className="form-group">
                                <label htmlFor="client-address">Client Address</label>
                                <input
                                    type="text"
                                    {...register("address")}
                                    id="client-address"
                                    className="form-control"
                                    placeholder="Enter client address"
                                />
                                {errors.address && <span className="text-danger">{errors.address.message}</span>}
                            </div>
                            {/* Submit Button */}
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? "Creating..." : "Create Client"}
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
    );
}
