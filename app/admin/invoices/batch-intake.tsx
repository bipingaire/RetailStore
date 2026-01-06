'use client';
import { useState } from 'react';
import { Calendar, CheckCircle, AlertCircle } from 'lucide-react';

export default function BatchIntakeModal({ extractedItems, onCommit }: any) {
  const [items, setItems] = useState(extractedItems);

  // Helper to quick-set date
  const setExpiry = (index: number, daysToAdd: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    updateItem(index, 'expiry', date.toISOString().split('T')[0]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6" /> 
            Set Expiry Dates
          </h2>
          <p className="opacity-90">Verify the shelf life before adding to inventory.</p>
        </div>

        {/* Scrollable List */}
        <div className="overflow-y-auto flex-1 p-6">
          <table className="w-full text-left border-collapse">
            <thead className="text-sm text-gray-500 sticky top-0 bg-white">
              <tr>
                <th className="py-2">Item Name</th>
                <th className="py-2 w-24">Qty</th>
                <th className="py-2 w-48">Expiry Date</th>
                <th className="py-2 w-40">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item: any, idx: number) => (
                <tr key={idx} className="group hover:bg-gray-50">
                  <td className="py-4 pr-4">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-400">{item.sku || 'New Item'}</div>
                  </td>
                  <td className="py-4">
                    <input 
                      type="number" 
                      value={item.qty}
                      onChange={(e) => updateItem(idx, 'qty', e.target.value)}
                      className="w-16 border rounded p-1 text-center bg-gray-50"
                    />
                  </td>
                  <td className="py-4">
                    <input 
                      type="date" 
                      value={item.expiry || ''}
                      onChange={(e) => updateItem(idx, 'expiry', e.target.value)}
                      className={`w-full border rounded p-2 ${!item.expiry ? 'border-red-300 ring-2 ring-red-50' : 'border-gray-300'}`}
                    />
                  </td>
                  <td className="py-4">
                    <div className="flex gap-1">
                      <button onClick={() => setExpiry(idx, 7)} className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100">+7d</button>
                      <button onClick={() => setExpiry(idx, 30)} className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100">+30d</button>
                      <button onClick={() => setExpiry(idx, 365)} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200">+1y</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {items.filter((i: any) => !i.expiry).length} items missing expiry dates
          </div>
          <button 
            onClick={() => onCommit(items)}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
          >
            <CheckCircle className="w-5 h-5" />
            Confirm & Stock Items
          </button>
        </div>

      </div>
    </div>
  );
}