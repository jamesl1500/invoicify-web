import StripePageClient from "./components/StripePage";
import React from "react";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Stripe & Payouts",
    description: "Manage your Stripe account and payouts",
};

export default function StripePage() {
    return <StripePageClient />;
}