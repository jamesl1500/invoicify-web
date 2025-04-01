export default function CreateInvoicePage() {
    // This is the create invoice page component

    // Get clients that belong to the user
    return (
        <div className="page page-create-invoice">
            <div className="page-inner">
                <div className="page-header">
                    <div className="page-header-title">
                        Create Invoice
                    </div>
                    <div className="page-header-subtitle">
                        Create a new invoice for your clients
                    </div>
                </div>
                <div className="page-content">
                    <div className="page-content-inner">
                        <div className="page-content-inner-title">
                            Invoice Details
                        </div>
                        <div className="page-content-inner-subtitle">
                            Fill in the details of the invoice
                        </div>
                        <div className="page-content-inner-form">
                            {/* Form for creating a new invoice */}
                            <form>
                                {/* Invoice Number */}
                                <div className="form-group">
                                    <label htmlFor="invoice-number">Invoice Number</label>
                                    <input type="text" id="invoice-number" className="form-control" placeholder="Enter invoice number" />
                                </div>

                            </form>
                        </div>
                        <div className="page-content-inner-actions">
                            <button type="submit" className="btn btn-primary">
                                Create Invoice
                            </button>
                            <button type="button" className="btn btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const metadata = {
    title: "Create Invoice | " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "Create Invoice page",
};