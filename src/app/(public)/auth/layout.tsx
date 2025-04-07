import { SessionProviderWrapper } from "@/wrappers/SessionProviderWrapper";

import React from "react";
import "@/styles/styles.scss";
import { Providers } from "@/app/providers";

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
              <Providers>
                {children}
              </Providers>
            </SessionProviderWrapper>
            </div>
        </div>
      </body>
    </html>
  );
}