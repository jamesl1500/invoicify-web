"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import Loading from "@/components/screens/Loading";

const fetchClient = async (clientId: string, token: string) => {
    const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/clients/${clientId}`,
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
        throw new Error("Failed to fetch client");
    }
}

const clientSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters."),
    email: z.string().email("Invalid email."),
    phone: z.string().min(10, "Phone number must be at least 10 characters."),
    address: z.string().min(5, "Address must be at least 5 characters."),
});

export default function EditClientPage({ clientId }: { clientId: string }) {
    const { data: session } = useSession();
    //const clientId = id.clientId;

    const { data, error, isLoading } = useQuery({
        queryKey: ["client", clientId],
        queryFn: () => fetchClient(clientId, session?.accessToken || ""),
        enabled: !!session?.accessToken,
    }) as { data: Client | undefined; error: any; isLoading: boolean };

    const submitForm = async (formData: ClientFormData) => {
        // Handle form submission logic
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/clients/${clientId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }
            );

            if (response.status === 200) {
                toast.success("Client updated successfully!");
                // Redirect or perform additional actions
            }
        } catch (error) {
            toast.error("An error occurred while updating the client.");
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 422) {
                    const validationErrors = error.response.data.errors;
                    for (const field in validationErrors) {
                        setError(field as keyof ClientFormData, { message: validationErrors[field][0] });
                    }
                }
            }
        }
    };

      // State to manage form fields
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    // Sync state when data loads
    useEffect(() => {
        if (data) {
            setFormData({
                name: data.client.name,
                email: data.client.email,
                phone: data.client.phone,
                address: data.client.address,
            });
        }
    }, [data]);

    // Handle form input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
        defaultValues: data,
    });

    /* Delete client function */
    const deleteClient = async () => {
        try {
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/clients/${clientId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }
            );
            if (response.status === 200) {
                toast.success("Client deleted successfully!");
                // Redirect or perform additional actions
                window.location.href = "/clients";
            }
        } catch (error) {
            toast.error("An error occurred while deleting the client.");
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    toast.error("Unauthorized. Please log in again.");
                } else {
                    toast.error("An unexpected error occurred.");
                }
            }
        }
    };

    if (isLoading) {
        return <Loading text="Loading your client"/>;
    }

    if (error) {
        return <div>Error fetching client: {error.message}</div>;
    }

    return (
        <div className="page page-client-edit">
            <div className="page-inner">
                <div className="page-header">
                    <div className="page-header-inner">
                        <div className="page-header-title">
                            <h1>Edit Client</h1>
                            <p>Edit client details</p>
                        </div>
                        <div className="page-header-actions">
                            <button className="btn btn-danger" onClick={deleteClient}>
                                <span className="icon">
                                    <FontAwesomeIcon icon={faTrash} />
                                </span>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
                <div className="page-content">
                    <div className="page-content-inner">
                        <form onSubmit={handleSubmit(submitForm)}>
                            {/* Form fields go here */}
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    {...register("name")}
                                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter client name"
                                />
                                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    {...register("email")}
                                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter client email"
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone</label>
                                <input
                                    type="text"
                                    id="phone"
                                    {...register("phone")}
                                    className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter client phone"
                                />
                                {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    {...register("address")}
                                    className={`form-control ${errors.address ? "is-invalid" : ""}`}
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter client address"
                                />
                                {errors.address && <div className="invalid-feedback">{errors.address.message}</div>}
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={() => window.history.back()}>
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}