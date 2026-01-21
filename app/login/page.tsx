'use client';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import {
  Store, Truck, Lock, Mail, User, ArrowRight, Loader2, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'retailer' | 'supplier'>('retailer');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');

  // --- ACTIONS ---

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (mode === 'signup') {

        // Prepare registration data
        // Note: The simple landing page form doesn't ask for subdomain/fullname
        // We will generate them for now to satisfy the API contract
        const registrationData = {
          storeName: companyName,
          email: email,
          password: password,
          fullName: email.split('@')[0], // derived
          // Generate a simple subdomain from company name
          subdomain: companyName.toLowerCase().replace(/[^a-z0-9]/g, '') + '-' + Math.floor(Math.random() * 1000)
        };

        await apiClient.registerTenant(registrationData);
        setMessage('Account created! Logging you in...');

        // Auto login after signup
        const loginData = await apiClient.login(email, password);
        handleLoginSuccess(loginData);

      } else {
        // Log In
        const loginData = await apiClient.login(email, password);
        handleLoginSuccess(loginData);
      }
    } catch (error: any) {
      console.error(error);
      const msg = error.message || 'Authentication failed';
      setMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (loginData: any) => {
    // Redirect based on role
    // In a real app, the token stores the role, but for this UI we check the user_role returned
    if (loginData.user_role === 'retailer' || loginData.user_role === 'admin') {
      router.push('/admin');
    } else if (loginData.user_role === 'supplier') {
      router.push('/supplier');
    } else if (loginData.user_role === 'superadmin') {
      router.push('/super-admin');
    } else {
      // Default/Customer
      router.push('/shop');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-5xl h-[600px] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* LEFT: BRANDING SIDE */}
        <div className={`w-full md:w-1/2 p-12 text-white flex flex-col justify-between transition-colors duration-500 ${role === 'retailer' ? 'bg-blue-600' : 'bg-purple-900'}`}>
          <div>
            <div className="font-black text-3xl tracking-tight flex items-center gap-2 mb-6">
              {role === 'retailer' ? <Store size={32} /> : <Truck size={32} />}
              {role === 'retailer' ? 'RETAIL' : 'SUPPLY'}
              <span className="text-white/50">OS</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              {role === 'retailer'
                ? "Run your store like a tech giant."
                : "Connect with thousands of local retailers."}
            </h1>
            <p className="text-lg opacity-80">
              {role === 'retailer'
                ? "Inventory, Restock, and Sales—all in one place."
                : "Manage inventory, receive POs, and get paid faster."}
            </p>
          </div>

          <div className="space-y-4 hidden md:block">
            <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="bg-white/20 p-2 rounded-full"><CheckCircle size={20} /></div>
              <div>
                <div className="font-bold">Real-time Sync</div>
                <div className="text-sm opacity-80">Always know what's in stock.</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="bg-white/20 p-2 rounded-full"><CheckCircle size={20} /></div>
              <div>
                <div className="font-bold">{role === 'retailer' ? 'AI Restocking' : 'Smart POs'}</div>
                <div className="text-sm opacity-80">{role === 'retailer' ? 'Never run out of best-sellers.' : 'Automated proforma invoices.'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: FORM SIDE */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center relative">

          {/* Role Switcher (Top Right) */}
          <div className="absolute top-8 right-8 flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setRole('retailer')}
              type="button"
              className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${role === 'retailer' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
            >
              Retailer
            </button>
            <button
              onClick={() => setRole('supplier')}
              type="button"
              className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${role === 'supplier' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500'}`}
            >
              Supplier
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-500 text-sm">
              {mode === 'login' ? 'Enter your credentials to access your dashboard.' : 'Start your digital transformation journey today.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Business Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    required
                    placeholder={role === 'retailer' ? "Bob's Market" : "Global Distributors Inc."}
                    className="w-full border-gray-200 bg-gray-50 border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="w-full border-gray-200 bg-gray-50 border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full border-gray-200 bg-gray-50 border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-xs font-bold ${message.includes('created') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition hover:shadow-lg ${role === 'retailer' ? 'bg-black hover:bg-gray-800' : 'bg-purple-600 hover:bg-purple-700'}`}
            >
              {loading ? <Loader2 className="animate-spin" /> : (mode === 'login' ? 'Sign In' : 'Create Account')}
              {!loading && <ArrowRight size={18} />}
            </button>

          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage(''); }}
              className={`font-bold hover:underline ${role === 'retailer' ? 'text-blue-600' : 'text-purple-600'}`}
            >
              {mode === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}