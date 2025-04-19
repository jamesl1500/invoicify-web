import ClientOnboardPage from "./components/ClientOnboardPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Client Onboard | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "Client onboarding page",
};

const ClientOnboard = async (props: {params: Promise<{ id: string }>;}) => {
    // This is the client login page component
    const onboardToken = await props.params.id;

    return <ClientOnboardPage onboardToken={onboardToken} />;
}

export default ClientOnboard;