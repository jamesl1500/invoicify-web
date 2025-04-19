import React from "react";
import { Metadata } from "next";

import ViewClientPage from "./components/ViewClientPage";

export const metadata: Metadata = {
    title: "View Client | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "View client details",
};

export default function ClientViewPage({ params }: { params: { id: number } }) {
    const clientId = params.id;

    return <ViewClientPage clientId={clientId} />;
}