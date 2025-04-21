import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
            accessToken: string;
        };
    }

    interface User {
        accessToken?: string;
    }
}