'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { ArrowLeft, Save, Package, Link as LinkIcon, Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// Define Product type matching Backend Response (snake_case)
// But wait, the previous code used kebab-case matching the DB column names directly.
// The new API returns snake_case (Pydantic default).
// I will transform the data to use local state with my preferred structure or stick to one.
// Let's stick to matching the API response structure locally to avoid confusion.

type Product = {
    product_id: string;
    product_name: string;
    brand_name?: string;
    manufacturer_name?: string;
    category_name?: string;
    upc_ean_code?: string;
    image_url?: string;
    description_text?: string;
    base_unit_name?: string;
    pack_size?: number;
    pack_unit_name?: string;
    bulk_pack_product_id?: string;
    is_bulk_pack?: boolean;
    status: string;
};

const COMMON_BASE_UNITS = ['piece', 'each', 'kg', 'g', 'lb', 'oz', 'liter', 'ml', 'gallon'];
const COMMON_PACK_UNITS = ['box', 'case', 'carton', 'dozen', 'pack', 'bundle', 'pallet'];

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params?.productId as string;

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
        try {
            const data: any = await apiClient.getProduct(productId);
            // Transform response if necessary? 
            // The API returns snake_case as per `ProductResponse` schema (implicitly by Pydantic).
            // Let's assume data is already correct.
            setProduct(data);

            // Load linked bulk pack if exists
            if (data.bulk_pack_product_id) {
                try {
                    const bulkData: any = await apiClient.getProduct(data.bulk_pack_product_id);
                    setLinkedBulkPack(bulkData);
                } catch (err) {
                    console.warn('Failed to load linked bulk pack details', err);
                }
            }
        } catch (error) {
            console.error('Failed to load product:', error);
            toast.error('Failed to load product');
        } finally {
            setLoading(false);
        }
    }

    async function searchBulkPacks() {
        if (!bulkPackSearchQuery.trim()) {
            setBulkPackResults([]);
            return;
        }

        setSearchingBulkPack(true);
        try {
            // Use getProducts with search param
            const data: any = await apiClient.getProducts({
                search: bulkPackSearchQuery,
                limit: 10
            });

            // Filter out current product to avoid self-reference
            const filtered = (data || []).filter((p: any) => p.product_id !== productId);
            setBulkPackResults(filtered);
        } catch (error) {
            console.error('Search failed:', error);
            toast.error('Product search failed');
        } finally {
            setSearchingBulkPack(false);
        }
    }

    async function handleSave() {
        if (!product) return;

        setSaving(true);
        try {
            // Prepare payload matching ProductCreate schema (snake_case)
            const payload = {
                product_name: product.product_name,
                brand_name: product.brand_name,
                manufacturer_name: product.manufacturer_name,
                category_name: product.category_name,
                upc_ean_code: product.upc_ean_code,
                description_text: product.description_text,
                base_unit_name: product.base_unit_name || 'piece',
                pack_size: product.pack_size || 1,
                pack_unit_name: product.pack_unit_name,
                bulk_pack_product_id: product.bulk_pack_product_id,
                is_bulk_pack: product.is_bulk_pack || false,
                status: product.status
            };

            await apiClient.updateProduct(productId, payload);
            toast.success('Product updated successfully!');
            router.push('/super-admin/products');
        } catch (error: any) {
            console.error('Save failed:', error);
            toast.error('Failed to save product: ' + (error.message || 'Unknown error'));
        } finally {
            setSaving(false);
        }
    }

    const packCalculation = `${product?.pack_size || 1} ${product?.pack_unit_name || 'Unit'}${(product?.pack_size || 1) > 1 ? 's' : ''} = ${product?.pack_size || 1} ${product?.base_unit_name || 'piece'}${(product?.pack_size || 1) > 1 ? 's' : ''}`;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    if (!product) {
        return <div className="p-8 text-center text-gray-500">Product not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/super-admin/products" className="text-gray-600 hover:text-gray-900 transition-colors">
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
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-md"
                >
                    {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
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
                            value={product.product_name || ''}
                            onChange={e => setProduct({ ...product, product_name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                        <input
                            type="text"
                            value={product.brand_name || ''}
                            onChange={e => setProduct({ ...product, brand_name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                        <input
                            type="text"
                            value={product.manufacturer_name || ''}
                            onChange={e => setProduct({ ...product, manufacturer_name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <input
                            type="text"
                            value={product.category_name || ''}
                            onChange={e => setProduct({ ...product, category_name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">UPC/EAN Code</label>
                        <input
                            type="text"
                            value={product.upc_ean_code || ''}
                            onChange={e => setProduct({ ...product, upc_ean_code: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono transition-all"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={product.description_text || ''}
                            onChange={e => setProduct({ ...product, description_text: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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

                <div className="bg-white rounded-lg p-4 space-y-4 shadow-sm">
                    <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Pack Configuration</div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pack Size</label>
                            <input
                                type="number"
                                min="1"
                                value={product.pack_size || 1}
                                onChange={e => setProduct({ ...product, pack_size: parseInt(e.target.value) || 1 })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Base Unit</label>
                            <div className="flex gap-2">
                                <select
                                    value={product.base_unit_name || 'piece'}
                                    onChange={e => setProduct({ ...product, base_unit_name: e.target.value })}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                                value={product.pack_unit_name || ''}
                                onChange={e => setProduct({ ...product, pack_unit_name: e.target.value })}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                                        setProduct({ ...product, bulk_pack_product_id: undefined });
                                        setLinkedBulkPack(null);
                                    }}
                                    className="text-xs text-red-600 hover:text-red-800 transition-colors"
                                >
                                    Unlink
                                </button>
                            )}
                        </div>

                        {linkedBulkPack ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-green-900">{linkedBulkPack.product_name}</div>
                                    <div className="text-xs text-green-600">{linkedBulkPack.upc_ean_code || 'No UPC'}</div>
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
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                                    />
                                    <button
                                        onClick={searchBulkPacks}
                                        disabled={searchingBulkPack}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {searchingBulkPack ? <Loader2 className="animate-spin w-4 h-4" /> : <Search className="w-4 h-4" />}
                                    </button>
                                </div>

                                {bulkPackResults.length > 0 && (
                                    <div className="border border-gray-200 rounded-lg divide-y max-h-48 overflow-y-auto bg-white shadow-lg">
                                        {bulkPackResults.map(result => (
                                            <button
                                                key={result.product_id}
                                                onClick={() => {
                                                    setProduct({ ...product, bulk_pack_product_id: result.product_id });
                                                    setLinkedBulkPack(result);
                                                    setBulkPackResults([]);
                                                    setBulkPackSearchQuery('');
                                                }}
                                                className="w-full p-3 hover:bg-gray-50 text-left transition-colors"
                                            >
                                                <div className="font-medium text-gray-900 text-sm">{result.product_name}</div>
                                                <div className="text-xs text-gray-500">{result.upc_ean_code || 'No UPC'}</div>
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
