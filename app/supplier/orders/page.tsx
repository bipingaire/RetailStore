'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  FileText, CheckCircle, XCircle, Clock, ArrowRight,
  DollarSign, Printer, Send, Truck, AlertCircle, FileCheck,
  Edit2, Save, Plus, Trash2, Package, Box, History, RefreshCw, X,
  Download, Database as DatabaseIcon, CheckSquare
} from 'lucide-react';

// --- TYPES ---
type OrderStatus = 'pending' | 'negotiating' | 'quote_sent' | 'confirmed' | 'shipped' | 'cancelled';
type OrderType = 'direct_po' | 'marketplace_rfq';

type LineItem = {
  id: string;
  name: string;
  sku: string;
  requested_qty: number; // Original ask
  confirmed_qty: number; // Supplier edited qty
  unit_price: number; // Negotiated price
  total: number;
};

type QuoteVersion = {
  version: number;
  created_at: string;
  items: LineItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  payment_terms: string;
  note: string;
};

type IncomingOrder = {
  id: string;
  po_number: string;
  retailer_name: string;
  retailer_id: string;
  order_type: OrderType;
  created_at: string;
  last_updated: string; // New field for tracking activity
  required_date: string;
  status: OrderStatus;

  // Logistics
  logistics_mode: 'pallet' | 'box';
  logistics_metric: number;

  // Data
  items: LineItem[];
  contract_terms: {
    payment: string;
    shipping_rate: number;
  };

  // Version History
  quote_history: QuoteVersion[];
};

export default function SupplierOrdersPage() {
  const [orders, setOrders] = useState<IncomingOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<IncomingOrder | null>(null);

  // Edit State for the Modal
  const [editItems, setEditItems] = useState<LineItem[]>([]);
  const [editShipping, setEditShipping] = useState(0);
  const [editPayment, setEditPayment] = useState('');
  const [editNote, setEditNote] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showQuotePreview, setShowQuotePreview] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock Data
    const mockOrders: IncomingOrder[] = [
      {
        id: 'ord-001',
        po_number: 'PO-2023-088',
        retailer_name: "Downtown Market",
        retailer_id: 'ret-123',
        order_type: 'direct_po',
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        required_date: new Date(Date.now() + 86400000 * 3).toISOString(),
        status: 'pending',
        logistics_mode: 'box',
        logistics_metric: 6, // approx boxes
        contract_terms: { payment: 'Net 30', shipping_rate: 50 },
        items: [
          { id: '1', name: "Heinz Tomato Ketchup (24x20oz)", sku: "HJZ-9982", requested_qty: 20, confirmed_qty: 20, unit_price: 45.00, total: 900 },
          { id: '2', name: "Coca-Cola Classic (12x2L)", sku: "CCE-1120", requested_qty: 50, confirmed_qty: 50, unit_price: 18.50, total: 925 }
        ],
        quote_history: []
      },
      {
        id: 'ord-002',
        po_number: 'RFQ-AUTO-992',
        retailer_name: "Green Earth Organics",
        retailer_id: 'ret-456',
        order_type: 'marketplace_rfq',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        last_updated: new Date(Date.now() - 3600000).toISOString(),
        required_date: new Date(Date.now() + 86400000 * 5).toISOString(),
        status: 'quote_sent',
        logistics_mode: 'pallet',
        logistics_metric: 100, // 100% pallet
        contract_terms: { payment: 'COD', shipping_rate: 150 },
        items: [
          { id: '3', name: "Chobani Greek Yogurt Variety", sku: "CHB-3341", requested_qty: 100, confirmed_qty: 100, unit_price: 32.00, total: 3200 }
        ],
        quote_history: [
          {
            version: 1,
            created_at: new Date(Date.now() - 40000000).toISOString(),
            items: [{ id: '3', name: "Chobani Greek Yogurt Variety", sku: "CHB-3341", requested_qty: 100, confirmed_qty: 100, unit_price: 35.00, total: 3500 }],
            subtotal: 3500, tax: 280, shipping: 150, total: 3930, payment_terms: 'COD', note: 'Initial Quote'
          }
        ]
      }
    ];
    setOrders(mockOrders);
    setLoading(false);
  }, []);

  // --- LOGIC ---

  const calculateLogistics = (items: LineItem[]) => {
    const totalUnits = items.reduce((sum, i) => sum + i.confirmed_qty, 0);
    const mode = totalUnits < 50 ? 'box' : 'pallet';
    const metric = mode === 'pallet'
      ? Math.round((totalUnits / 100) * 100)
      : Math.ceil(totalUnits / 12);
    return { mode, metric };
  };

  const calculateTotals = (items: LineItem[], shipping: number) => {
    const subtotal = items.reduce((sum, i) => sum + (i.confirmed_qty * i.unit_price), 0);
    const tax = subtotal * 0.08;
    return { subtotal, tax, total: subtotal + tax + shipping };
  };

  const handleOpenOrder = (order: IncomingOrder) => {
    setSelectedOrder(order);
    setEditItems(JSON.parse(JSON.stringify(order.items))); // Deep copy
    setEditShipping(order.contract_terms.shipping_rate);
    setEditPayment(order.contract_terms.payment);
    setEditNote('');
    setShowHistory(false);
    setShowQuotePreview(false);
  };

  const handleUpdateItem = (id: string, field: 'confirmed_qty' | 'unit_price', value: number) => {
    setEditItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        updated.total = updated.confirmed_qty * updated.unit_price;
        return updated;
      }
      return item;
    }));
  };

  const handleDeleteItem = (id: string) => {
    if (confirm("Remove this item from the quote?")) {
      setEditItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleAddItem = () => {
    // Mock Item Addition
    const newItem: LineItem = {
      id: `new-${Date.now()}`,
      name: "Generic Pallet Filler (Promo)",
      sku: "GEN-000",
      requested_qty: 0,
      confirmed_qty: 10,
      unit_price: 10.00,
      total: 100
    };
    setEditItems(prev => [...prev, newItem]);
  };

  const handlePreviewQuote = () => {
    if (!selectedOrder) return;
    setShowQuotePreview(true);
  };

  const handleConfirmSendQuote = () => {
    if (!selectedOrder) return;

    const { subtotal, tax, total } = calculateTotals(editItems, editShipping);
    const logistics = calculateLogistics(editItems);

    const newVersion: QuoteVersion = {
      version: selectedOrder.quote_history.length + 1,
      created_at: new Date().toISOString(),
      items: editItems,
      subtotal, tax, shipping: editShipping, total,
      payment_terms: editPayment,
      note: editNote || 'Updated Quote'
    };

    const updatedOrder: IncomingOrder = {
      ...selectedOrder,
      items: editItems,
      status: 'quote_sent',
      last_updated: new Date().toISOString(),
      logistics_mode: logistics.mode as 'pallet' | 'box',
      logistics_metric: logistics.metric,
      contract_terms: {
        payment: editPayment,
        shipping_rate: editShipping
      },
      quote_history: [newVersion, ...selectedOrder.quote_history] // Newest first
    };

    setOrders(prev => prev.map(o => o.id === selectedOrder.id ? updatedOrder : o));
    alert(`Quote Version ${newVersion.version} Sent Successfully!`);
    setShowQuotePreview(false);
    setSelectedOrder(null);
  };

  const handleMarkConfirmed = () => {
    if (!selectedOrder) return;
    const updatedOrder: IncomingOrder = {
      ...selectedOrder,
      status: 'confirmed',
      last_updated: new Date().toISOString()
    };
    setOrders(prev => prev.map(o => o.id === selectedOrder.id ? updatedOrder : o));
    setSelectedOrder(updatedOrder); // Refresh view
    alert("Order marked as Confirmed!");
  };

  const handleExport = (format: 'csv' | 'api') => {
    if (!selectedOrder) return;
    if (format === 'csv') {
      alert(`Downloading CSV for Order ${selectedOrder.po_number}...`);
      // In real app: generate and download CSV blob
    } else {
      alert(`Syncing Order ${selectedOrder.po_number} to Accounting API...`);
      // In real app: fetch('/api/integrations/quickbooks', ...)
    }
  };

  // Render Helpers
  const { mode: currentMode, metric: currentMetric } = calculateLogistics(editItems);
  const currentFinancials = calculateTotals(editItems, editShipping);

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">

      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="text-purple-600" />
            Incoming Orders
          </h1>
          <p className="text-gray-500 mt-1">Review POs and generate Proforma Invoices.</p>
        </div>
      </header>

      {/* Orders List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b">
            <tr>
              <th className="p-4">PO Number</th>
              <th className="p-4">Retailer</th>
              <th className="p-4">Last Activity</th>
              <th className="p-4">Logistics</th>
              <th className="p-4 text-right">Status</th>
              <th className="p-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => handleOpenOrder(order)}>
                <td className="p-4">
                  <div className="font-mono font-medium text-blue-600">{order.po_number}</div>
                  {order.quote_history.length > 0 && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border">v{order.quote_history.length}</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="font-bold text-gray-900">{order.retailer_name}</div>
                  <div className="text-xs text-gray-400">Terms: {order.contract_terms.payment}</div>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  <div className="font-medium">{new Date(order.last_updated).toLocaleDateString()}</div>
                  <div className="text-xs text-gray-400">{new Date(order.last_updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </td>
                <td className="p-4">
                  {order.logistics_mode === 'pallet' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">
                      <Package size={12} /> {order.logistics_metric}% Pallet
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                      <Box size={12} /> {order.logistics_metric} Boxes
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'quote_sent' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                    }`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4">
                  <ArrowRight size={16} className="text-gray-400" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- ORDER PROCESSING MODAL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

            {/* Header */}
            <div className="bg-gray-900 text-white p-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  {selectedOrder.po_number}
                  <span className="text-xs bg-gray-700 px-2 py-1 rounded font-normal text-gray-300 uppercase">{selectedOrder.order_type.replace('_', ' ')}</span>
                </h2>
                <p className="text-gray-400 text-sm mt-1">From: <b>{selectedOrder.retailer_name}</b></p>
              </div>
              <div className="flex gap-3">
                {selectedOrder.quote_history.length > 0 && (
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className={`text-sm flex items-center gap-2 px-3 py-2 rounded-lg transition ${showHistory ? 'bg-white text-black' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                  >
                    <History size={16} /> {showHistory ? 'Hide History' : `History (${selectedOrder.quote_history.length})`}
                  </button>
                )}
                <div className="text-right pl-4 border-l border-gray-700">
                  <div className="text-xs font-bold text-gray-400 uppercase">Required By</div>
                  <div className="font-bold text-lg text-red-400">{new Date(selectedOrder.required_date).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">

              {/* LEFT: Order Editor (Items & Logistics) */}
              <div className="w-2/3 flex flex-col border-r border-gray-200">

                {/* Logistics Bar */}
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Truck className="text-gray-400" size={18} />
                    <span className="text-sm font-bold text-gray-700">Load Optimization:</span>
                  </div>
                  <div className="flex-1 mx-4">
                    {currentMode === 'pallet' ? (
                      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${currentMetric > 100 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(100, currentMetric)}%` }}></div>
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-700">
                          {currentMetric}% Pallet
                        </span>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(10, currentMetric) }).map((_, i) => <div key={i} className="w-4 h-4 bg-orange-400 rounded-sm"></div>)}
                        <span className="text-xs font-bold ml-2">{currentMetric} Boxes</span>
                      </div>
                    )}
                  </div>
                  {selectedOrder.status !== 'confirmed' && (
                    <button onClick={handleAddItem} className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-200 flex items-center gap-1">
                      <Plus size={12} /> Add Filler Item
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-0">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b sticky top-0">
                      <tr>
                        <th className="py-2 px-4">Item & SKU</th>
                        <th className="py-2 px-4 text-center">Req Qty</th>
                        <th className="py-2 px-4 text-center w-24">Ship Qty</th>
                        <th className="py-2 px-4 text-right w-32">Unit Price</th>
                        <th className="py-2 px-4 text-right">Total</th>
                        <th className="py-2 px-4 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {editItems.map(item => (
                        <tr key={item.id} className="group hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-500 font-mono">{item.sku}</div>
                          </td>
                          <td className="py-3 px-4 text-center text-gray-400 font-mono">
                            {item.requested_qty > 0 ? item.requested_qty : '-'}
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              className="w-full border p-1 rounded text-center font-bold focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                              value={item.confirmed_qty}
                              onChange={(e) => handleUpdateItem(item.id, 'confirmed_qty', parseInt(e.target.value) || 0)}
                              disabled={selectedOrder.status === 'confirmed'}
                            />
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="relative">
                              <span className="absolute left-2 top-1 text-gray-400 text-xs">$</span>
                              <input
                                type="number"
                                className="w-full border p-1 pl-4 rounded text-right font-mono focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                                value={item.unit_price}
                                onChange={(e) => handleUpdateItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                                disabled={selectedOrder.status === 'confirmed'}
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-bold">
                            ${item.total.toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            {selectedOrder.status !== 'confirmed' && (
                              <button onClick={() => handleDeleteItem(item.id)} className="text-gray-300 hover:text-red-500 transition">
                                <Trash2 size={16} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* RIGHT: Quote Summary & History */}
              <div className="w-1/3 bg-gray-50 flex flex-col">

                {/* HISTORY VIEW SWITCHER */}
                {showHistory ? (
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <History size={18} /> Version History
                    </h3>
                    {selectedOrder.quote_history.map((ver) => (
                      <div key={ver.version} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-sm">
                        <div className="flex justify-between font-bold mb-2">
                          <span>Version {ver.version}</span>
                          <span className="text-gray-500">{new Date(ver.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="space-y-1 text-gray-600 text-xs">
                          <div className="flex justify-between"><span>Items:</span><span>{ver.items.length}</span></div>
                          <div className="flex justify-between"><span>Total:</span><span>${ver.total.toFixed(2)}</span></div>
                          <div className="mt-2 pt-2 border-t text-gray-400 italic">"{ver.note}"</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // CURRENT QUOTE EDITOR
                  <div className="flex-1 flex flex-col justify-between p-6">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Printer size={18} /> Quote Editor
                      </h3>

                      <div className="space-y-4 text-sm bg-white p-4 rounded-xl border shadow-sm">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal</span>
                          <span>${currentFinancials.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Tax (8%)</span>
                          <span>${currentFinancials.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-600">
                          <span>Shipping Fee</span>
                          <div className="relative w-24">
                            <span className="absolute left-2 top-1 text-gray-400 text-xs">$</span>
                            <input
                              type="number"
                              className="w-full border p-1 pl-4 rounded text-right disabled:bg-gray-100"
                              value={editShipping}
                              onChange={(e) => setEditShipping(parseFloat(e.target.value) || 0)}
                              disabled={selectedOrder.status === 'confirmed'}
                            />
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-gray-600">
                          <span>Payment Terms</span>
                          <input
                            type="text"
                            className="w-24 border p-1 rounded text-right disabled:bg-gray-100"
                            value={editPayment}
                            onChange={(e) => setEditPayment(e.target.value)}
                            disabled={selectedOrder.status === 'confirmed'}
                          />
                        </div>
                        <div className="flex justify-between text-xl font-black text-gray-900 border-t border-gray-300 pt-3 mt-2">
                          <span>Total</span>
                          <span>${currentFinancials.total.toFixed(2)}</span>
                        </div>
                      </div>

                      {selectedOrder.status !== 'confirmed' && (
                        <div className="mt-4">
                          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Version Note</label>
                          <textarea
                            className="w-full border p-2 rounded-lg text-sm h-20 resize-none outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="E.g., Adjusted qty for pallet optimization..."
                            value={editNote}
                            onChange={(e) => setEditNote(e.target.value)}
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 mt-6">
                      {selectedOrder.status === 'quote_sent' ? (
                        <div className="space-y-3">
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
                            Quote sent. Waiting for retailer confirmation.
                          </div>
                          <button
                            onClick={handleMarkConfirmed}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition"
                          >
                            <CheckSquare size={18} /> Record Customer Confirmation
                          </button>
                          <button
                            onClick={handlePreviewQuote}
                            className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition"
                          >
                            <Edit2 size={18} /> Edit & Re-Send Quote
                          </button>
                        </div>
                      ) : selectedOrder.status === 'confirmed' ? (
                        <div className="space-y-3">
                          <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800 flex items-center gap-2">
                            <CheckCircle size={16} /> Order Confirmed & Locked.
                          </div>
                          <button
                            onClick={handlePreviewQuote}
                            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition"
                          >
                            <Printer size={18} /> Generate Final Invoice (PDF)
                          </button>
                          <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => handleExport('csv')} className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition border">
                              <FileText size={16} /> Export CSV
                            </button>
                            <button onClick={() => handleExport('api')} className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition border">
                              <RefreshCw size={16} /> Sync API
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={handlePreviewQuote}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-purple-200"
                        >
                          <FileCheck size={18} /> Review & Send Quote
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="w-full bg-white hover:bg-gray-100 text-gray-700 font-bold py-3 rounded-xl border transition"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* --- QUOTE PREVIEW MODAL --- */}
      {showQuotePreview && selectedOrder && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-[21cm] min-h-[29.7cm] p-10 shadow-2xl overflow-y-auto max-h-[90vh] flex flex-col relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowQuotePreview(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600"
            >
              <X size={20} />
            </button>

            {/* Header Row */}
            <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-8">
              <div>
                <h1 className="text-4xl font-black tracking-tighter text-gray-900 mb-2">
                  {selectedOrder.status === 'confirmed' ? 'FINAL INVOICE' : 'PROFORMA INVOICE'}
                </h1>
                <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                  {selectedOrder.status === 'confirmed' ? 'Official Document' : `Version ${selectedOrder.quote_history.length + 1}`}
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold text-gray-800">Ref: {selectedOrder.po_number}</h2>
                <div className="text-sm text-gray-600 mt-1">Date: {new Date().toLocaleDateString()}</div>
              </div>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-2 gap-12 mb-10">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Supplier</h3>
                <div className="font-bold text-lg text-gray-900">Global Supply Co.</div>
                <div className="text-sm text-gray-600 mt-1">
                  100 Distribution Way<br />
                  Logistics City, ST 12345
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bill To</h3>
                <div className="font-bold text-lg text-gray-900">{selectedOrder.retailer_name}</div>
                <div className="text-sm text-gray-600 mt-1">
                  (Retailer Address Placeholder)
                </div>
              </div>
            </div>

            {/* Line Items */}
            <table className="w-full text-left mb-8 border-collapse">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="py-2 text-xs font-bold uppercase text-gray-500 w-1/2">Description</th>
                  <th className="py-2 text-xs font-bold uppercase text-gray-500 text-right">Unit Price</th>
                  <th className="py-2 text-xs font-bold uppercase text-gray-500 text-right">Qty</th>
                  <th className="py-2 text-xs font-bold uppercase text-gray-500 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {editItems.map((item, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-4">
                      <div className="font-bold text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500 font-mono mt-0.5">{item.sku}</div>
                    </td>
                    <td className="py-4 text-right text-sm text-gray-600">${item.unit_price.toFixed(2)}</td>
                    <td className="py-4 text-right font-bold text-gray-900">{item.confirmed_qty}</td>
                    <td className="py-4 text-right font-bold text-gray-900">${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-12">
              <div className="w-1/2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold">${currentFinancials.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span className="font-bold">${currentFinancials.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-bold">${editShipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-black border-t-2 border-black pt-2 mt-2">
                  <span>Total</span>
                  <span>${currentFinancials.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8">
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Terms & Notes</h4>
              <p className="text-sm text-gray-700">Payment Terms: <b>{editPayment}</b></p>
              {editNote && <p className="text-sm text-gray-600 mt-2 italic">Note: {editNote}</p>}
            </div>

            <div className="mt-auto pt-6 flex gap-4 print:hidden">
              <button onClick={() => setShowQuotePreview(false)} className="flex-1 bg-white border border-gray-300 text-gray-700 font-bold py-4 rounded hover:bg-gray-50 uppercase tracking-widest text-sm">Back to Edit</button>
              {selectedOrder.status !== 'confirmed' ? (
                <button onClick={handleConfirmSendQuote} className="flex-1 bg-black text-white font-bold py-4 rounded hover:bg-gray-800 uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                  <Send size={16} /> Confirm & Send Quote
                </button>
              ) : (
                <button onClick={() => window.print()} className="flex-1 bg-black text-white font-bold py-4 rounded hover:bg-gray-800 uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                  <Printer size={16} /> Print PDF
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}