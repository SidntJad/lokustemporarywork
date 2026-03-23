'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface ShoeData {
  name: string;
  brand: string;
  colorway: string; // Added to match your DB schema
  price: string;
  stock: string;
  frontImage: File | null;
  sideImage: File | null;
  backImage: File | null;
  threeSixty: File | null;
}

export default function AddShoePage() {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [addMessage, setAddMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState<ShoeData>({
    name: '',
    brand: '',
    colorway: '',
    price: '',
    stock: '',
    frontImage: null,
    sideImage: null,
    backImage: null,
    threeSixty: null,
  });

  const [previews, setPreviews] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, field: keyof ShoeData) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, [field]: file }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Inside AddShoe component
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    
    const data = new FormData();
    data.append('brand', formData.brand);
    data.append('model_name', formData.name);
    data.append('colorway', formData.colorway || "Standard");
    data.append('price_inr', formData.price);
    data.append('total_stock', formData.stock);
  
    // Append the actual File objects from state
    if (formData.frontImage) data.append('frontImage', formData.frontImage);
    if (formData.sideImage) data.append('sideImage', formData.sideImage);
    if (formData.backImage) data.append('backImage', formData.backImage);

    try {
        const res = await fetch('http://127.0.0.1:8000/api/v1/inventory', {
        method: 'POST',
        // Note: Do NOT set Content-Type header manually when using FormData
        body: data, 
        });

        if (res.ok) {
        setAddMessage({ text: "Binary assets secured in DB", type: 'success' });
        }
    } catch (error) {
        setAddMessage({ text: "Upload failed", type: 'error' });
    } finally {
        setIsAdding(false);
    }
    };

  return (
    <div className="min-h-screen bg-neutral-100 py-12 px-4">
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-2xl rounded-3xl border border-stone-200">
        <div className="mb-8">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-stone-900">Inventory Injection</h2>
          <p className="text-stone-500 font-medium">Capture high-fidelity assets for the Product State Registry.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Text Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-stone-400 ml-1">Model Name</label>
              <input type="text" name="name" placeholder="e.g. Dunk Low" onChange={handleInputChange} required className="border-2 border-stone-100 p-4 rounded-xl focus:border-stone-900 outline-none transition-all bg-stone-50" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-stone-400 ml-1">Brand</label>
              <input type="text" name="brand" placeholder="e.g. Nike" onChange={handleInputChange} required className="border-2 border-stone-100 p-4 rounded-xl focus:border-stone-900 outline-none transition-all bg-stone-50" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-stone-400 ml-1">Price (INR)</label>
              <input type="number" name="price" placeholder="8995" onChange={handleInputChange} required className="border-2 border-stone-100 p-4 rounded-xl focus:border-stone-900 outline-none transition-all bg-stone-50" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-stone-400 ml-1">Stock Units</label>
              <input type="number" name="stock" placeholder="50" onChange={handleInputChange} required className="border-2 border-stone-100 p-4 rounded-xl focus:border-stone-900 outline-none transition-all bg-stone-50" />
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['frontImage', 'sideImage', 'backImage', 'threeSixty'] as const).map((view) => (
              <div key={view} className="flex flex-col items-center">
                <label className="capitalize text-xs font-bold mb-3 text-stone-500 uppercase tracking-widest">
                  {view.replace('Image', '')}
                </label>
                <div className="w-full h-40 border-2 border-dashed border-stone-200 rounded-2xl flex items-center justify-center relative overflow-hidden bg-stone-50 hover:border-stone-400 transition-colors group">
                  {previews[view] ? (
                    <img src={previews[view]} alt="Preview" className="object-contain w-full h-full p-2" />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-2xl text-stone-300 group-hover:text-stone-500 transition-colors">+</span>
                        <span className="text-stone-400 text-[10px] uppercase font-bold">Upload</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleFileChange(e, view)}
                    required={view === 'frontImage'}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isAdding}
              className="w-full bg-stone-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-stone-800 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isAdding ? 'Deploying to Registry...' : 'Deploy to Storefront'}
            </button>
          </div>

          {addMessage && (
            <div className={`p-4 rounded-xl font-bold text-center uppercase tracking-widest text-sm ${addMessage.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
              {addMessage.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}