import ViewPaymentsPage from "./ViewPaymentsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Payments | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "View all payments",
};

export default function PaymentsPage() {
    
    return <ViewPaymentsPage />
}