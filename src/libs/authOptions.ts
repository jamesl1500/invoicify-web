import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

import { AuthOptions, SessionStrategy } from "next-auth";

// Extend the User type to include the token property
declare module "next-auth" {
    interface User {
        token?: string;
        role?: string; // Add role property to User
    }
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
            token: string;
        };
        accessToken?: string;
        role: string;
    }
}

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            id: "user-login",
            name: "User Login",
            credentials: {
                email: { label: "Email", type: "email", required: true },
                password: { label: "Password", type: "password", required: true },
            },
            async authorize(credentials) {
                try {
                    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, credentials, {
                        withCredentials: true,
                    });

                    const { user, token } = res.data;

                    if (user && token) {
                        return { 
                            id: user.id, 
                            name: user.name, 
                            email: user.email, 
                            role: "user",
                            token 
                        };
                    }

                    return null;
                } catch (error) {
                    throw new Error("Invalid credentials");
                }
            },
        }),
        CredentialsProvider({
            id: "client-login",
            name: "Client",
            credentials: {
                email: { label: "Email", type: "email", required: true },
                password: { label: "Password", type: "password", required: true },
            },
            async authorize(credentials) {
                try {
                    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client/login`, credentials, {
                        withCredentials: true,
                    });

                    console.log(res.data);

                    const { client, token } = res.data;

                    if (client && token) {
                        return { 
                            id: client.id, 
                            name: client.name, 
                            email: client.email, 
                            role: "client",
                            token 
                        };
                    }

                    return null;
                } catch (error) {
                    throw new Error("Invalid credentials");
                }
            }
        }),
    ],      
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
                token.accessToken = user.token; // Store Laravel Sanctum token in session
                token.role = user.role; // Store user role
            }

            // Validate the token
            try{
                await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/validate-token`, {
                    headers: {
                        Authorization: `Bearer ${token.accessToken}`,
                    },
                });
            }catch (error) {
                token.accessToken = null; // Invalidate the token if an error occurs
                token.user = null; // Invalidate the user
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token.user as { id: string; name: string; email: string; role: string; token: string };
            session.accessToken = token.accessToken as string; // Attach Laravel token to session
            session.role = (token.user as { role: string }).role; // Attach user role to session
            return session;
        }
    },
    events: {
        async signOut({ token }) {
            try {
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {}, {
                    headers: {
                        Authorization: `Bearer ${token.accessToken}`,
                    },
                });
            } catch (error) {
                console.error("Error during sign out:", error);
            }
        }
    },
    session: {
        strategy: "jwt" as SessionStrategy,
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: { signIn: "/auth/login" },
};