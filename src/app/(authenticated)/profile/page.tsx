"use client";

import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
    const { data: session } = useSession();

    // Get logged in user data
    const getUserData = async (token: string) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                return response.data;
            }else{
                throw new Error("Failed to fetch user data" + response.status);            
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            throw new Error("Failed to fetch user data");
        }
    }   

    // Fetch user data using React Query
    const { data, error, isLoading } = useQuery({
        queryKey: ["userData", session?.accessToken],
        queryFn: () => getUserData(session?.accessToken),
        enabled: !!session?.accessToken,
    });

    // Handle loading and error states
    if (isLoading) {
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