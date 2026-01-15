'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import {
    ShoppingBag, Store, Users, TrendingUp, Zap, Shield,
    Globe, BarChart, Package, ArrowRight, CheckCircle, Sparkles
} from 'lucide-react';

export default function BusinessPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-lg z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <ShoppingBag size={24} className="text-white" />
                        </div>
                        <span className="text-2xl font-black text-gray-900">
                            Retail<span className="text-blue-600">OS</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-gray-600 hover:text-gray-900 font-semibold transition">
                            Features
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 font-semibold transition">
                            Pricing
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-bold transition shadow-lg shadow-blue-200">
                            Contact Sales
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-20 pb-32 px-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
                                <Sparkles size={16} />
                                Multi-Tenant Retail Platform
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
                                Your Complete Retail Management
                                <span className="text-blue-600"> Ecosystem</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-8">
                                Power your retail network with RetailOS - the comprehensive platform
                                for managing multiple stores, inventory, customers, and analytics from a single dashboard.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition shadow-xl shadow-blue-200 inline-flex items-center gap-2">
                                    Request Demo
                                    <ArrowRight size={20} />
                                </button>
                                <button className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-full font-bold text-lg transition border-2 border-gray-200">
                                    View Pricing
                                </button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 shadow-2xl">
                                <div className="bg-white rounded-2xl p-6 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                            <Store size={24} className="text-green-600" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">120+ Stores</div>
                                            <div className="text-sm text-gray-500">Active Tenants</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <TrendingUp size={24} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">$2.4M Revenue</div>
                                            <div className="text-sm text-gray-500">This Month</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                            <Users size={24} className="text-purple-600" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">45K Customers</div>
                                            <div className="text-sm text-gray-500">Across Network</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-gray-900 mb-4">
                            Everything You Need to Scale
                        </h2>
                        <p className="text-xl text-gray-600">
                            Built for modern retail operations
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Store,
                                title: 'Multi-Tenant Management',
                                description: 'Manage unlimited stores with individual subdomains and isolated data',
                                color: 'blue',
                            },
                            {
                                icon: Package,
                                title: 'AI-Powered Inventory',
                                description: 'Auto-enriched product catalog with intelligent categorization',
                                color: 'green',
                            },
                            {
                                icon: BarChart,
                                title: 'Advanced Analytics',
                                description: 'Real-time insights across all your retail locations',
                                color: 'purple',
                            },
                            {
                                icon: Globe,
                                title: 'Geolocation Routing',
                                description: 'Auto-redirect customers to their nearest store location',
                                color: 'orange',
                            },
                            {
                                icon: Shield,
                                title: 'Enterprise Security',
                                description: 'Row-level security and tenant isolation built-in',
                                color: 'red',
                            },
                            {
                                icon: Zap,
                                title: 'Lightning Fast',
                                description: 'Built on Next.js and Supabase for optimal performance',
                                color: 'yellow',
                            },
                        ].map((feature, idx) => (
                            <div
                                key={idx}
                                className="bg-gray-50 hover:bg-white border border-gray-100 hover:border-gray-200 rounded-2xl p-6 transition hover:shadow-lg group"
                            >
                                <div className={`w-12 h-12 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                                    <feature.icon size={24} className={`text-${feature.color}-600`} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Platform Benefits */}
            <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-black text-gray-900 mb-6">
                                Why Retailers Choose RetailOS
                            </h2>
                            <div className="space-y-4">
                                {[
                                    'Centralized product master catalog across all locations',
                                    'Automated inventory synchronization with POS systems',
                                    'Built-in customer loyalty and marketing campaigns',
                                    'Real-time sales analytics and reporting',
                                    'Multi-domain architecture with custom branding',
                                    'AI-powered product enrichment and categorization',
                                ].map((benefit, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className="mt-1">
                                            <CheckCircle size={20} className="text-green-600" />
                                        </div>
                                        <p className="text-lg text-gray-700">{benefit}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                Platform Architecture
                            </h3>
                            <div className="space-y-4">
                                <div className="border-l-4 border-blue-600 pl-4">
                                    <div className="font-bold text-gray-900">RetailOS.com</div>
                                    <div className="text-sm text-gray-600">
                                        Central admin platform for super admins and tenant managers
                                    </div>
                                </div>
                                <div className="border-l-4 border-green-600 pl-4">
                                    <div className="font-bold text-gray-900">Custom Brand Domain</div>
                                    <div className="text-sm text-gray-600">
                                        Your branded parent domain (e.g., indumart.us)
                                    </div>
                                </div>
                                <div className="border-l-4 border-purple-600 pl-4">
                                    <div className="font-bold text-gray-900">Store Subdomains</div>
                                    <div className="text-sm text-gray-600">
                                        Individual ecommerce sites per location (e.g., highpoint.indumart.us)
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-blue-600">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-black text-white mb-6">
                        Ready to Transform Your Retail Business?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join hundreds of retailers already using RetailOS to power their operations
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-full font-bold text-lg transition shadow-xl inline-flex items-center gap-2">
                            Get Started
                            <ArrowRight size={20} />
                        </button>
                        <button className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-full font-bold text-lg transition border-2 border-blue-400">
                            Schedule Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <ShoppingBag size={24} className="text-blue-400" />
                        <span className="text-xl font-black text-white">
                            Retail<span className="text-blue-400">OS</span>
                        </span>
                    </div>
                    <p className="text-sm">
                        © 2026 RetailOS Platform. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
