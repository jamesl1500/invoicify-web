import { SessionProviderWrapper } from "@/wrappers/SessionProviderWrapper";

import React from "react";
import "@/styles/styles.scss";

// This is the authentication layout component
export default function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <div className="authentication-layout">
          <div className="authentication-layout-inner">
            <SessionProviderWrapper>
              {children}
            </SessionProviderWrapper>
            </div>
        </div>
      </body>
    </html>
  );
}