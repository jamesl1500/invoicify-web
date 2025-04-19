import { Metadata } from "next";

import ViewInvoicesPage from "./ViewInvoicesPage";

export const metadata: Metadata = {
    title: "Invoices | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "View all invoices",
};

export default function InvoicesPage(){

    return <ViewInvoicesPage />
}