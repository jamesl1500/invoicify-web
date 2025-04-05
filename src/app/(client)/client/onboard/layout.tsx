import React from 'react';

import { Providers } from '@/app/providers';

export default function ClientOnboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html>
            <body>
                <div className="client-onboard-layout">
                    <div className="client-onboard-layout-inner">
                        <Providers>
                            {children}
                        </Providers>
                    </div>
                </div>
            </body>
        </html>
    );
}