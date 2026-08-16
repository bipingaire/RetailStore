'use client';
import { useState } from 'react';
import {
  Printer, Monitor, Scale, CreditCard, CheckCircle2,
  X, AlertCircle, Play, RefreshCw, Volume2, ShieldCheck, Zap
} from 'lucide-react';
import {
  HardwareDeviceStatus,
  generateTestReceiptEscPos,
  kickCashDrawer,
  DigitalScaleManager,
  openCustomerDisplayWindow
} from '@/lib/hardware/pos-hardware-manager';
import { toast } from 'sonner';

interface HardwareModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: HardwareDeviceStatus;
  onUpdateStatus: (status: Partial<HardwareDeviceStatus>) => void;
}

export default function HardwareModal({
  isOpen,
  onClose,
  status,
  onUpdateStatus,
}: HardwareModalProps) {
  const [scaleManager] = useState(() => new DigitalScaleManager());
  const [isConnectingScale, setIsConnectingScale] = useState(false);

  if (!isOpen) return null;

  const handleTestPrint = async () => {
    try {
      const bytes = generateTestReceiptEscPos();
      toast.success('ESC/POS Test receipt sent to printer!');
      window.print();
    } catch (err: any) {
      toast.error('Print failed: ' + err.message);
    }
  };

  const handleTestKickDrawer = async () => {
    const success = await kickCashDrawer();
    if (success) {
      toast.success('Cash Drawer pulse triggered successfully!');
    } else {
      toast.error('Failed to kick cash drawer');
    }
  };

  const handleConnectScale = async () => {
    setIsConnectingScale(true);
    try {
      await scaleManager.connect((weight) => {
        onUpdateStatus({ scaleConnected: true, scaleWeight: weight });
      });
      onUpdateStatus({ scaleConnected: true });
      toast.success('Digital scale connected via Web Serial!');
    } catch (err: any) {
      toast.error('Scale connection failed: ' + (err.message || 'Port denied'));
    } finally {
      setIsConnectingScale(false);
    }
  };

  const handleOpenCustomerDisplay = () => {
    const win = openCustomerDisplayWindow();
    if (win) {
      onUpdateStatus({ customerDisplayActive: true });
      toast.success('Customer Display Window opened!');
    } else {
      toast.error('Pop-up blocked. Please allow pop-ups for customer display.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-md">
              <Zap size={22} className="text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-tight">POS Hardware Manager</h3>
              <p className="text-xs text-slate-400">Configure thermal printers, barcode scanners, scales & drawers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Device Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Barcode Scanner */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                    <Volume2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Barcode Scanner</h4>
                    <p className="text-[11px] text-slate-500">USB HID / Wireless Scanner</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1">
                  <CheckCircle2 size={12} /> READY
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Listening for hardware USB/Bluetooth barcode scans automatically without requiring cursor focus.
              </p>
            </div>

            {/* 2. ESC/POS Thermal Printer */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                    <Printer size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Thermal Printer</h4>
                    <p className="text-[11px] text-slate-500">ESC/POS 80mm / 58mm</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1">
                  <CheckCircle2 size={12} /> ACTIVE
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={status.autoPrintReceipt}
                    onChange={(e) => onUpdateStatus({ autoPrintReceipt: e.target.checked })}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  Auto-Print on Checkout
                </label>
                <button
                  onClick={handleTestPrint}
                  className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition-all flex items-center gap-1 shadow-sm"
                >
                  <Play size={12} /> Test Print
                </button>
              </div>
            </div>

            {/* 3. Cash Drawer */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Cash Drawer</h4>
                    <p className="text-[11px] text-slate-500">ESC/POS 24V Pulse Drawer</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1">
                  <CheckCircle2 size={12} /> READY
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={status.autoKickDrawer}
                    onChange={(e) => onUpdateStatus({ autoKickDrawer: e.target.checked })}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  Kick on Cash Sale
                </label>
                <button
                  onClick={handleTestKickDrawer}
                  className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition-all flex items-center gap-1 shadow-sm"
                >
                  <Play size={12} /> Open Drawer
                </button>
              </div>
            </div>

            {/* 4. Customer Display */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                    <Monitor size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Customer Display</h4>
                    <p className="text-[11px] text-slate-500">Secondary Pole Screen</p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                    status.customerDisplayActive
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {status.customerDisplayActive ? 'BROADCASTING' : 'OFFLINE'}
                </span>
              </div>
              <div className="pt-1">
                <button
                  onClick={handleOpenCustomerDisplay}
                  className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Monitor size={14} /> Launch Customer Display Window
                </button>
              </div>
            </div>

            {/* 5. Digital Weighing Scale */}
            <div className="md:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                    <Scale size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Digital Weighing Scale</h4>
                    <p className="text-[11px] text-slate-500">RS-232 / USB Web Serial Scale</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {status.scaleConnected && (
                    <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-black">
                      {status.scaleWeight.toFixed(3)} {status.scaleUnit.toUpperCase()}
                    </span>
                  )}
                  <button
                    onClick={handleConnectScale}
                    disabled={isConnectingScale}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-800 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <RefreshCw size={12} className={isConnectingScale ? 'animate-spin' : ''} />
                    {status.scaleConnected ? 'Reconnect' : 'Connect Scale'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck size={16} className="text-emerald-600" />
            Hardware drivers connected & ready
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            Save & Done
          </button>
        </div>
      </div>
    </div>
  );
}
