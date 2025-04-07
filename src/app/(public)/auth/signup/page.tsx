"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import Link from "next/link";
import Image from "next/image";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password_confirmation, setPasswordConfirmation] = useState("");

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
            name,
            email,
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
        if (res.data.user) {
            const login = await signIn("user-login", {
                email,
                password,
                redirect: false,
            });

            if (login?.error) {
                console.error(login.error);
                return;
            }
            // Redirect to the dashboard after successful login
            router.push("/dashboard");


        }else{
            console.error("Signup failed");
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
                                    <h2 className="auth-page-content-title">Create an Account</h2>
                                    <p className="auth-page-content-subtitle">Join us and start managing your invoices today!</p>
                                </div>
                                <div className="auth-page-content-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="name" className="form-label">Name</label>
                                            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                        </div>
                                        <div className="form-group-inline">
                                            <div className="form-group">
                                                <label htmlFor="password" className="form-label">Password</label>
                                                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="password_confirmation" className="form-label">Confirm Password</label>
                                                <input type="password" placeholder="Confirm Password" value={password_confirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <button>Signup</button>
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