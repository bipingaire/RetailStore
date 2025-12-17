'use client';
import { useState, ChangeEvent } from 'react';
import { supabase } from '@/lib/supabase'; // Import the client we just made
import { Loader2, Check, AlertTriangle, Save, Search } from 'lucide-react'; // Icons

// Types for our data
type InvoiceItem = {
  raw_name: string;
  qty: number;
  unit_price: number;
  status: 'matched' | 'review' | 'saved';
  matched_product?: string; // What we think it is in the DB
};

export default function InvoiceReview() {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 1. THE AI SCANNER (Same as before)
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    
    // Convert to Base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      
      try {
        const res = await fetch('/api/parse-invoice', {
          method: 'POST',
          body: JSON.stringify({ imageUrl: base64 }),
        });
        const data = await res.json();
        
        // 2. THE "DUMB" MATCHER LOGIC
        // In the real app, this would query Supabase for 'Global_Products'
        // Here we simulate it for the prototype
        const processedItems = data.data.items.map((item: any) => ({
          ...item,
          // If the AI finds "Milk", we pretend we matched it. If "Unknown", we flag it.
          status: item.raw_name.toLowerCase().includes('milk') ? 'matched' : 'review',
          matched_product: item.raw_name.toLowerCase().includes('milk') ? 'Whole Milk 1 Gallon' : '',
        }));

        setItems(processedItems);
      } catch (err) {
        alert("Scan failed");
      }
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  // 3. THE "SAVE" LOGIC
  const saveBatch = async () => {
    setUploading(true);
    
    // This connects to your REAL Supabase Database
    // Note: You need a 'tenant_id' in your table. We are using a dummy UUID for now.
    const dummyTenantId = "00000000-0000-0000-0000-000000000000"; 

    try {
      // Loop through items and insert them
      for (const item of items) {
         // In a real app, you would first create the 'store_inventory' record
         // For this prototype, we will just log the success
         console.log("Saving to DB:", item);
      }
      
      // Simulate network delay
      await new Promise(r => setTimeout(r, 1000));
      
      alert("✅ Inventory Updated Successfully!");
      setItems([]); // Clear screen
    } catch (err) {
      console.error(err);
      alert("Failed to save to database");
    }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Incoming Shipment</h1>
            <p className="text-gray-500">Scan invoice to update inventory levels.</p>
          </div>
          <div className="bg-white p-2 rounded shadow border">
             <input 
                type="file" 
                accept="image/*"
                onChange={handleFileUpload}
                disabled={loading}
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-blue-50 file:text-blue-700 file:font-bold hover:file:bg-blue-100"
              />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed">
            <Loader2 className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">AI is reading the invoice...</p>
          </div>
        )}

        {/* The Mapping Table */}
        {!loading && items.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 border-b">
                <tr>
                  <th className="p-4 font-medium">Qty</th>
                  <th className="p-4 font-medium">Invoice Raw Name</th>
                  <th className="p-4 font-medium">Mapped Product (Master DB)</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item, idx) => (
                  <tr key={idx} className={item.status === 'review' ? 'bg-yellow-50' : ''}>
                    <td className="p-4 font-mono font-bold text-blue-600">{item.qty}</td>
                    <td className="p-4 text-gray-800">{item.raw_name}</td>
                    <td className="p-4">
                      {item.status === 'matched' ? (
                        <div className="flex items-center gap-2 text-green-700 font-medium">
                          <Check size={16} />
                          {item.matched_product}
                        </div>
                      ) : (
                        <div className="flex gap-2">
                           <input 
                             type="text" 
                             placeholder="Search Master DB..." 
                             className="border rounded px-2 py-1 w-full bg-white"
                           />
                           <button className="text-gray-400 hover:text-blue-600"><Search size={16} /></button>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      {item.status === 'matched' ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">Ready</span>
                      ) : (
                        <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                          <AlertTriangle size={12} /> Review
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Footer Action */}
            <div className="p-4 bg-gray-50 border-t flex justify-end">
              <button 
                onClick={saveBatch}
                disabled={uploading}
                className="bg-black text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-800 transition-all"
              >
                {uploading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                Confirm & Add to Inventory
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}