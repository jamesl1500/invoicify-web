"use client";

import React from "react";
import axios from "axios";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import Loading from "@/components/screens/Loading";

const fetchClients = async (token: string) => {
    const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/clients`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (response.status === 200) {
        return response.data;
    } else if (response.status === 404) {
        return { data: [] }; // Return an empty array if no clients are found
    } else {
        throw new Error("Failed to fetch clients");
    }
};

export default function ViewClientsPage() {
    const { data: session, status } = useSession();

    const { data, error, isLoading } = useQuery({
        queryKey: ["clients"],
        queryFn: () => fetchClients(session?.accessToken || ""),
        enabled: status === "authenticated" && !!session?.accessToken, // Wait for session to load and ensure token is available
    });

    if (status === "loading" || isLoading) {
        return <Loading text="Loading your clients"/>;
    }
    
    return (
        <div className="page page-clients">
            <div className="page-inner">
                <div className="page-header">
                    <div className="page-header-inner">
                        <div className="page-header-title">
                            <h1>Clients</h1>
                            <p>View your clients</p>
                        </div>
                        <div className="page-header-actions">
                            <Link href="/clients/create" className="btn btn-primary">
                                Create Client
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="page-content">
                    <div className="page-content-inner">
                        {error && (
                            <div className="alert alert-danger">
                                {axios.isAxiosError(error) && error.response ? (
                                    error.response.status === 401 ? (
                                        <div>
                                            Unauthorized. Please log in again.
                                        </div>
                                    ) : error.response.status === 403 ? (
                                        <div>
                                            Forbidden. You do not have permission to view this resource.
                                        </div>
                                    ) : (
                                        <div>
                                            Error fetching clients: {error.message}
                                        </div>
                                    )
                                ) : (
                                    <div>
                                        An unexpected error occurred: {error.message}
                                    </div>
                                )}
                            </div>
                        )}

                        {data?.clients.length === 0 && (
                            <div className="alert alert-info">
                                No clients found. Please create a new client.
                            </div>
                        )}

                        {data?.clients.length > 0 && (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.clients.map((client: { id: string; name: string, email: string, phone: string }) => (
                                        <tr key={client.id}>
                                            <td>{client.name}</td>
                                            <td>{client.email}</td>
                                            <td>{client.phone}</td>
                                            <td>
                                                <Link href={`/clients/view/${client.id}`} className="btn btn-sm btn-primary">
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
