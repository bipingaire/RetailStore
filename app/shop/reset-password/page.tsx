'use client';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <div className="mb-6">
                    <ShoppingBag className="mx-auto text-emerald-600" size={48} />
                    <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Password Reset</h2>
                    <p className="text-gray-600">
                        Password reset functionality will be available soon. Please contact support for assistance.
                    </p>
                </div>
                <Link
                    href="/shop/login"
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-emerald-700"
                >
                    Back to Login <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
}
