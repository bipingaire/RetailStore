'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Bot, Play, Pause, RefreshCw, Terminal, CheckCircle, 
  AlertTriangle, ArrowLeft, Database, Globe, Image as ImageIcon 
} from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type AgentLog = {
  id: string;
  time: string;
  type: 'info' | 'success' | 'error' | 'action';
  message: string;
};

type QueueItem = {
  id: string;
  name: string;
  upc_ean: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
};

export default function AgentPage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [currentProduct, setCurrentProduct] = useState<any>(null); // Visual feedback
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const stopRef = useRef(false); // Ref to break the loop instantly

  // 1. Load the Queue (Products needing enrichment)
  useEffect(() => {
    fetchQueue();
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (type: AgentLog['type'], message: string) => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36),
      time: new Date().toLocaleTimeString(),
      type,
      message
    }]);
  };

  const fetchQueue = async () => {
    addLog('info', 'Scanning database for unenriched products...');
    const { data, error } = await supabase
      .from('global_products')
      .select('id, name, upc_ean')
      .is('ai_enriched_at', null)
      .order('created_at', { ascending: false })
      .limit(50); // Batch size

    if (error) {
      addLog('error', `Database Error: ${error.message}`);
      return;
    }

    if (data) {
      setQueue(data.map(p => ({ ...p, status: 'pending' })));
      addLog('success', `Queue populated with ${data.length} items.`);
    }
  };

  // --- THE AGENT LOOP ---
  const startAgent = async () => {
    if (queue.length === 0) {
      alert("Queue is empty! Fetch more items.");
      return;
    }

    setIsRunning(true);
    stopRef.current = false;
    addLog('action', 'Agent started. Initializing web crawlers...');

    // Process queue sequentially
    for (let i = 0; i < queue.length; i++) {
      if (stopRef.current) {
        addLog('info', 'Agent paused by user.');
        break;
      }

      const item = queue[i];
      if (item.status === 'completed') continue; // Skip already done

      // Update UI to show processing
      setQueue(prev => prev.map(p => p.id === item.id ? { ...p, status: 'processing' } : p));
      setCurrentProduct(item);
      addLog('info', `Processing: ${item.name} (${item.upc_ean || 'No UPC'})...`);

      try {
        // CALL THE ENRICHMENT API
        const response = await fetch('/api/ai/enrich-product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            productName: item.name,
            upc: item.upc_ean 
          })
        });

        const json = await response.json();

        if (!json.success) throw new Error(json.error);

        const enrichedData = json.data;
        addLog('success', `Found data for ${item.name}.`);
        addLog('info', `  > Mfg: ${enrichedData.manufacturer}`);
        addLog('info', `  > Net Wt: ${enrichedData.net_weight} (${enrichedData.uom})`);
        if (enrichedData.allergens) addLog('info', `  > Allergens: ${enrichedData.allergens}`);

        // Update Database with NEW FIELDS
        const { error: dbError } = await supabase
          .from('global_products')
          .update({
            manufacturer: enrichedData.manufacturer,
            description: enrichedData.description,
            category: enrichedData.category,
            subcategory: enrichedData.subcategory,
            target_demographic: enrichedData.target_demographic,
            net_weight: enrichedData.net_weight, // New
            ingredients: enrichedData.ingredients, // New
            allergens: enrichedData.allergens, // New
            storage_instructions: enrichedData.storage_instructions, // New
            nutrients_json: enrichedData.nutrients_json,
            image_url: enrichedData.image_url,
            source_url: enrichedData.source_url,
            uom: enrichedData.uom,
            pack_quantity: enrichedData.pack_quantity,
            ai_enriched_at: new Date().toISOString()
          })
          .eq('id', item.id);

        if (dbError) throw dbError;

        // Mark Success in UI
        setQueue(prev => prev.map(p => p.id === item.id ? { ...p, status: 'completed' } : p));
        setProcessedCount(prev => prev + 1);
        addLog('success', `Database updated successfully.`);

      } catch (err: any) {
        console.error(err);
        setQueue(prev => prev.map(p => p.id === item.id ? { ...p, status: 'failed' } : p));
        addLog('error', `Failed to enrich ${item.name}: ${err.message}`);
      }
      
      // Artificial delay to prevent rate limiting & allow visual feedback
      await new Promise(r => setTimeout(r, 1500));
    }

    setIsRunning(false);
    setCurrentProduct(null);
    addLog('action', 'Batch complete. Agent entering standby mode.');
  };

  const stopAgent = () => {
    stopRef.current = true;
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-6 flex flex-col">
      
      {/* HEADER */}
      <header className="flex justify-between items-center mb-6 border-b border-green-900 pb-4">
        <div className="flex items-center gap-4">
           <Link href="/super-admin" className="p-2 hover:bg-green-900/30 rounded transition">
             <ArrowLeft size={20} />
           </Link>
           <div>
             <h1 className="text-2xl font-bold flex items-center gap-2">
               <Bot className="text-green-400" /> CRAWLER_AGENT_V2
             </h1>
             <p className="text-xs text-green-700">Autonomous Product Enrichment System</p>
           </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right">
             <div className="text-xs text-green-700">STATUS</div>
             <div className={`font-bold ${isRunning ? 'animate-pulse text-green-400' : 'text-red-500'}`}>
               {isRunning ? 'RUNNING' : 'STANDBY'}
             </div>
           </div>
           <div className="h-8 w-px bg-green-900"></div>
           <div className="text-right">
             <div className="text-xs text-green-700">PROCESSED</div>
             <div className="font-bold text-white">{processedCount} / {queue.length}</div>
           </div>
        </div>
      </header>

      {/* MAIN CONSOLE GRID */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* LEFT: QUEUE */}
        <div className="col-span-3 bg-gray-900 rounded-lg border border-green-900/50 flex flex-col overflow-hidden">
          <div className="p-3 bg-green-900/20 border-b border-green-900/50 flex justify-between items-center">
            <span className="text-xs font-bold">EXECUTION_QUEUE</span>
            <button onClick={fetchQueue} className="hover:text-white transition"><RefreshCw size={14}/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {queue.length === 0 && <div className="text-xs text-green-800 text-center py-4">No pending items.</div>}
            {queue.map(item => (
              <div key={item.id} className={`p-2 rounded text-xs flex justify-between items-center ${item.status === 'processing' ? 'bg-green-900/40 border border-green-700' : 'hover:bg-green-900/10'}`}>
                <span className="truncate max-w-[150px]">{item.name}</span>
                {item.status === 'pending' && <span className="text-green-800">WAIT</span>}
                {item.status === 'processing' && <RefreshCw size={12} className="animate-spin text-green-400"/>}
                {item.status === 'completed' && <CheckCircle size={12} className="text-green-500"/>}
                {item.status === 'failed' && <AlertTriangle size={12} className="text-red-500"/>}
              </div>
            ))}
          </div>
        </div>

        {/* MIDDLE: VISUALIZER */}
        <div className="col-span-5 flex flex-col gap-6">
           
           {/* Current Task */}
           <div className="bg-gray-900 rounded-lg border border-green-900/50 p-6 flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden">
              {/* Background Grid Animation */}
              <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle, #22c55e 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
              
              {currentProduct ? (
                <div className="relative z-10 w-full">
                   <div className="w-24 h-24 mx-auto bg-black border border-green-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                     <Globe className="animate-pulse" size={40} />
                   </div>
                   <h2 className="text-xl font-bold text-white mb-2">{currentProduct.name}</h2>
                   <div className="text-xs text-green-600 font-mono mb-6">Scanning global databases...</div>
                   
                   <div className="grid grid-cols-2 gap-4 text-left max-w-xs mx-auto text-xs">
                      <div className="bg-black p-2 rounded border border-green-900">
                        <span className="text-green-700 block mb-1">SOURCE</span>
                        <span className="text-white animate-pulse">Fetching...</span>
                      </div>
                      <div className="bg-black p-2 rounded border border-green-900">
                         <span className="text-green-700 block mb-1">DATA POINTS</span>
                         <span className="text-white animate-pulse">Extracting...</span>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="text-green-800">
                  <Bot size={64} className="mx-auto mb-4 opacity-50"/>
                  <p>AGENT IS IDLE</p>
                  <p className="text-xs mt-2">Press START to begin batch processing.</p>
                </div>
              )}
           </div>

           {/* Controls */}
           <div className="bg-gray-900 rounded-lg border border-green-900/50 p-4 flex gap-4">
             {!isRunning ? (
               <button onClick={startAgent} className="flex-1 bg-green-700 hover:bg-green-600 text-black font-bold py-3 rounded flex items-center justify-center gap-2 transition">
                 <Play size={18} /> START BATCH
               </button>
             ) : (
               <button onClick={stopAgent} className="flex-1 bg-red-900/50 hover:bg-red-900 text-red-500 font-bold py-3 rounded flex items-center justify-center gap-2 transition border border-red-900">
                 <Pause size={18} /> PAUSE / STOP
               </button>
             )}
           </div>

        </div>

        {/* RIGHT: TERMINAL LOGS */}
        <div className="col-span-4 bg-black border border-green-900 rounded-lg flex flex-col font-mono text-xs">
          <div className="p-2 bg-green-900/20 border-b border-green-900 flex items-center gap-2">
            <Terminal size={12} /> SYSTEM_LOGS
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 h-[400px]">
            {logs.map(log => (
              <div key={log.id} className="flex gap-2">
                <span className="text-green-800 shrink-0">[{log.time}]</span>
                <span className={
                  log.type === 'error' ? 'text-red-500' : 
                  log.type === 'success' ? 'text-green-400' : 
                  log.type === 'action' ? 'text-yellow-500 font-bold' : 
                  'text-green-600'
                }>
                  {log.type === 'action' && '> '}
                  {log.message}
                </span>
              </div>
            ))}
            {logs.length === 0 && <span className="text-green-900 italic">...waiting for input...</span>}
          </div>
        </div>

      </div>
    </div>
  );
}