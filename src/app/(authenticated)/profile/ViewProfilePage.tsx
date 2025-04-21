"use client";

import React from "react";

import { useSession } from "next-auth/react";

import useUser from "@/hooks/useUser";

export default function ViewProfilePage() {
    const { data: session } = useSession();

    // Fetch user data using the useUser hook
    const { user: data, loading, error } = useUser(session?.accessToken || "");

    // Handle loading and error states
    if (loading) {
        return <div className="loading">Loading your profile...</div>;
    }

    return (
        <div className="page profile-page">
            <div className="profile-page-banner">
                <div className="profile-page-banner-inner container">
                    <h1 className="profile-page-banner-title">Profile</h1>
                    <p className="profile-page-banner-subtitle">View your profile</p>
                </div>
            </div>
            <div className="profile-page-inner container">
                <div className="profile-page-inner-block">
                    <h3 className="name">{data?.name}</h3>
                    <p className="email">{data?.email}</p>
                    <p className="phone">{data?.phone_number}</p>
                </div>
                <div className="profile-page-inner-block">
                    <h1>Company info</h1>
                    <p className="company-name">{data?.company_name}</p>
                    <p className="company-address">{data?.company_address}</p>
                    <p className="company-phone">{data?.company_phone_number}</p>
                    <p className="company-email">{data?.company_email}</p>
                </div>
            </div>
        </div>
    );
}