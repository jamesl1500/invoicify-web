"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

export default function SettingsPage() {

    const { data: session } = useSession();

    // Get logged in user data
    const getUserData = async (token: string) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error("Failed to fetch user data" + response.status);
            }
        } catch (error) {
            console.error("Error fetching client data:", error);
            throw new Error("Failed to fetch user data");
        }
    };

    // Fetch user data using React Query
    const { data, error, isLoading } = useQuery({
        queryKey: ["clientData", session?.accessToken],
        queryFn: () => getUserData(session?.accessToken || ""),
        enabled: !!session?.accessToken,
    });

    const handleBasicInformationSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget as HTMLFormElement);
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone_number: formData.get("phone_number"),
            address: formData.get("address"),
        };

        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/client/settings/updateBasicInformation`, data, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            });

            if (response.status === 200) {
                toast.success("Basic information updated successfully");
            } else {
                alert("Failed to update basic information");
            }
        } catch (error) {
            console.error("Error updating basic information:", error);
            alert("Failed to update basic information");
        }
    };

    // Update password
    const handlePasswordChange = async (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget as HTMLFormElement);
        const data = {
            current_password: formData.get("current_password"),
            new_password: formData.get("new_password"),
            new_password_confirmation: formData.get("new_password_confirmation"),
        };

        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/client/settings/updatePassword`, data, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            });

            if (response.status === 200) {
                toast.success("Password updated successfully");

                // Empty inputs
                (event.target as HTMLFormElement).reset();
            } else {
                alert("Failed to update password");
            }
        } catch (error) {
            console.error("Error updating password:", error);
            alert("Failed to update password");
        }
    };

    return (
        <div className="page page-settings">
            <div className="page-inner">
                <div className="page-header">
                    <div className="page-header-inner">
                        <div className="page-header-title">
                            <h1>Settings</h1>
                            <p>Manage your account settings</p>
                        </div>
                    </div>
                </div>
                <div className="page-content">
                    <div className="page-content-inner">
                        <div className="page-content-block">
                            <h3>Basic Information</h3>
                            <p>Update your basic information</p>
                            <form onSubmit={handleBasicInformationSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        defaultValue={data?.name}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        defaultValue={data?.email}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone_number">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone_number"
                                        name="phone_number"
                                        defaultValue={data?.phone}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address">Company Name</label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        defaultValue={data?.address}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <button type="submit" className="btn btn-primary">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div><br />
                        <div className="page-content-block">
                            <h3>Change Password</h3>
                            <p>Update your password</p>
                            <form onSubmit={handlePasswordChange}>
                                <div className="form-group">
                                    <label htmlFor="current_password">Current Password</label>
                                    <input
                                        type="password"
                                        id="current_password"
                                        name="current_password"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="new_password">New Password</label>
                                    <input
                                        type="password"
                                        id="new_password"
                                        name="new_password"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="new_password_confirmation">Confirm New Password</label>
                                    <input
                                        type="password"
                                        id="new_password_confirmation"
                                        name="new_password_confirmation"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <button type="submit" className="btn btn-primary">
                                        Change Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};