import { Metadata } from "next";
import EditClientPage from "./components/EditClientPage";

export const metadata = {
    title: "Edit Client | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "Edit an existing client",
};

const ClientEditPage = async (props: {params: Promise<{ id: string }>;}) => {
    const clientId = await props.params.id;

    return <EditClientPage clientId={clientId} />;
}

export default ClientEditPage;