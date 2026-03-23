"use client";

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_shoes_tracked: 0,
    active_locks: 0,
    expired_violators: 0,
    sold_out_count: 0
  });
  
  // Sweep State
  const [isSweeping, setIsSweeping] = useState(false);
  const [sweepLog, setSweepLog] = useState<string | null>(null);

  // New Product State
  const [newProduct, setNewProduct] = useState({
    brand: '', model_name: '', colorway: '', price_inr: '', image_url: '', total_stock: ''
  });
  const [isAdding, setIsAdding] = useState(false);
  const [addMessage, setAddMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  // Poll the backend every 2 seconds
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/v1/admin/stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Engine disconnected.");
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleForceSweep = async () => {
    setIsSweeping(true);
    setSweepLog(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/admin/force-sweep', { method: 'POST' });
      const data = await res.json();
      if (data.swept_count > 0) {
        setSweepLog(`Reclaimed ${data.swept_count} carts. Restocked: ${data.restocked.join(', ')}`);
      } else {
        setSweepLog("System Optimal. No expired carts found.");
      }
    } catch (err) {
      setSweepLog("Error communicating with State Engine.");
    } finally {
      setIsSweeping(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    setAddMessage(null);

    try {
      const payload = {
        ...newProduct,
        price_inr: parseInt(newProduct.price_inr),
        total_stock: parseInt(newProduct.total_stock)
      };

      const res = await fetch('http://127.0.0.1:8000/api/v1/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to add product");
      
      setAddMessage({ text: "Success! Product is now LIVE on the storefront.", type: 'success' });
      setNewProduct({ brand: '', model_name: '', colorway: '', price_inr: '', image_url: '', total_stock: '' });
      
    } catch (err) {
      setAddMessage({ text: "Error injecting product. Check constraints.", type: 'error' });
    } finally {
      setIsAdding(false);
      setTimeout(() => setAddMessage(null), 5000); // Clear message after 5s
    }
  };

  return (
    <main className="min-h-screen bg-stone-900 text-neutral-100 p-8 font-sans selection:bg-red-800 selection:text-white pb-20">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-12 border-b border-stone-800 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-sm font-bold uppercase tracking-widest text-red-600 mb-2">Restricted Access</h1>
            <h2 className="text-5xl font-black uppercase tracking-tighter">Command Center</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-green-500">Engine Online</span>
          </div>
        </header>

        {/* Real-Time System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-stone-800 p-6 rounded-2xl border border-stone-700">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Total Products</h3>
            <p className="text-5xl font-black">{stats.total_shoes_tracked}</p>
          </div>
          <div className="bg-stone-800 p-6 rounded-2xl border border-stone-700">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Active DB Locks</h3>
            <p className="text-5xl font-black text-blue-400">{stats.active_locks}</p>
          </div>
          <div className="bg-stone-800 p-6 rounded-2xl border border-red-900/50 shadow-[0_0_15px_rgba(220,38,38,0.1)]">
            <h3 className="text-xs font-bold uppercase tracking-widest text-red-400 mb-4">Expired Violations</h3>
            <p className="text-5xl font-black text-red-500">{stats.expired_violators}</p>
          </div>
          <div className="bg-stone-800 p-6 rounded-2xl border border-stone-700">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Sold Out Items</h3>
            <p className="text-5xl font-black text-stone-500">{stats.sold_out_count}</p>
          </div>
        </div>

        {/* Manual Cart Sweeper Control */}
        <section className="bg-stone-800 border border-stone-700 rounded-3xl p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Cart Integrity Engine</h3>
              <p className="text-stone-400 text-sm font-medium max-w-xl">
                Reclaim inventory from users who failed to complete their transaction within the 5-minute constraint window.
              </p>
            </div>
            <button 
              onClick={handleForceSweep}
              disabled={isSweeping}
              className="bg-red-700 hover:bg-red-600 text-white font-black uppercase tracking-widest px-8 py-5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(185,28,28,0.4)] whitespace-nowrap"
            >
              {isSweeping ? "Executing..." : "Force Sweep Inventory"}
            </button>
          </div>
          {sweepLog && (
            <div className="mt-6 p-4 bg-stone-900 border border-stone-700 rounded-lg font-mono text-sm text-green-400">
              {">"} {sweepLog}
            </div>
          )}
        </section>

        {/* NEW: Inventory Injection Form */}
        <section className="bg-stone-800 border border-stone-700 rounded-3xl p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Inventory Injection</h3>
            <p className="text-stone-400 text-sm font-medium">Add new assets to the Product State Registry. They will instantly enter the LIVE state.</p>
          </div>

          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input required type="text" placeholder="Brand (e.g., Nike)" value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} className="bg-stone-900 border border-stone-700 p-4 rounded-xl focus:outline-none focus:border-stone-500 text-white font-bold" />
            <input required type="text" placeholder="Model Name (e.g., Dunk Low)" value={newProduct.model_name} onChange={e => setNewProduct({...newProduct, model_name: e.target.value})} className="bg-stone-900 border border-stone-700 p-4 rounded-xl focus:outline-none focus:border-stone-500 text-white font-bold" />
            <input required type="text" placeholder="Colorway (e.g., Panda)" value={newProduct.colorway} onChange={e => setNewProduct({...newProduct, colorway: e.target.value})} className="bg-stone-900 border border-stone-700 p-4 rounded-xl focus:outline-none focus:border-stone-500 text-white font-bold" />
            <input required type="number" placeholder="Price (INR)" value={newProduct.price_inr} onChange={e => setNewProduct({...newProduct, price_inr: e.target.value})} className="bg-stone-900 border border-stone-700 p-4 rounded-xl focus:outline-none focus:border-stone-500 text-white font-bold" />
            <input required type="number" placeholder="Total Stock" value={newProduct.total_stock} onChange={e => setNewProduct({...newProduct, total_stock: e.target.value})} className="bg-stone-900 border border-stone-700 p-4 rounded-xl focus:outline-none focus:border-stone-500 text-white font-bold" />
            <input required type="url" placeholder="Image URL (https://...)" value={newProduct.image_url} onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} className="bg-stone-900 border border-stone-700 p-4 rounded-xl focus:outline-none focus:border-stone-500 text-white font-bold md:col-span-2" />
            
            <div className="md:col-span-2 mt-4">
              <button disabled={isAdding} type="submit" className="w-full bg-stone-100 text-stone-900 font-black uppercase tracking-widest py-5 rounded-xl hover:bg-white transition-all disabled:opacity-50">
                {isAdding ? 'Injecting into Registry...' : 'Deploy to Storefront'}
              </button>
            </div>
            
            {addMessage && (
              <div className={`md:col-span-2 p-4 rounded-lg font-bold text-center uppercase tracking-widest text-sm ${addMessage.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'}`}>
                {addMessage.text}
              </div>
            )}
          </form>
        </section>

      </div>
    </main>
  );
}