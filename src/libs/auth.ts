import axios from "axios";
import { signOut } from "next-auth/react";

export const logout = async (token: string) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status !== 200) {
            throw new Error("Logout failed");
        }
        
        // Optionally, you can clear the session here
        await signOut({ redirect: false });

        return true;
    } catch (error) {
        console.error("Logout error:", error);
        return false;
    }
}