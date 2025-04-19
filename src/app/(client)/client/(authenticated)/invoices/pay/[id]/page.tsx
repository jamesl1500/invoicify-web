import PayInvoicePage from "./components/PayInvoicePage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pay Invoice | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "Pay an invoice",
};

export default function PayInvoice({ params }: { params: { id: string } }) {
    const invoiceId = params.id;

    return <PayInvoicePage invoiceId={invoiceId} />;
}