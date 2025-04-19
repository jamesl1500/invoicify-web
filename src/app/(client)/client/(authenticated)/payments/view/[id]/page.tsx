import ViewPaymentPage from "./components/ViewPaymentPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "View Payment | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "View a payment",
};

export default function PaymentViewPage({ params }: { params: { id: string } }) {
    const { id } = params;
    console.log("Payment ID:", id);

    return <ViewPaymentPage paymentId={id} />;
}