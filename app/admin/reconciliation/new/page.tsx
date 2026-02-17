'use client';
import { useState, useEffect } from 'react';
import { Search, CheckCircle, AlertCircle, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function NewReconciliationPage() {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [counts, setCounts] = useState<Map<string, { counted: number; reason?: string }>>(new Map());
    const [notes, setNotes] = useState('');

    useEffect(() => {
        loadProducts();
        startSession();
    }, []);

    async function loadProducts() {
        try {
            const res = await fetch('/api/products');
            if (res.ok) {
                setProducts(await res.json());
            }
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    async function startSession() {
        try {
            const res = await fetch('/api/audit/session/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 'current-user-id', notes }),
            });

            if (res.ok) {
                const session = await res.json();
                setSessionId(session.id);
                toast.success('Audit session started!');
            }
        } catch (error) {
            toast.error('Failed to start audit session');
        }
    }

    function updateCount(productId: string, counted: number, reason?: string) {
        const newCounts = new Map(counts);
        newCounts.set(productId, { counted, reason });
        setCounts(newCounts);
    }

    async function saveCount(product: any) {
        if (!sessionId) {
            toast.error('No active audit session');
            return;
        }

        const countData = counts.get(product.id);
        if (countData === undefined) return;

        try {
            const res = await fetch(`/api/audit/session/${sessionId}/count`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product.id,
                    countedQuantity: countData.counted,
                    reason: countData.reason,
                }),
            });

            if (res.ok) {
                toast.success(`Count saved for ${product.name}`);
            }
        } catch (error) {
            toast.error('Failed to save count');
        }
    }

    async function completeAudit() {
        if (!sessionId) return;

        if (!confirm('Complete this audit? This will adjust inventory based on counted quantities.')) return;

        try {
            const res = await fetch(`/api/audit/session/${sessionId}/complete`, {
                method: 'POST',
            });

            if (res.ok) {
                toast.success('Audit completed! Inventory adjusted.');
                router.push(`/admin/reconciliation/${sessionId}`);
            }
        } catch (error) {
            toast.error('Failed to complete audit');
        }
    }

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">New Inventory Audit</h1>
                <p className="text-gray-500 mt-1">Count physical inventory and reconcile with system</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products by name or SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <button
                        onClick={completeAudit}
                        disabled={counts.size === 0}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                    >
                        <CheckCircle size={20} />
                        Complete Audit
                    </button>
                </div>

                <div className="space-y-2">
                    {filteredProducts.map((product) => {
                        const countData = counts.get(product.id);
                        const variance = countData ? countData.counted - product.stock : 0;

                        return (
                            <div key={product.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                                </div>

                                <div className="w-32">
                                    <div className="text-sm text-gray-500">System Qty</div>
                                    <div className="font-mono font-semibold text-lg">{product.stock}</div>
                                </div>

                                <div className="w-32">
                                    <input
                                        type="number"
                                        placeholder="Counted"
                                        value={countData?.counted ?? ''}
                                        onChange={(e) => updateCount(product.id, parseInt(e.target.value) || 0)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-1 font-mono text-lg"
                                    />
                                </div>

                                <div className="w-32">
                                    {countData && (
                                        <div className={`text-center ${variance !== 0 ? 'text-red-600 font-bold' : 'text-green-600'}`}>
                                            {variance > 0 ? '+' : ''}
                                            {variance}
                                        </div>
                                    )}
                                </div>

                                {Math.abs(variance) > 0 && countData && (
                                    <select
                                        value={countData.reason || ''}
                                        onChange={(e) => updateCount(product.id, countData.counted, e.target.value)}
                                        className="w-40 border border-gray-300 rounded-lg px-3 py-1 text-sm"
                                    >
                                        <option value="">Select reason</option>
                                        <option value="theft">Theft</option>
                                        <option value="damage">Damage</option>
                                        <option value="expired">Expired</option>
                                        <option value="shrinkage">Shrinkage</option>
                                        <option value="other">Other</option>
                                    </select>
                                )}

                                {countData && (
                                    <button
                                        onClick={() => saveCount(product)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                    >
                                        <Save size={16} />
                                        Save
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
