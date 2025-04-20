import React from "react";
import { Metadata } from "next";

import ViewClientPage from "./components/ViewClientPage";

export const metadata: Metadata = {
    title: "View Client | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "View client details",
};

const ClientViewPage = async (props: {params: Promise<{ id: string }>;}) => {
    const { id: clientId } = await props.params;

    return <ViewClientPage clientId={clientId} />;
}

export default ClientViewPage;