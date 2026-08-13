'use client';
import { useState, useEffect } from 'react';
import { Search, UserPlus, X, Phone, Mail, Award, Check } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { CustomerData } from './cart-panel';
import { toast } from 'sonner';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCustomer: (customer: CustomerData | null) => void;
  selectedCustomer: CustomerData | null;
}

export default function CustomerModal({
  isOpen,
  onClose,
  onSelectCustomer,
  selectedCustomer,
}: CustomerModalProps) {
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form for new customer
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    async function loadCustomers() {
      setLoading(true);
      try {
        const data = await apiClient.get(`/customers?search=${encodeURIComponent(search)}`);
        setCustomers(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error('Failed to load customers', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadCustomers();
    }, 300);

    return () => clearTimeout(timer);
  }, [isOpen, search]);

  if (!isOpen) return null;

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const newCust = await apiClient.post('/customers', {
        name: name.trim(),
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
      });

      toast.success(`Customer ${newCust.name} created!`);
      onSelectCustomer(newCust);
      setIsCreating(false);
      setName('');
      setPhone('');
      setEmail('');
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create customer');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isCreating ? 'Register New Customer' : 'Select Customer'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isCreating ? 'Add customer to loyalty program' : 'Link sale to a customer profile'}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X size={20} />
          </button>
        </div>

        {isCreating ? (
          /* Create Customer Form */
          <form onSubmit={handleCreateCustomer} className="p-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Full Name *</label>
              <input
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Phone Number</label>
              <input
                type="tel"
                placeholder="(555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Email Address</label>
              <input
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold"
              >
                Back to Search
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
              >
                Save & Attach
              </button>
            </div>
          </form>
        ) : (
          /* Search & Select Customer List */
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-4 border-b border-slate-100 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search customer by name, phone, or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                />
              </div>
              <button
                onClick={() => setIsCreating(true)}
                className="px-3.5 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <UserPlus size={16} /> New
              </button>
            </div>

            {/* Quick Walk-In Option */}
            <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/50">
              <button
                onClick={() => {
                  onSelectCustomer(null);
                  onClose();
                }}
                className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  selectedCustomer === null
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span className="text-xs">Walk-in Guest (Anonymous Sale)</span>
                {selectedCustomer === null && <Check size={16} className="text-indigo-600" />}
              </button>
            </div>

            {/* Customers List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {loading ? (
                <p className="text-xs text-center py-8 text-slate-400">Searching customers...</p>
              ) : customers.length === 0 ? (
                <p className="text-xs text-center py-8 text-slate-400">No customers found</p>
              ) : (
                customers.map((c) => {
                  const isSelected = selectedCustomer?.id === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        onSelectCustomer(c);
                        onClose();
                      }}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-indigo-200'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-bold">{c.name}</div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          {c.phone && (
                            <span className="flex items-center gap-1">
                              <Phone size={12} /> {c.phone}
                            </span>
                          )}
                          {c.email && (
                            <span className="flex items-center gap-1">
                              <Mail size={12} /> {c.email}
                            </span>
                          )}
                          {c.loyaltyPoints !== undefined && (
                            <span className="flex items-center gap-1 text-amber-600 font-semibold">
                              <Award size={12} /> {c.loyaltyPoints} pts
                            </span>
                          )}
                        </div>
                      </div>
                      {isSelected && <Check size={18} className="text-indigo-600" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
