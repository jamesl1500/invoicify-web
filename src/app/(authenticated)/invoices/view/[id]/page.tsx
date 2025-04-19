import ViewInvoicePage from "./components/ViewInvoicePage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "View Invoice | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "View invoice details",
};

const ViewInvoice = async (props: {params: Promise<{ id: string }>;}) => {
    const invoiceId = await props.params.id;

    return <ViewInvoicePage invoiceId={invoiceId} />;
}

export default ViewInvoice;