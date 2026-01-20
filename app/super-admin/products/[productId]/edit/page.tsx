'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ArrowLeft, Save, Package, Link as LinkIcon, Search } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

type Product = {
    'product-id': string;
    'product-name': string;
    'brand-name'?: string;
    'manufacturer-name'?: string;
    'category-name'?: string;
    'upc-ean-code'?: string;
    'image-url'?: string;
    'description-text'?: string;
    'base-unit-name'?: string;
    'pack-size'?: number;
    'pack-unit-name'?: string;
    'bulk-pack-product-id'?: string;
    'is-bulk-pack'?: boolean;
};

const COMMON_BASE_UNITS = ['piece', 'each', 'kg', 'g', 'lb', 'oz', 'liter', 'ml', 'gallon'];
const COMMON_PACK_UNITS = ['box', 'case', 'carton', 'dozen', 'pack', 'bundle', 'pallet'];

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params?.productId as string;
    const supabase = createClientComponentClient();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [product, setProduct] = useState<Product | null>(null);
    const [searchingBulkPack, setSearchingBulkPack] = useState(false);
    const [bulkPackSearchQuery, setBulkPackSearchQuery] = useState('');
    const [bulkPackResults, setBulkPackResults] = useState<Product[]>([]);
    const [linkedBulkPack, setLinkedBulkPack] = useState<Product | null>(null);

    useEffect(() => {
        if (productId) loadProduct();
    }, [productId]);

    async function loadProduct() {
        const { data, error } = await supabase
            .from('global-product-master-catalog')
            .select('*')
            .eq('product-id', productId)
            .single();

        if (error) {
            toast.error('Failed to load product');
            console.error(error);
        } else {
            setProduct(data);

            // Load linked bulk pack if exists
            if (data['bulk-pack-product-id']) {
                const { data: bulkData } = await supabase
                    .from('global-product-master-catalog')
                    .select('*')
                    .eq('product-id', data['bulk-pack-product-id'])
                    .single();

                if (bulkData) setLinkedBulkPack(bulkData);
            }
        }
        setLoading(false);
    }

    async function searchBulkPacks() {
        if (!bulkPackSearchQuery.trim()) {
            setBulkPackResults([]);
            return;
        }

        setSearchingBulkPack(true);
        const { data } = await supabase
            .from('global-product-master-catalog')
            .select('*')
            .or(`product-name.ilike.%${bulkPackSearchQuery}%,upc-ean-code.ilike.%${bulkPackSearchQuery}%`)
            .neq('product-id', productId)
            .limit(10);

        setBulkPackResults(data || []);
        setSearchingBulkPack(false);
    }

    async function handleSave() {
        if (!product) return;

        setSaving(true);
        const { error } = await supabase
            .from('global-product-master-catalog')
            .update({
                'product-name': product['product-name'],
                'brand-name': product['brand-name'],
                'manufacturer-name': product['manufacturer-name'],
                'category-name': product['category-name'],
                'upc-ean-code': product['upc-ean-code'],
                'description-text': product['description-text'],
                'base-unit-name': product['base-unit-name'] || 'piece',
                'pack-size': product['pack-size'] || 1,
                'pack-unit-name': product['pack-unit-name'],
                'bulk-pack-product-id': product['bulk-pack-product-id'],
                'is-bulk-pack': product['is-bulk-pack'] || false,
            })
            .eq('product-id', productId);

        setSaving(false);

        if (error) {
            toast.error('Failed to save product');
            console.error(error);
        } else {
            toast.success('Product updated successfully!');
            router.push('/super-admin/products');
        }
    }

    const packCalculation = `${product?.['pack-size'] || 1} ${product?.['pack-unit-name'] || 'Unit'}${(product?.['pack-size'] || 1) > 1 ? 's' : ''} = ${product?.['pack-size'] || 1} ${product?.['base-unit-name'] || 'piece'}${(product?.['pack-size'] || 1) > 1 ? 's' : ''}`;

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading product...</div>;
    }

    if (!product) {
        return <div className="p-8 text-center text-gray-500">Product not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/super-admin/products" className="text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                        <p className="text-sm text-gray-500 mt-1">Update product details and UOM configuration</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    Product Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input
                            type="text"
                            value={product['product-name'] || ''}
                            onChange={e => setProduct({ ...product, 'product-name': e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                        <input
                            type="text"
                            value={product['brand-name'] || ''}
                            onChange={e => setProduct({ ...product, 'brand-name': e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                        <input
                            type="text"
                            value={product['manufacturer-name'] || ''}
                            onChange={e => setProduct({ ...product, 'manufacturer-name': e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <input
                            type="text"
                            value={product['category-name'] || ''}
                            onChange={e => setProduct({ ...product, 'category-name': e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">UPC/EAN Code</label>
                        <input
                            type="text"
                            value={product['upc-ean-code'] || ''}
                            onChange={e => setProduct({ ...product, 'upc-ean-code': e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={product['description-text'] || ''}
                            onChange={e => setProduct({ ...product, 'description-text': e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Unit Relationship Engine */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-indigo-600" />
                    Unit Relationship Engine
                </h2>

                <div className="bg-white rounded-lg p-4 space-y-4">
                    <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Pack Configuration</div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pack Size</label>
                            <input
                                type="number"
                                min="1"
                                value={product['pack-size'] || 1}
                                onChange={e => setProduct({ ...product, 'pack-size': parseInt(e.target.value) || 1 })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Base Unit</label>
                            <div className="flex gap-2">
                                <select
                                    value={product['base-unit-name'] || 'piece'}
                                    onChange={e => setProduct({ ...product, 'base-unit-name': e.target.value })}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {COMMON_BASE_UNITS.map(unit => (
                                        <option key={unit} value={unit}>{unit}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pack Unit Name (Optional)</label>
                        <div className="flex gap-2">
                            <select
                                value={product['pack-unit-name'] || ''}
                                onChange={e => setProduct({ ...product, 'pack-unit-name': e.target.value })}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">-- Select or leave empty --</option>
                                {COMMON_PACK_UNITS.map(unit => (
                                    <option key={unit} value={unit}>{unit}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Calculation Display */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="text-xs font-semibold text-blue-600 uppercase mb-1">Relationship</div>
                        <div className="text-sm font-mono font-bold text-blue-900">{packCalculation}</div>
                    </div>

                    {/* Link to Bulk Pack */}
                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">Link to Bulk Pack / Case</label>
                            {linkedBulkPack && (
                                <button
                                    onClick={() => {
                                        setProduct({ ...product, 'bulk-pack-product-id': undefined });
                                        setLinkedBulkPack(null);
                                    }}
                                    className="text-xs text-red-600 hover:text-red-800"
                                >
                                    Unlink
                                </button>
                            )}
                        </div>

                        {linkedBulkPack ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-green-900">{linkedBulkPack['product-name']}</div>
                                    <div className="text-xs text-green-600">{linkedBulkPack['upc-ean-code'] || 'No UPC'}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Search for bulk pack product..."
                                        value={bulkPackSearchQuery}
                                        onChange={e => setBulkPackSearchQuery(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && searchBulkPacks()}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                    <button
                                        onClick={searchBulkPacks}
                                        disabled={searchingBulkPack}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <Search className="w-4 h-4" />
                                    </button>
                                </div>

                                {bulkPackResults.length > 0 && (
                                    <div className="border border-gray-200 rounded-lg divide-y max-h-48 overflow-y-auto">
                                        {bulkPackResults.map(result => (
                                            <button
                                                key={result['product-id']}
                                                onClick={() => {
                                                    setProduct({ ...product, 'bulk-pack-product-id': result['product-id'] });
                                                    setLinkedBulkPack(result);
                                                    setBulkPackResults([]);
                                                    setBulkPackSearchQuery('');
                                                }}
                                                className="w-full p-3 hover:bg-gray-50 text-left transition-colors"
                                            >
                                                <div className="font-medium text-gray-900 text-sm">{result['product-name']}</div>
                                                <div className="text-xs text-gray-500">{result['upc-ean-code'] || 'No UPC'}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
