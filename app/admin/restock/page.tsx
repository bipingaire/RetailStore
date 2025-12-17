'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Truck, AlertTriangle, Send, Package, RefreshCw, 
  ChevronDown, Mail, FileText, Plus, Trash2, Save, Calendar, Box, DollarSign, Info, Layers, FilePlus, Paperclip, CheckCircle 
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- MOCK STORE SETTINGS (Ideally fetched from DB) ---
const STORE_DETAILS = {
  name: "RetailRevive Supermarket",
  address: "123 Commerce Blvd, Suite 100",
  city_state_zip: "Metropolis, NY 10012",
  phone: "(212) 555-0199",
  email: "procurement@retailrevive.com",
  poc_name: "Jane Doe (Manager)",
  tax_id: "US-99-123456"
};

type Vendor = {
  id: string;
  name: string;
  contact_phone: string | null;
  whatsapp_number: string | null; 
  email: string | null;
  transport_rate_per_pallet?: number; 
};

type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  current_qty: number;
  reorder_point: number;
  default_vendor_id: string | null;
  vendor_name?: string;
  unit_cost: number;
};

type POItem = InventoryItem & {
  order_qty: number;
  total_value: number; 
  is_manual_addition?: boolean;
};

type DraftPO = {
  id: string;
  po_number: string; // Formatting like PO-2023-001
  target_vendor: Vendor | null;
  items: POItem[];
  delivery_required_at: string;
  status: 'draft' | 'saved' | 'sent' | 'completed';
  logistics_mode: 'pallet' | 'box'; 
  logistics_metric: number;
  total_goods_value: number;
  estimated_transport_cost: number;
  total_po_cost: number;
  governing_item?: string;
  governing_vendor_id?: string;
  final_invoice_url?: string; // Attached by admin later
};

type OverflowAction = {
  poId: string;
  item: InventoryItem;
  qty: number;
};

export default function RestockPage() {
  const [draftPOs, setDraftPOs] = useState<DraftPO[]>([]);
  const [allVendors, setAllVendors] = useState<Vendor[]>([]);
  const [allInventory, setAllInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [pdfPreviewPO, setPdfPreviewPO] = useState<DraftPO | null>(null);
  const [addingItemToPO, setAddingItemToPO] = useState<string | null>(null); 
  const [itemSearchTerm, setItemSearchTerm] = useState('');
  const [overflowData, setOverflowData] = useState<OverflowAction | null>(null);

  // 1. Fetch Data
  useEffect(() => {
    async function loadData() {
      setLoading(true);

      // A. Vendors
      const { data: vendorData } = await supabase
        .from('vendors')
        .select('id, name, contact_phone, whatsapp_number, email');
      
      const vendors = (vendorData || []).map(v => ({
        ...v,
        transport_rate_per_pallet: 120.00 
      }));
      setAllVendors(vendors);

      // B. All Inventory
      const { data: invData, error } = await supabase
        .from('store_inventory')
        .select(`
          id, reorder_point, vendor_id,
          global_products ( name, upc_ean ),
          inventory_batches ( batch_quantity, cost_basis ),
          vendors ( name )
        `)
        .eq('is_active', true);

      if (error) { console.error(error); return; }

      const fullCatalog: InventoryItem[] = (invData || []).map((i: any) => {
        const batches = i.inventory_batches || [];
        const totalQty = batches.reduce((acc: number, b: any) => acc + (b.batch_quantity || 0), 0);
        const totalCost = batches.reduce((acc: number, b: any) => acc + ((b.cost_basis || 0) * b.batch_quantity), 0);
        const avgCost = totalQty > 0 ? totalCost / totalQty : 0;

        return {
          id: i.id,
          name: i.global_products?.name || 'Unknown',
          sku: i.global_products?.upc_ean || 'N/A',
          current_qty: totalQty,
          reorder_point: i.reorder_point || 10,
          default_vendor_id: i.vendor_id,
          vendor_name: i.vendors?.name,
          unit_cost: parseFloat(avgCost.toFixed(2))
        };
      });
      setAllInventory(fullCatalog);

      // C. Auto-Create Drafts
      const lowStockItems = fullCatalog.filter(i => i.current_qty <= i.reorder_point);
      
      const grouped = lowStockItems.reduce((acc, item) => {
        const key = item.default_vendor_id || 'unassigned';
        if (!acc[key]) acc[key] = [];
        
        const qtyNeeded = Math.max(1, item.reorder_point * 2 - item.current_qty);
        acc[key].push({
          ...item,
          order_qty: qtyNeeded,
          total_value: qtyNeeded * item.unit_cost
        });
        return acc;
      }, {} as Record<string, POItem[]>);

      let generatedDrafts: DraftPO[] = [];
      let globalDraftIndex = 0;

      Object.entries(grouped).forEach(([vendorId, items]) => {
        const PALLET_CAPACITY = 100;
        let pendingItems = [...items];
        let currentPalletItems: POItem[] = [];
        let currentPalletLoad = 0;

        while (pendingItems.length > 0) {
            const item = pendingItems[0];
            const spaceLeft = PALLET_CAPACITY - currentPalletLoad;
            
            if (spaceLeft <= 0) { 
                pushDraftPO(); 
                continue; 
            }

            if (item.order_qty <= spaceLeft) {
                currentPalletItems.push(item);
                currentPalletLoad += item.order_qty;
                pendingItems.shift(); 
            } else {
                const fitQty = spaceLeft;
                const remainderQty = item.order_qty - fitQty;
                currentPalletItems.push({ ...item, order_qty: fitQty, total_value: fitQty * item.unit_cost });
                currentPalletLoad += fitQty;
                pendingItems[0] = { ...item, order_qty: remainderQty, total_value: remainderQty * item.unit_cost };
                pushDraftPO();
            }
        }
        if (currentPalletItems.length > 0) pushDraftPO();

        function pushDraftPO() {
            let defaultVendor = vendors.find(v => v.id === vendorId) || null;
            
            if (vendorId === 'unassigned') {
               const governing = currentPalletItems.reduce((prev, current) => (prev.total_value > current.total_value) ? prev : current);
               defaultVendor = vendors.find(v => v.id === governing.default_vendor_id) || null;
            }

            const tempPO: DraftPO = {
                id: `draft-${globalDraftIndex}`,
                po_number: `PO-${new Date().getFullYear()}-${String(globalDraftIndex + 1).padStart(3, '0')}`,
                target_vendor: defaultVendor, 
                items: currentPalletItems,
                delivery_required_at: '',
                status: 'draft',
                logistics_mode: 'box', 
                logistics_metric: 0,
                total_goods_value: 0,
                estimated_transport_cost: 0,
                total_po_cost: 0,
                governing_item: '',
                governing_vendor_id: undefined
            };
            globalDraftIndex++;
            
            generatedDrafts.push(recalculatePO(tempPO, vendors));
            currentPalletItems = [];
            currentPalletLoad = 0;
        }
      });

      setDraftPOs(generatedDrafts);
      setLoading(false);
    }
    loadData();
  }, []);

  const recalculatePO = (po: DraftPO, vendorsList: Vendor[]): DraftPO => {
    const totalUnits = po.items.reduce((sum, i) => sum + i.order_qty, 0);
    const totalGoodsValue = po.items.reduce((sum, i) => sum + i.total_value, 0);
    
    const mode = totalUnits < 50 ? 'box' : 'pallet';
    const metric = mode === 'pallet' 
      ? Math.round((totalUnits / 100) * 100)
      : Math.ceil(totalUnits / 12);

    let governingItemName = 'None';
    let suggestedVendor: Vendor | null = po.target_vendor;
    let governingVendorId: string | undefined = undefined; 

    if (po.items.length > 0) {
      const governingItem = po.items.reduce((prev, current) => (prev.total_value > current.total_value) ? prev : current);
      governingItemName = governingItem.name;
      
      if (governingItem.default_vendor_id) {
         governingVendorId = governingItem.default_vendor_id;
         const foundVendor = vendorsList.find(v => v.id === governingItem.default_vendor_id);
         if (foundVendor && !suggestedVendor) {
            suggestedVendor = foundVendor;
         }
      }
    }

    const palletRate = suggestedVendor?.transport_rate_per_pallet || 100;
    let transportCost = 0;

    if (mode === 'pallet') {
        const palletsUsed = Math.ceil(metric / 100);
        transportCost = palletsUsed * palletRate;
    } else {
        transportCost = metric * 15;
    }

    return {
      ...po,
      total_goods_value: totalGoodsValue,
      estimated_transport_cost: transportCost,
      total_po_cost: totalGoodsValue + transportCost,
      logistics_mode: mode,
      logistics_metric: metric,
      governing_item: governingItemName,
      target_vendor: suggestedVendor,
      governing_vendor_id: governingVendorId
    };
  };

  // --- ACTIONS ---

  const handleUpdateQty = (poId: string, itemId: string, newQty: number) => {
    setDraftPOs(prev => prev.map(po => {
      if (po.id !== poId) return po;
      const newItems = po.items.map(item => {
        if (item.id !== itemId) return item;
        const safeQty = Math.max(0, newQty);
        return { ...item, order_qty: safeQty, total_value: safeQty * item.unit_cost };
      });
      return recalculatePO({ ...po, items: newItems }, allVendors);
    }));
  };

  const handleRemoveItem = (poId: string, itemId: string) => {
    setDraftPOs(prev => prev.map(po => {
      if (po.id !== poId) return po;
      const newItems = po.items.filter(i => i.id !== itemId);
      return recalculatePO({ ...po, items: newItems }, allVendors);
    }));
  };

  const initiateAddItem = (poId: string, item: InventoryItem, qty: number) => {
    const targetPO = draftPOs.find(p => p.id === poId);
    if (!targetPO) return;

    const currentTotal = targetPO.items.reduce((s, i) => s + i.order_qty, 0);
    const newTotal = currentTotal + qty;
    const currentPallets = Math.floor(currentTotal / 100);
    const newPallets = Math.floor(newTotal / 100);

    if (targetPO.logistics_mode === 'pallet' && newPallets > currentPallets) {
        setAddingItemToPO(null);
        setOverflowData({ poId, item, qty }); 
    } else {
        handleAddItem(poId, item, qty);
    }
  };

  const handleAddItem = (poId: string, item: InventoryItem, qty: number) => {
    setDraftPOs(prev => prev.map(po => {
      if (po.id !== poId) return po;
      if (po.items.find(i => i.id === item.id)) return po;
      
      const newItem: POItem = { 
        ...item, order_qty: qty, total_value: qty * item.unit_cost, is_manual_addition: true 
      };
      const newItems = [...po.items, newItem];
      return recalculatePO({ ...po, items: newItems }, allVendors);
    }));
    setAddingItemToPO(null); 
  };

  const handleCreateNewPO = () => {
    if (!overflowData) return;
    const { poId, item, qty } = overflowData;
    const originalPO = draftPOs.find(p => p.id === poId);

    const newItem: POItem = {
      ...item, order_qty: qty, total_value: qty * item.unit_cost, is_manual_addition: true
    };

    const newPO: DraftPO = {
      id: `draft-manual-${Date.now()}`,
      po_number: `PO-${Date.now().toString().slice(-6)}`,
      target_vendor: originalPO?.target_vendor || null,
      items: [newItem],
      delivery_required_at: '',
      status: 'draft',
      logistics_mode: qty < 50 ? 'box' : 'pallet',
      logistics_metric: qty,
      total_goods_value: 0,
      estimated_transport_cost: 0,
      total_po_cost: 0,
      governing_item: newItem.name,
      governing_vendor_id: originalPO?.governing_vendor_id
    };

    setDraftPOs(prev => [...prev, recalculatePO(newPO, allVendors)]);
    setOverflowData(null);
  };

  const handleCreateManualPO = () => {
    const newPO: DraftPO = {
      id: `draft-new-${Date.now()}`,
      po_number: `PO-${Date.now().toString().slice(-6)}`,
      target_vendor: null,
      items: [],
      delivery_required_at: '',
      status: 'draft',
      logistics_mode: 'box',
      logistics_metric: 0,
      total_goods_value: 0,
      estimated_transport_cost: 0,
      total_po_cost: 0,
      governing_item: '',
      governing_vendor_id: undefined
    };
    setDraftPOs(prev => [newPO, ...prev]);
  };

  const handleAddToSamePO = () => {
    if (!overflowData) return;
    handleAddItem(overflowData.poId, overflowData.item, overflowData.qty);
    setOverflowData(null);
  };

  const toggleLogisticsMode = (poId: string) => {
    setDraftPOs(prev => prev.map(po => {
      if (po.id !== poId) return po;
      const newMode = po.logistics_mode === 'pallet' ? 'box' : 'pallet';
      return recalculatePO({ ...po, logistics_mode: newMode }, allVendors);
    }));
  };

  const handleSaveDraft = (poId: string) => {
    setDraftPOs(prev => prev.map(po => po.id === poId ? { ...po, status: 'saved' } : po));
    alert("PO saved to system.");
  };

  const handleMarkSent = (poId: string) => {
    setDraftPOs(prev => prev.map(po => po.id === poId ? { ...po, status: 'sent' } : po));
    alert("Marked as Sent. Awaiting Invoice.");
  };

  const handleAttachInvoice = (e: React.ChangeEvent<HTMLInputElement>, poId: string) => {
    const file = e.target.files?.[0];
    if (file) {
        // In real app, upload to Supabase Storage here
        setDraftPOs(prev => prev.map(po => po.id === poId ? { ...po, status: 'completed', final_invoice_url: file.name } : po));
        alert("Invoice Attached. PO Completed!");
    }
  };

  const handleVendorChange = (poId: string, vendorId: string) => {
    const vendor = allVendors.find(v => v.id === vendorId) || null;
    setDraftPOs(prev => prev.map(po => po.id === poId ? { ...po, target_vendor: vendor } : po));
  };

  const sendWhatsApp = (po: DraftPO) => {
    const phone = po.target_vendor?.whatsapp_number || po.target_vendor?.contact_phone;
    if (!phone) return alert("No phone/whatsapp for vendor");
    const msg = generatePOMessage(po);
    // Mark as sent automatically when communicating
    handleMarkSent(po.id);
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const sendEmail = (po: DraftPO) => {
    if (!po.target_vendor?.email) return alert("No email for vendor");
    const subject = `Purchase Order ${po.po_number}`;
    const body = generatePOMessage(po);
    handleMarkSent(po.id);
    window.open(`mailto:${po.target_vendor.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const generatePOMessage = (po: DraftPO) => {
    return `PURCHASE ORDER: ${po.po_number}\nTo: ${po.target_vendor?.name}\nTotal Value: $${po.total_po_cost.toFixed(2)}\nDelivery Required: ${po.delivery_required_at ? new Date(po.delivery_required_at).toLocaleString() : 'ASAP'}\n\nITEMS:\n${po.items.map(i => `• ${i.order_qty}x ${i.name} (SKU: ${i.sku})`).join('\n')}`;
  };

  if (loading) return <div className="p-20 text-center text-gray-400"><RefreshCw className="animate-spin inline mr-2"/> Analyzing Inventory...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Truck className="text-blue-600" />
              Restock Command
            </h1>
            <p className="text-gray-500 mt-2">Dynamic vendor routing based on pallet value.</p>
          </div>
          <div className="flex items-center gap-4">
            {draftPOs.filter(p => p.status === 'draft').length > 0 && (
               <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 animate-pulse">
                 <AlertTriangle size={20} />
                 {draftPOs.filter(p => p.status === 'draft').length} POs Pending
               </div>
            )}
            <button 
              onClick={handleCreateManualPO}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition"
            >
              <FilePlus size={20} />
              Create New PO
            </button>
          </div>
        </header>

        <div className="grid gap-8 xl:grid-cols-2">
          {draftPOs.map((po) => (
            <div key={po.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col transition-all ${po.status === 'completed' ? 'opacity-75 grayscale' : po.status === 'sent' ? 'ring-2 ring-blue-400' : po.status === 'saved' ? 'ring-2 ring-green-500' : ''}`}>
              
              {/* HEADER */}
              <div className="p-6 bg-gray-900 text-white">
                <div className="flex justify-between items-start mb-6">
                  
                  {/* Vendor Select */}
                  <div className="flex-1 mr-4">
                    <label className="text-xs text-gray-400 uppercase font-bold block mb-1">Supplier</label>
                    <div className="relative">
                      <select 
                        value={po.target_vendor?.id || ''}
                        onChange={(e) => handleVendorChange(po.id, e.target.value)}
                        className="w-full appearance-none bg-gray-800 border border-gray-700 text-white font-bold text-lg py-2 pl-3 pr-10 rounded-lg focus:ring-2 focus:ring-blue-500"
                        disabled={po.status !== 'draft'}
                      >
                        <option value="" disabled>Select Vendor</option>
                        {/* Intelligent Sorting: Recommended Vendor First */}
                        {[...allVendors].sort((a, b) => {
                            if (a.id === po.governing_vendor_id) return -1;
                            if (b.id === po.governing_vendor_id) return 1;
                            if (a.id === po.target_vendor?.id) return -1;
                            if (b.id === po.target_vendor?.id) return 1;
                            return a.name.localeCompare(b.name);
                        }).map(v => (
                          <option key={v.id} value={v.id}>
                            {v.name} {v.id === po.governing_vendor_id ? '(Recommended)' : ''}
                          </option>
                        ))}
                      </select>
                      {po.status === 'draft' && <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={16} />}
                    </div>
                    {/* Governing Item Info */}
                    {po.status === 'draft' && (
                        <div className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                            Governed by: <span className="text-yellow-400 font-bold">{po.governing_item || 'N/A'}</span>
                            <Info size={10} className="text-gray-500" />
                        </div>
                    )}
                  </div>

                  {/* Financials & Dates */}
                  <div className="text-right">
                    <div className="mb-4">
                      <label className="text-xs text-gray-400 uppercase font-bold block mb-1">Required By</label>
                      <div className="relative">
                        <input 
                          type="datetime-local" 
                          value={po.delivery_required_at}
                          onChange={(e) => setDraftPOs(prev => prev.map(p => p.id === po.id ? { ...p, delivery_required_at: e.target.value } : p))}
                          className="bg-gray-800 border border-gray-700 text-white text-xs py-1 px-2 rounded focus:ring-2 focus:ring-blue-500 w-40 text-right"
                          disabled={po.status !== 'draft'}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                        <div className="flex justify-end items-center gap-2 text-xs text-gray-400">
                            <span>Goods:</span>
                            <span className="font-mono text-white">${po.total_goods_value.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-end items-center gap-2 text-xs text-gray-400">
                            <span>Transport:</span>
                            <span className="font-mono text-yellow-400">+${po.estimated_transport_cost.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-700 mt-1 pt-1 flex justify-end items-center gap-2">
                            <span className="text-xs font-bold text-gray-300">EST. TOTAL</span>
                            <span className="text-xl font-bold text-green-400">${po.total_po_cost.toFixed(2)}</span>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Logistics Mode Switcher & Visualization */}
                <div className="mb-6 bg-gray-800 rounded-lg p-3 border border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <button 
                      onClick={() => po.status === 'draft' && toggleLogisticsMode(po.id)}
                      className={`text-xs font-bold uppercase flex items-center gap-1 bg-gray-900 px-2 py-1 rounded border border-gray-600 transition ${po.status === 'draft' ? 'text-blue-400 hover:text-white hover:border-blue-400' : 'text-gray-500 cursor-default'}`}
                    >
                      {po.logistics_mode === 'pallet' ? <Package size={12}/> : <Box size={12}/>}
                      {po.logistics_mode === 'pallet' ? 'Pallet' : 'Box'} Mode
                    </button>
                    
                    {/* The Metric Display */}
                    <div className="text-right">
                       {po.logistics_mode === 'pallet' ? (
                          <span className={`text-xl font-black ${po.logistics_metric > 100 ? 'text-blue-400' : 'text-green-400'}`}>
                            {po.logistics_metric}%
                          </span>
                       ) : (
                          <span className="text-xl font-black text-yellow-400">
                            ~{po.logistics_metric} Boxes
                          </span>
                       )}
                    </div>
                  </div>

                  {/* Multi-Pallet Visualizer */}
                  {po.logistics_mode === 'pallet' ? (
                    <div className="space-y-1">
                      {Array.from({ length: Math.ceil(po.logistics_metric / 100) || 1 }).map((_, idx) => {
                        const palletNum = idx + 1;
                        const fill = Math.min(100, Math.max(0, po.logistics_metric - (idx * 100)));
                        
                        return (
                          <div key={idx} className="relative h-4 bg-gray-900 rounded-full overflow-hidden border border-gray-600">
                            <div 
                              className={`h-full ${fill >= 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                              style={{ width: `${fill}%` }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white drop-shadow-md">
                              Pallet {palletNum} ({fill}%)
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex gap-1 overflow-hidden">
                       {Array.from({ length: Math.min(10, po.logistics_metric) }).map((_, idx) => (
                         <div key={idx} className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
                       ))}
                       {po.logistics_metric > 10 && <span className="text-xs text-gray-400">+ more</span>}
                    </div>
                  )}
                </div>

                {/* Actions Row */}
                <div className="flex gap-2">
                   {po.status === 'draft' ? (
                     <>
                        <button onClick={() => sendWhatsApp(po)} className="flex-1 bg-green-600 hover:bg-green-500 py-2 rounded font-bold text-sm flex items-center justify-center gap-2"><Send size={14} /> WhatsApp</button>
                        <button onClick={() => sendEmail(po)} className="flex-1 bg-blue-600 hover:bg-blue-500 py-2 rounded font-bold text-sm flex items-center justify-center gap-2"><Mail size={14} /> Email</button>
                        <button onClick={() => setPdfPreviewPO(po)} className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded font-bold text-sm flex items-center justify-center gap-2"><FileText size={14} /> PDF</button>
                     </>
                   ) : po.status === 'sent' ? (
                     <label className="flex-1 bg-purple-600 hover:bg-purple-500 py-2 rounded font-bold text-sm flex items-center justify-center gap-2 cursor-pointer text-white">
                        <Paperclip size={14} /> Attach Final Invoice
                        <input type="file" className="hidden" onChange={(e) => handleAttachInvoice(e, po.id)} accept="application/pdf,image/*" />
                     </label>
                   ) : po.status === 'completed' ? (
                     <div className="flex-1 bg-gray-800 text-gray-400 py-2 rounded font-bold text-sm flex items-center justify-center gap-2 border border-gray-600">
                        <CheckCircle size={14} /> Order Completed
                        {po.final_invoice_url && <span className="text-xs underline ml-2">View Invoice</span>}
                     </div>
                   ) : (
                     // Saved State
                     <button onClick={() => handleMarkSent(po.id)} className="flex-1 bg-orange-600 hover:bg-orange-500 text-white py-2 rounded font-bold text-sm flex items-center justify-center gap-2"><Send size={14} /> Mark as Sent</button>
                   )}
                </div>
              </div>

              {/* ITEMS TABLE */}
              <div className="flex-1 overflow-x-auto bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 border-b">
                    <tr>
                      <th className="p-4 font-medium">Product</th>
                      <th className="p-4 font-medium text-center">Stock</th>
                      <th className="p-4 font-medium text-right">Cost</th>
                      <th className="p-4 font-medium w-24">Ord Qty</th>
                      <th className="p-4 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {po.items.map((item, idx) => {
                      const isConsistent = po.target_vendor ? item.default_vendor_id === po.target_vendor.id : true;
                      return (
                        <tr key={`${item.id}-${idx}`} className={`hover:bg-gray-50 ${!isConsistent ? 'bg-orange-50/50' : ''}`}>
                          <td className="p-4">
                            <div className="font-bold text-gray-900 flex items-center gap-2">
                              {item.name}
                              {!isConsistent && (
                                <AlertTriangle size={12} className="text-orange-500" title="Usually from different vendor"/>
                              )}
                            </div>
                            <div className="text-xs text-gray-400 flex gap-2">
                               <span>{item.sku}</span>
                               {item.is_manual_addition && <span className="text-blue-500 font-bold">• Manual Add</span>}
                            </div>
                          </td>
                          <td className="p-4 text-center">
                             <span className={`inline-flex items-center gap-1 px-2 py-1 rounded font-bold ${item.current_qty <= item.reorder_point ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                               {item.current_qty}
                             </span>
                          </td>
                          <td className="p-4 text-right">
                              <div className="text-gray-900 font-medium">${item.unit_cost.toFixed(2)}</div>
                              <div className="text-xs text-gray-400">Total: ${item.total_value.toFixed(2)}</div>
                          </td>
                          <td className="p-4">
                            <input 
                              type="number" 
                              value={item.order_qty}
                              onChange={(e) => handleUpdateQty(po.id, item.id, parseInt(e.target.value) || 0)}
                              className="w-20 font-mono font-bold text-gray-900 bg-gray-100 px-2 py-2 rounded text-center border focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-200 disabled:text-gray-500"
                              disabled={po.status !== 'draft'}
                            />
                          </td>
                          <td className="p-4">
                            {po.status === 'draft' && (
                                <button onClick={() => handleRemoveItem(po.id, item.id)} className="text-gray-400 hover:text-red-500 transition">
                                <Trash2 size={16} />
                                </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* FOOTER */}
              <div className="p-3 bg-gray-50 border-t flex justify-between items-center">
                <button 
                  onClick={() => po.status === 'draft' && setAddingItemToPO(po.id)}
                  disabled={po.status !== 'draft'}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <Plus size={14}/> Add Non-Restock Item
                </button>
                
                {po.status === 'draft' && (
                    <button 
                    onClick={() => handleSaveDraft(po.id)}
                    className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded transition bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                    <Save size={14}/> Save Draft
                    </button>
                )}
                {po.status !== 'draft' && (
                    <span className="text-xs font-bold text-gray-400 uppercase">{po.status}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* --- MODAL: OVERFLOW DECISION --- */}
        {overflowData && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 text-blue-600 mb-4">
                <Layers size={32} />
                <h3 className="font-bold text-xl">Pallet Capacity Reached</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Adding <b>{overflowData.qty}x {overflowData.item.name}</b> will exceed the current pallet capacity.
                <br/><br/>
                Do you want to create a second pallet within this PO, or start a new PO?
              </p>

              <div className="grid gap-3">
                <button 
                  onClick={handleAddToSamePO}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-between"
                >
                  <span>Add to Same PO</span>
                  <span className="text-xs bg-blue-800 px-2 py-1 rounded">Creates Pallet 2</span>
                </button>
                
                <button 
                  onClick={handleCreateNewPO}
                  className="bg-white border-2 border-gray-200 hover:border-gray-400 text-gray-700 font-bold py-3 px-4 rounded-lg flex items-center justify-between"
                >
                  <span>Create New PO</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">Separate Order</span>
                </button>
              </div>
              
              <button 
                onClick={() => setOverflowData(null)}
                className="mt-4 w-full text-center text-gray-400 text-xs font-bold hover:text-gray-600"
              >
                Cancel Addition
              </button>
            </div>
          </div>
        )}

        {/* --- MODAL: ADD ITEM SEARCH --- */}
        {addingItemToPO && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6">
              <h3 className="font-bold text-lg mb-4">Add Item to {draftPOs.find(p=>p.id===addingItemToPO)?.logistics_mode === 'pallet' ? 'Pallet' : 'Delivery'}</h3>
              <input 
                type="text" 
                placeholder="Search catalog..." 
                className="w-full border p-2 rounded mb-4"
                onChange={(e) => setItemSearchTerm(e.target.value)}
              />
              <div className="max-h-60 overflow-y-auto space-y-2 border rounded p-2 mb-4">
                {allInventory
                  .filter(i => i.name.toLowerCase().includes(itemSearchTerm.toLowerCase()))
                  .map(item => (
                    <div key={item.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded border-b last:border-0">
                      <div>
                         <div className="font-bold text-sm">{item.name}</div>
                         <div className="text-xs text-gray-400">Stock: {item.current_qty} | Cost: ${item.unit_cost}</div>
                      </div>
                      <button 
                        onClick={() => initiateAddItem(addingItemToPO, item, 10)} 
                        className="bg-black text-white px-3 py-1 rounded text-xs font-bold"
                      >
                        Add
                      </button>
                    </div>
                ))}
              </div>
              <button onClick={() => setAddingItemToPO(null)} className="w-full bg-gray-200 font-bold py-2 rounded">Cancel</button>
            </div>
          </div>
        )}

        {/* --- MODAL: PDF PREVIEW --- */}
        {pdfPreviewPO && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
             <div className="bg-white w-[21cm] min-h-[29.7cm] p-12 shadow-2xl overflow-y-auto max-h-[90vh] text-black">
                
                {/* Header Row */}
                <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-8">
                  <div>
                    <h1 className="text-5xl font-black tracking-tighter text-gray-900 mb-2">PURCHASE ORDER</h1>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Original Document</div>
                  </div>
                  <div className="text-right">
                    <h2 className="text-2xl font-bold text-gray-800">{pdfPreviewPO.po_number}</h2>
                    <div className="text-sm text-gray-600 mt-1">Date: {new Date().toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Company Addresses */}
                <div className="grid grid-cols-2 gap-12 mb-10">
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Vendor (Seller)</h3>
                        <div className="font-bold text-lg text-gray-900">{pdfPreviewPO.target_vendor?.name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                            {pdfPreviewPO.target_vendor?.email}<br/>
                            {pdfPreviewPO.target_vendor?.contact_phone || 'No Phone Listed'}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ship To (Buyer)</h3>
                        <div className="font-bold text-lg text-gray-900">{STORE_DETAILS.name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                            {STORE_DETAILS.address}<br/>
                            {STORE_DETAILS.city_state_zip}<br/>
                            {STORE_DETAILS.phone}
                        </div>
                    </div>
                </div>

                {/* Order Details Bar */}
                <div className="grid grid-cols-4 gap-4 mb-8 bg-gray-50 border-y border-gray-200 py-4">
                    <div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase">Receiving POC</div>
                        <div className="text-sm font-bold text-gray-800">{STORE_DETAILS.poc_name}</div>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase">Shipping Method</div>
                        <div className="text-sm font-bold text-gray-800">{pdfPreviewPO.logistics_mode.toUpperCase()} FREIGHT</div>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase">Delivery Required</div>
                        <div className="text-sm font-bold text-red-600">
                            {pdfPreviewPO.delivery_required_at ? new Date(pdfPreviewPO.delivery_required_at).toLocaleString() : 'ASAP'}
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase">Tax ID</div>
                        <div className="text-sm font-bold text-gray-800">{STORE_DETAILS.tax_id}</div>
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
                    {pdfPreviewPO.items.map((item, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="py-4">
                            <div className="font-bold text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-500 font-mono mt-0.5">SKU: {item.sku}</div>
                        </td>
                        <td className="py-4 text-right text-sm text-gray-600">${item.unit_cost.toFixed(2)}</td>
                        <td className="py-4 text-right font-bold text-gray-900">{item.order_qty}</td>
                        <td className="py-4 text-right font-bold text-gray-900">${item.total_value.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end mb-12">
                    <div className="w-1/2 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-bold">${pdfPreviewPO.total_goods_value.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Estimated Shipping</span>
                            <span className="font-bold">${pdfPreviewPO.estimated_transport_cost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-black border-t-2 border-black pt-2 mt-2">
                            <span>Total</span>
                            <span>${pdfPreviewPO.total_po_cost.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Terms & Signature */}
                <div className="grid grid-cols-2 gap-12 pt-8 border-t-2 border-gray-200">
                    <div className="text-xs text-gray-500">
                        <h4 className="font-bold text-gray-700 mb-2">Terms & Conditions</h4>
                        <p>1. Payment due within 30 days of invoice.</p>
                        <p>2. Please notify us immediately if you are unable to ship as specified.</p>
                    </div>
                    <div className="text-center">
                        <div className="border-b border-black mb-2 h-12"></div>
                        <div className="text-xs font-bold text-gray-400 uppercase">Authorized Signature</div>
                    </div>
                </div>

                <button onClick={() => setPdfPreviewPO(null)} className="mt-12 w-full bg-black text-white font-bold py-4 rounded hover:bg-gray-800 uppercase tracking-widest text-sm">Close Document</button>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}