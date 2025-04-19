import ViewClientsPage from "./ViewClientsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Clients | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "View all clients",
};

export default function ClientsPage() {

    return <ViewClientsPage />;
}
