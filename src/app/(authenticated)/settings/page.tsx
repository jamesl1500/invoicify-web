"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "@/components/screens/Loading";
import { useEffect } from "react";

import { toast } from "react-toastify";

export default function SettingsPage() {
    // Get the session
    const { data: session } = useSession();

    // Fetch the user settings
    const fetchSettings = async (token: string) => {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/settings/basicInformation`,
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
            throw new Error("Failed to fetch settings");
        }
    };

    const fetchBusinessSettings = async (token: string) => {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/settings/companyInformation`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (response.status === 200) {
            return response.data;
        }
        throw new Error("Failed to fetch settings");
    };

    // Use react-query to fetch the settings
    const { data, error, isLoading } = useQuery({
        queryKey: ["settings"],
        queryFn: () => fetchSettings(session?.accessToken || ""),
        enabled: !!session?.accessToken,
    }) as { data: any; error: any; isLoading: boolean };

    const { data: businessData, error: businessError, isLoading: businessIsLoading } = useQuery({
        queryKey: ["businessSettings"],
        queryFn: () => fetchBusinessSettings(session?.accessToken || ""),
        enabled: !!session?.accessToken,
    }) as { data: any; error: any; isLoading: boolean };

    // Handle basic information 
    const handleBasicInformationSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/settings/basicInformation`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }
            );
            if (response.status === 200) {
                toast.success("Settings updated successfully");
            } else {
                toast.error("Failed to update settings");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while updating settings");
        }
    };

    // Handle password change
    const handleChangePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/settings/changePassword`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }
            );
            if (response.status === 200) {
                toast.success("Password changed successfully");

                ;
            } else {
                toast.error("Failed to change password");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while changing password");
        }
    };

    const hadleBusinessInformationSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/settings/companyInformation`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }
            );
            if (response.status === 200) {
                toast.success("Business information updated successfully");
            } else {
                toast.error("Failed to update business information");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while updating business information");
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
                                        defaultValue={data?.phone_number}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <button type="submit" className="btn btn-primary">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="page-content-block">
                            <h3>Change Password</h3>
                            <p>Update your password</p>
                            <form onSubmit={handleChangePasswordSubmit}>
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
                                    <label htmlFor="confirm_password">Confirm Password</label>
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
                        <div className="page-content-block">
                            <h3>Business Information</h3>
                            <p>Update your business information</p>
                            <form onSubmit={hadleBusinessInformationSubmit}>
                                <div className="form-group">
                                    <label htmlFor="company_name">Company Name</label>
                                    <input
                                        type="text"
                                        id="company_name"
                                        name="company_name"
                                        defaultValue={businessData?.company_name}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="company_address">Company Address</label>
                                    <input
                                        type="text"
                                        id="company_address"
                                        name="company_address"
                                        defaultValue={businessData?.company_address}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="company_email">Company Email</label>
                                    <input
                                        type="email"
                                        id="company_email"
                                        name="company_email"
                                        defaultValue={businessData?.company_email}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="company_phone_number">Company Phone Number</label>
                                    <input
                                        type="tel"
                                        id="company_phone_number"
                                        name="company_phone_number"
                                        defaultValue={businessData?.company_phone_number}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <button type="submit" className="btn btn-primary">Save Business Information</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}