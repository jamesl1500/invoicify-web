"use client";

import React from 'react';
import axios from 'axios';

import { useSession, signOut } from 'next-auth/react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import Loading from "@/components/screens/Loading";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Fetch dashboard data function
const fetchDashboardData = async (token: string) => {
    console.log("Fetching dashboard data...");

    const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.accessToken || ""}`,
            },
        }
    );
    console.log( "Dashboard data response:", response.data );
    return response.data;
};

const DashboardPage = () => {
    const { data: session, status } = useSession();

    // Use React Query to fetch and manage dashboard data
    const { data, error, isLoading } = useQuery({
        queryKey: ["dashboard"],
        queryFn: () => fetchDashboardData(session?.accessToken || ""),
        enabled: status === "authenticated" && !!session?.accessToken, // Wait for session to load and ensure token is available
    }) as { data: any, error: any, isLoading: boolean };

    console.log( "Dashboard data:", data);

    if (status === "loading" || !session ) {
        return <Loading text="Loading your dashboard..." />;
    }

    return (
        <div className="page page-dashboard">
            <div className="page-inner">
                <div className="page-header">

                </div>
                <div className="page-content">

                </div>
            </div>
        </div>
    );
};

export default DashboardPage;