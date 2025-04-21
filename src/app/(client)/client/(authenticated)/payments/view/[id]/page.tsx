import ViewPaymentPage from "./components/ViewPaymentPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "View Payment | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "View a payment",
};

const PaymentViewPage = async (props: {params: Promise<{ id: string }>;}) => {
    const { id } = await props.params;

    return <ViewPaymentPage paymentId={id} />;
}

export default PaymentViewPage;