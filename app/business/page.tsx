import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'RetailOS — The Operating System for Modern Retail',
    description: 'Manage inventory, sales, multi-store operations and AI-powered insights. The complete retail platform for independent and franchise merchants.',
};

export default function BusinessPage() {
    return (
        <div className="min-h-screen bg-[#0a0a14] text-white overflow-hidden">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0a0a14]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="text-2xl font-black tracking-tight">
                        Retail<span className="text-indigo-400">OS</span>
                        <span className="text-white/30">.cloud</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#stores" className="hover:text-white transition-colors">For Stores</a>
                        <a href="#platform" className="hover:text-white transition-colors">Platform</a>
                    </div>
                    <a
                        href="/super-admin/login"
                        className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-semibold transition-all"
                    >
                        Admin Login
                    </a>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative pt-40 pb-24 px-6">
                {/* Glow */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="relative max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold px-4 py-2 rounded-full mb-8">
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                        Multi-tenant retail platform
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black leading-tight mb-6">
                        The Operating System
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                            for Modern Retail
                        </span>
                    </h1>
                    <p className="text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Inventory management, AI-powered insights, multi-store control, and omnichannel sales — all in one platform built for independent and franchise merchants.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="https://indumart.us"
                            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/25 text-lg"
                        >
                            Visit InduMart Stores →
                        </a>
                        <a
                            href="/super-admin/login"
                            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-xl transition-all text-lg"
                        >
                            Super Admin Panel
                        </a>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 border-y border-white/5">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { value: '2', label: 'Active Stores' },
                        { value: 'AI', label: 'Powered Enrichment' },
                        { value: '100%', label: 'Supabase-Free' },
                        { value: 'Real-time', label: 'Inventory Sync' },
                    ].map((stat) => (
                        <div key={stat.label}>
                            <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-white/40">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-black text-center mb-4">Everything your store needs</h2>
                    <p className="text-white/40 text-center mb-16">One platform, infinite stores</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: '📦',
                                title: 'Smart Inventory',
                                desc: 'OCR invoice parsing, AI enrichment, real-time stock levels and low-stock alerts.',
                            },
                            {
                                icon: '🏪',
                                title: 'Multi-Store',
                                desc: 'Each store on its own subdomain. Centralized super-admin. Independent tenant dashboards.',
                            },
                            {
                                icon: '🤖',
                                title: 'AI Enrichment',
                                desc: 'Auto-generate product descriptions and images using DALL-E 3 with one click.',
                            },
                            {
                                icon: '💳',
                                title: 'Integrated POS',
                                desc: 'Connect your POS system, sync Z-reports, and reconcile inventory automatically.',
                            },
                            {
                                icon: '📊',
                                title: 'Profit & Loss',
                                desc: 'Real-time P&L reports, expense tracking, and Z-report analytics.',
                            },
                            {
                                icon: '🛒',
                                title: 'Online Shop',
                                desc: 'Customer-facing storefront with cart, checkout, and order history — per tenant.',
                            },
                        ].map((f) => (
                            <div
                                key={f.title}
                                className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all"
                            >
                                <div className="text-4xl mb-4">{f.icon}</div>
                                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Store cards */}
            <section id="stores" className="py-20 px-6 bg-white/[0.02]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-black mb-4">Live InduMart Stores</h2>
                    <p className="text-white/40 mb-12">Powered by RetailOS</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { name: 'InduMart Highpoint', city: 'High Point, NC', url: 'https://highpoint.indumart.us', color: 'from-indigo-600 to-purple-600' },
                            { name: 'InduMart Greensboro', city: 'Greensboro, NC', url: 'https://greensboro.indumart.us', color: 'from-cyan-600 to-blue-600' },
                        ].map((store) => (
                            <a
                                key={store.name}
                                href={store.url}
                                className="group block bg-white/5 border border-white/10 hover:border-white/30 rounded-2xl p-8 transition-all text-left"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${store.color} flex items-center justify-center text-2xl mb-4`}>
                                    🏬
                                </div>
                                <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">{store.name}</h3>
                                <p className="text-white/40 text-sm mb-4">{store.city}</p>
                                <span className="text-indigo-400 text-sm font-semibold">Shop now →</span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5 text-center">
                <div className="text-2xl font-black mb-2">
                    Retail<span className="text-indigo-400">OS</span>
                    <span className="text-white/20">.cloud</span>
                </div>
                <p className="text-white/20 text-sm">© 2026 RetailOS. All rights reserved.</p>
                <div className="mt-4 flex justify-center gap-6 text-sm text-white/30">
                    <a href="/super-admin/login" className="hover:text-white/60 transition-colors">Super Admin</a>
                    <a href="https://indumart.us" className="hover:text-white/60 transition-colors">InduMart</a>
                </div>
            </footer>
        </div>
    );
}
