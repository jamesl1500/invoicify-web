import { Metadata } from "next";
import EditClientPage from "./components/EditClientPage";

interface ClientEditPageProps {
    params: {
        id: string;
    };
}

export const metadata = {
    title: "Edit Client | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "Edit an existing client",
};

const ClientEditPage = async ({ params }: ClientEditPageProps) => {
    const clientId = params.id;

    return <EditClientPage clientId={clientId} />;
}

export default ClientEditPage;