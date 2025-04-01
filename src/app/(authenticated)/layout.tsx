"use client";

import type { Metadata } from "next";
import axios from "axios";

const favicon = "/static/images/invoicify-logo.png";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

// Import styles
import "@/styles/styles.scss";

// Import templates
import Header from "@/templates/authenticated/header";
import Footer from "@/templates/authenticated/footer";
import Sidebar from "@/templates/authenticated/sidebar";

import { SessionProviderWrapper } from "@/wrappers/SessionProviderWrapper";

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { signOut } from "next-auth/react";

import { Providers } from "../providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This is the root layout component for authenticated pages
  //const { data: session, status } = useSession();


  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>

          {/* This is the sidebar component */}
          <div className="sidebar-holder">
            <Sidebar />
          </div>

          {/* This is the main content area */}
          <div className="website">

            <div className="header-holder">
              {/* This is the header component */}
              <Header />
            </div>
            <div className="website-content container-fluid">
              <Providers>{children}</Providers>
            </div>

            <div className="footer-holder">
              {/* This is the footer component */}
              <Footer />
            </div>
          </div>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
