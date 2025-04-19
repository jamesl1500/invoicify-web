import ViewPaymentMethodsPage from "./ViewPaymentMethodsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Payment Methods | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "View all payment methods",
};

export default function PaymentMethodsPage() {
    
    return <ViewPaymentMethodsPage />