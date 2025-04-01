import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { signOut } from "next-auth/react";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
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
                            token 
                        };
                    }

                    return null;
                } catch (error) {
                    throw new Error("Invalid credentials");
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
                token.accessToken = user.token; // Store Laravel Sanctum token in session
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
            session.user = token.user;
            session.accessToken = token.accessToken; // Attach Laravel token to session
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
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: { signIn: "/login" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };