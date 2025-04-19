import { Metadata } from "next";
import EditClientPage from "./components/EditClientPage";

export const metadata = {
    title: "Edit Client | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "Edit an existing client",
};

export default function ClientEditPage({ params }: { params: { id: string } }) {
    const clientId = params.id;

    return <EditClientPage clientId={clientId} />;
}