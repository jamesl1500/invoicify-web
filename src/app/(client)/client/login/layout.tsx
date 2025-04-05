export default function ClientLoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html>
            <body>
            <div className="client-login-layout">
            <div className="client-login-layout-inner">
                {children}
            </div>
        </div>
            </body>
        </html>
    );
}