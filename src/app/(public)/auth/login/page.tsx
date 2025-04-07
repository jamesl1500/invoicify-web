"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await signIn("user-login", { email, password, redirect: false });

        if (!res?.error) router.push("/dashboard");
    };

    return (
        <div className="auth-page login-page">
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
                                <h2 className="auth-page-content-title">Welcome Back</h2>
                                <p className="auth-page-content-subtitle">Please enter your credentials to log in.</p>
                            </div>
                            <div className="auth-page-content-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <button>Login</button>
                                    </div>
                                </form>
                            </div>
                            <div className="auth-page-content-footer">
                                <p className="auth-page-content-footer-text">
                                    Don't have an account?{" "}
                                    <Link href="/auth/signup" className="auth-page-content-footer-link">
                                        Sign Up
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