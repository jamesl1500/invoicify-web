import ViewProfilePage from "./ViewProfilePage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Profile | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "View your profile",
};

export default function ProfilePage() {

    return <ViewProfilePage />
}