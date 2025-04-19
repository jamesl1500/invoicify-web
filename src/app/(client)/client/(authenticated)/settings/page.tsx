import SettingsPage from "./SettingsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Settings | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "Manage your account settings",
};

export default function ClientSettings() {

    return <SettingsPage />
};