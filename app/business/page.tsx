export default function BusinessPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
            <h1 className="text-5xl font-bold mb-8 text-blue-900">RetailOS.cloud</h1>
            <p className="text-2xl mb-8 text-gray-600">The Operating System for Modern Retail</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
                <div className="p-6 bg-white rounded-xl shadow-md">
                    <h2 className="text-xl font-bold mb-2">For Merchants</h2>
                    <p>Manage inventory, sales, and customers in one place.</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-md">
                    <h2 className="text-xl font-bold mb-2">For Multi-Store</h2>
                    <p>Centralized control for franchise and multi-location businesses.</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-md">
                    <h2 className="text-xl font-bold mb-2">For Developers</h2>
                    <p>Extensible API and plugin ecosystem.</p>
                </div>
            </div>

            <div className="mt-12">
                <a href="/super-admin/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
                    Super Admin Login
                </a>
            </div>
        </div>
    );
}
