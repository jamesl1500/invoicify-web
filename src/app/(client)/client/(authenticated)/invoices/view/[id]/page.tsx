import ViewInvoicePage from "./components/ViewInvoicePage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "View Invoice | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "View an invoice",
};

export default function ViewInvoice({ params }: { params: { id: string } }) {

    const invoiceId = params.id;

    return <ViewInvoicePage invoiceId={invoiceId} />;
}