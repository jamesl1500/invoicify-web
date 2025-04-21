"use client";

import React from 'react';
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function ClientConversationsPage()
{
    const { data: session } = useSession();

    const getClientConversations = async (token: string) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/conversations`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                return response.data.conversations;
            } else {
                throw new Error("Failed to fetch client conversations" + response.status);
            }
        } catch (error) {
            console.error("Error fetching client conversations:", error);
            throw new Error("Failed to fetch client conversations");
        }
    };

    // Fetch client conversations using React Query
    const { data: conversations, error, isLoading } = useQuery({
        queryKey: ["clientConversations", session?.accessToken],
        queryFn: () => getClientConversations(session?.accessToken || ""),
        enabled: !!session?.accessToken,
    });

    return (
        <div className="page client-conversations-page">
            <div className="page-inner">
                <div className="page-header">
                    <div className="page-header-inner">
                        <div className="page-header-title">
                            <h1>Conversations</h1>
                            <p>View your conversations</p>
                        </div>
                    </div>
                </div>
                <div className="page-content">
                    <div className="page-content-left">
                        Conversations
                    </div>
                    <div className="page-content-right">
                        Conversation right
                    </div>
                </div>
            </div>
        </div>
    );
}