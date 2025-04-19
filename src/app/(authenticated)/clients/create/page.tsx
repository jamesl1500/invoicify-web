import React from "react";
import { Metadata } from "next";

import CreateClientPage from "./components/CreateClientPage";

export const metadata: Metadata = {
    title: "Create Client | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "Create a new client",
};

export default function CreateClient() {

    return <CreateClientPage />;
}
