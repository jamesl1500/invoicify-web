import LoginPage from "./components/LoginPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Client Login | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "Login to your account",
};

export default function ClientLoginPage() {
   
    return <LoginPage />
}