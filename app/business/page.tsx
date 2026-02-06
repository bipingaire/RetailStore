import Link from 'next/link';
import { ArrowRight, BarChart2, CheckCircle2, Globe, Layers, ShieldCheck, Zap } from 'lucide-react';

export default function BusinessLandingPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">

            {/* Navbar */}
            <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                            <Layers size={24} />
                        </div>
                        <span className="text-2xl font-black tracking-tighter">Retail<span className="text-indigo-600">OS</span></span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
                        <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
                        <a href="#solutions" className="hover:text-indigo-600 transition-colors">Solutions</a>
                        <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/shop/login" className="text-sm font-bold text-gray-600 hover:text-indigo-600">Login</Link>
                        <Link href="/contact" className="hidden sm:flex bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative overflow-hidden pt-20 pb-32">
                <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 md:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-indigo-100">
                        <Zap size={14} className="fill-indigo-700" /> New: AI Inventory Reconciliation
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
                        The Operating System for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Modern Retail</span>
                    </h1>
                    <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Manage inventory, sales, and customer loyalty across all your locations from one unified, intelligent dashboard.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/admin" className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2">
                            Access Dashboard <ArrowRight size={20} />
                        </Link>
                        <button className="w-full sm:w-auto bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-50 transition-all flex items-center justify-center">
                            View Demo
                        </button>
                    </div>

                    <div className="mt-20 relative mx-auto max-w-5xl">
                        <div className="aspect-video bg-gray-900 rounded-2xl shadow-2xl border-4 border-gray-900 overflow-hidden relative group">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-gray-500 font-medium">Dashboard Preview Placeholder</p>
                            </div>
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent pointer-events-none"></div>
                        </div>
                        {/* Floating Stats */}
                        <div className="absolute -right-8 top-12 bg-white p-4 rounded-xl shadow-xl border border-gray-100 hidden md:block animate-bounce-slow">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-100 rounded-lg text-green-600"><BarChart2 size={20} /></div>
                                <div>
                                    <div className="text-xs text-gray-400 font-bold uppercase">Revenue</div>
                                    <div className="text-lg font-black text-gray-900">$124,500</div>
                                </div>
                            </div>
                            <div className="text-xs text-green-600 font-bold flex items-center gap-1">
                                <ArrowRight size={12} className="-rotate-45" /> +12.5% vs last month
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-black mb-4">Everything you need to scale</h2>
                        <p className="text-gray-500 text-lg">Powerful tools designed for multi-location retail chains.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Globe, title: 'Multi-Tenant Architecture', desc: 'Manage unlimited store locations from a single super-admin panel.' },
                            { icon: BarChart2, title: 'Real-time Analytics', desc: 'Live sales data, inventory alerts, and profit margin analysis.' },
                            { icon: ShieldCheck, title: 'Enterprise Security', desc: 'Role-based access control and secure data encryption.' }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                            <Layers size={18} />
                        </div>
                        <span className="text-xl font-bold tracking-tight">RetailOS</span>
                    </div>
                    <p className="text-gray-400 text-sm">© 2026 RetailOS Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>

        </div>
    );
}
