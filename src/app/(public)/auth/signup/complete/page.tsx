"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

import { useEffect } from "react";
import axios from "axios";

import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/screens/Loading";

export default function ClientOnboardCompletePage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const { token } = searchParams;

    const { data: session } = useSession();

    const { data, isLoading } = useQuery({
        queryKey: ["stripe-status"],
        queryFn: async () => {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/stripe/user/onboarding/verify`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }
            );
            return response.data;
        },
        enabled: !!session,
    });

    // If the user isnt finished with onboarding redirect them to stripe
    useEffect(() => {
        if (data && data.onboarded !== true) {
            window.location.href = data.url.url;
        }
    }, [data]);


    useEffect(() => {
        if (!session) {
            //router.push("/auth/login");
        }
    }, [session]);

    // Loading state
    if (isLoading) {
        return <Loading text="Loading your onboarding..." />;
    }

    return (
        <div className="auth-page welcome-page">
            <div className="auth-page-inner">
            <div className="auth-page-left">
                <div className="auth-page-left-inner">
                <div className="auth-page-left-text">
                    <Link href="/" className="logo">
                    <Image src="/static/images/invoicify-logo.png" alt="Invoicify Logo" className="logo-image" width={50} height={50} />
                    </Link>
                    <h1 className="auth-page-left-title">Welcome to Invoicify</h1>
                    <p className="auth-page-left-subtitle">Your journey to seamless invoicing starts here</p>
                </div>
                </div>
            </div>
            <div className="auth-page-right">
                <div className="auth-page-content">
                <div className="auth-page-content-inner">
                    <div className="auth-page-content-header">
                    <h2 className="auth-page-content-title">Welcome Aboard!</h2>
                    <p className="auth-page-content-subtitle">You have successfully completed the onboarding process.</p>
                    </div>
                    <div className="auth-page-content-body">
                    <p className="welcome-message">
                        We're excited to have you on board! Start exploring your dashboard to manage your invoices effortlessly.
                    </p>
                    <div className="form-group">
                        <Link href="/dashboard" className="btn btn-secondary">
                            Go to Dashboard
                        </Link>
                    </div>
                    </div>
                    <div className="auth-page-content-footer">
                    <p className="auth-page-content-footer-text">
                        Need help?{" "}
                        <Link href="/support" className="auth-page-content-footer-link">
                        Contact Support
                        </Link>
                    </p>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
    );
}