import ViewInvoicesPage from "./ViewInvoicesPage"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Invoices | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "View all invoices",
}

export default function ClientInvoices() {

    return <ViewInvoicesPage />
}