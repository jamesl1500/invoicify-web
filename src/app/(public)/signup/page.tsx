"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

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
        <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Name" className="w-full p-2 border mb-2"
                    value={name} onChange={(e) => setName(e.target.value)} required />
                
                <input type="email" placeholder="Email" className="w-full p-2 border mb-2"
                    value={email} onChange={(e) => setEmail(e.target.value)} required />
                
                <input type="password" placeholder="Password" className="w-full p-2 border mb-2"
                    value={password} onChange={(e) => setPassword(e.target.value)} required />

                <input type="password" placeholder="Confirm Password" className="w-full p-2 border mb-2"
                    value={password_confirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required />
                <button className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
            </form>
        </div>
    );
}