import ViewPaymentPage from "./components/ViewPaymentPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "View Payment | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "View payment details",
};

const PaymentViewPage = async (props: {params: Promise<{ id: string }>;}) => {
    // Get the payment ID from the URL
    const { id: paymentId } = await props.params;

    return <ViewPaymentPage paymentId={paymentId} />;
}

export default PaymentViewPage;