"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import axios from "axios";
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {

    const [email, setEmail] = useState("");

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/password-reset`, {
            email,
        }, {
            withCredentials: true,
        });

        // Handle the response from the signup API
        if (res.data.error) {
            console.error(res.data.error);
            return;
        }

        // If the signup is successful, sign in the user
        if (res.data) {
            toast.success("Password reset link sent to your email");
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
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
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