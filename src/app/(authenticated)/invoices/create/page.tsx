import CreateInvoicePage from "./components/CreateInvoicePage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create Invoice | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "Create a new invoice",
};

export default function CreateInvoice() {

    return <CreateInvoicePage />;
}