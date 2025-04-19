import PayInvoicePage from "./components/PayInvoicePage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pay Invoice | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "Pay an invoice",
};

const PayInvoice = async (props: {params: Promise<{ id: string }>;}) => {
    const invoiceId = props.params.id;

    return <PayInvoicePage invoiceId={invoiceId} />;
}

export default PayInvoice;