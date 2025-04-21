import { Metadata } from 'next';
import React from 'react';
import ResetPassword from './ResetPassword';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: "Reset Password",
    description: "Reset your password",
};

export default function ResetPasswordPage() {

    return (
        <Suspense fallback={<div className="loading">Loading...</div>}>
            <ResetPassword />
        </Suspense>
    );
}