/**
 * Invoices related functions
 * 
 * This file contains functions to fetch, create, update, and delete invoices.
 * 
 */

import API from "./api";

/**
 * InvoiceItem interface
 */
export interface InvoiceItem {
    id: string;
    invoice_id: string;
    item: string;
    description: string;
    quantity: number;
    unit_price: number;
}

/**
 * Invoice interface
 */
export interface Invoice {
    id: string;
    user_id: number;
    client_id: number;
    invoice_number: string;
    issue_date: string;
    due_date: string;
    status: string;
    sub_total: number;
    tax_rate: number;
    total_amount: number;
    tax_amount: number;
    notes: string;
    terms: string;
    pdf_url: string;
    created_at: string;
    updated_at: string;
}

export const fetchUserInvoices = async (query? string) => {
    try{
        const response = API.get('/invoices');

        if(response.status === 200){
            return response.data;
        }else{
            throw new Error("Failed to fetch invoices" + response.status);
        }
    }catch(error){
        console.error("Error fetching invoices:", error);
        throw new Error("Failed to fetch invoices");
    }
};