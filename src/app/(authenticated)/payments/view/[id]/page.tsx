import ViewPaymentPage from "./components/ViewPaymentPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "View Payment | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "View payment details",
};

export default function PaymentViewPage({params,}: {params: { id: string };}) {

    // Get the payment ID from the URL
    const paymentId = params.id;

    return <ViewPaymentPage paymentId={paymentId} />;
}