import EditInvoicePage from "./components/EditInvoicePage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Edit Invoice | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "Edit an existing invoice",
};

const EditInvoice = async (props: {params: Promise<{ id: string }>;}) => {
    const invoiceId = await props.params.id;

    return <EditInvoicePage invoiceId={invoiceId} />;
}

export default EditInvoice;