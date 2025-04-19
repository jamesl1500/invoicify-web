import ViewSettingsPage from "./ViewSettingsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Settings | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "View and edit your settings",
};

export default function SettingsPage() {
    
    return <ViewSettingsPage />
}