"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import axios from "axios";
import { toast } from "react-toastify";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [password_confirmation, setPasswordConfirmation] = useState("");

    const searchParams = useSearchParams();
    const router = useRouter();

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    useEffect(() => {
        if (!token || !email) {
            toast.error("Invalid token or email");
            router.push("/auth/forgot_password");
        }

        const verifyToken = async () => {
            try {
                const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/password-reset/verify`, {
                    token,
                    email,
                }, {
                    withCredentials: true,
                });

                if (res.data.error) {
                    toast.error(res.data.error);
                    router.push("/auth/forgot_password");
                }
            } catch (error) {
                toast.error("Error verifying token");
                router.push("/auth/forgot_password");
            }
        };
        verifyToken();
    }, [token, email, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/password-reset/update`, {
            email,
            token,
            password,
            password_confirmation,
        }, {
            withCredentials: true,
        });

        // Handle the response from the signup API
        if (res.data.error) {
            console.error(res.data.error);
            return;
        }

        // If the signup is successful, sign in the user
        if (res.data.message) {
            toast.success("Password reset successful");
            router.push("/auth/login");
        }else{
            toast.error("Password reset failed");
        }
    };

    return (
        <div className="auth-page signup-page">
                <div className="auth-page-inner">
                    <div className="auth-page-left">
                        {/* Thiswill be a full image with text */}
                        <div className="auth-page-left-inner">
                            <div className="auth-page-left-text">
                                <Link href="/" className="logo">
                                    <Image src="/static/images/invoicify-logo.png" alt="Invoicify Logo" className="logo-image" width={50} height={50}/>
                                </Link>
                                <h1 className="auth-page-left-title">Invoicify</h1>
                                <p className="auth-page-left-subtitle">Your all-in-one invoicing solution</p>
                            </div>
                        </div>
                    </div>
                    <div className="auth-page-right">
                        <div className="auth-page-content">
                            <div className="auth-page-content-inner">
                                <div className="auth-page-content-header">
                                    <h2 className="auth-page-content-title">Forgot Password</h2>
                                    <p className="auth-page-content-subtitle">Enter your email to recover your password</p>
                                </div>
                                <div className="auth-page-content-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="password">New Password</label>
                                            <input
                                                type="password"
                                                id="password"
                                                placeholder="New Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password_confirmation">Confirm Password</label>
                                            <input
                                                type="password"
                                                id="password_confirmation"
                                                placeholder="Confirm Password"
                                                value={password_confirmation}
                                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <button>Recover password</button>
                                        </div>
                                    </form>
                                </div>
                                <div className="auth-page-content-footer">
                                    <p className="auth-page-content-footer-text">
                                        Already have an account?{" "}
                                        <Link href="/auth/login" className="auth-page-content-footer-link">
                                            Login
                                        </Link>
                                    </p>
                                    <p className="auth-page-content-footer-text">
                                        <Link href="/auth/forgot_password" className="auth-page-content-footer-link">
                                            Forgot Password?
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