"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import axios from "axios";

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

export default function ClientEditPage({ params }: { params: { id: string } }) {
    const { data: session } = useSession();
    const clientId = params.id;

    const { data, error, isLoading } = useQuery({
        queryKey: ["client", clientId],
        queryFn: () => fetchClient(clientId, session?.accessToken || ""),
        enabled: !!session?.accessToken,
    }) as { data: Client | undefined; error: any; isLoading: boolean };

    const submitForm = async (formData: ClientFormData) => {
        // Handle form submission logic
        console.log("Form submitted with data:", formData);
    };

    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
        defaultValues: data,
    });

    if (isLoading) {
        return <div>Loading client...</div>;
    }

    if (error) {
        return <div>Error fetching client: {error.message}</div>;
    }

    return (
        <div className="page page-client-edit">
            <div className="page-inner">
                <div className="page-header">
                    <div className="page-header-title">
                        <h1>Edit Client</h1>
                        <p>Edit client details</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit(submitForm)}>
                    {/* Form fields go here */}
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            {...register("name")}
                            className={`form-control ${errors.name ? "is-invalid" : ""}`}
                            value={data?.client.name}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                    </div>
                </form>
            </div>
        </div>
    );
}