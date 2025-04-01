export default function CreateInvoicePage() {
    return (
        <div>
            <h1>Create Invoice</h1>
            <p>Welcome to the create invoice page!</p>
        </div>
    );
}
export const metadata = {
    title: "Create Invoice | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "Create Invoice page",
};