"use client";
import { signIn } from "next-auth/react";

import React from 'react';
import { useState } from 'react';

export default function ClientLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const res = await signIn("client-login", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            console.error("Login failed:", res.error);
            alert("Login failed. Please check your credentials.");
        } else {
            // Redirect to the dashboard or another page
            window.location.href = "/client/dashboard";
        }
    };
    return (
        <div className="client-login-page">
            <div className="client-login-page-inner">
                <h1>Login</h1>
                <p>Please enter your credentials to log in.</p>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" required onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
            </div>
        </div>
    );
}