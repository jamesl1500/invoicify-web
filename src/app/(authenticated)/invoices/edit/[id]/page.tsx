import EditInvoicePage from "./components/EditInvoicePage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Edit Invoice | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "Edit an existing invoice",
};

export default function EditInvoice({ params }: { params: { id: string } }) {
    const invoiceId = params.id;

    return <EditInvoicePage invoiceId={invoiceId} />;
}