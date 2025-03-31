"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await signIn("credentials", { email, password, redirect: false });

        if (!res?.error) router.push("/dashboard");
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" className="w-full p-2 border mb-2"
                    value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" className="w-full p-2 border mb-2"
                    value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
            </form>
        </div>
    );
}