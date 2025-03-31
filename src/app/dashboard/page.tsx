"use client";

import React from 'react';
import axios from 'axios';

import { useSession, signOut } from 'next-auth/react';

const DashboardPage = () => {
    const { data: session, status } = useSession();

    console.log("Session data:", session);

    if (!session?.token) {
        return (
            <div>
                <h1>Access Denied</h1>
                <p>You must be logged in to view this page.</p>
            </div>
        );
    }

    const handleLogout = async () => {
        try {
            const token = session.token;
    
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {}, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
    
            // Optionally, you can also clear the session here
            await signOut({ redirect: false });
    
            alert("Logged out successfully!");
            window.location.href = "/login"; // Redirect to login
        } catch (error) {
            console.error("Logout failed:", error.response?.data?.message);
            alert("Error logging out. Try again.");
        }
    };
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to your dashboard!</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default DashboardPage;