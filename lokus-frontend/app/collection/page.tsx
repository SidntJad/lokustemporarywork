"use client";

import React, { useState, useMemo } from 'react';
import { Search, ShoppingCart, Trash2, X, ChevronDown, Check } from 'lucide-react';

// --- DATA CONSTANTS ---
const COLORS = [
  "Adventure Brown", "Beige/White", "Black/Anthracite", "Black/Dark Smoke", "Black/Grey", 
  "Black/Metallic Silver", "Black/Silver", "Black/White", "Black/White/Pink", "Blue/Black", 
  "Blue/Gum", "Blue/Yellow", "Bright Crimson", "Classic Navy", "Cloud White", "Cool Dark Grey", 
  "Core Black", "Crystal", "Electric Orchid", "Fireglow", "For All Time Red", "Georgetown Blue", 
  "Golden Hour", "Grape Mist/Gum", "Green/White", "Grey/Silver", "Grey/White", "Handball Heritage", 
  "Incense", "Infrared", "Light Orewood", "Lime/Black", "Made in UK", "Metallic", "Mint Melt", 
  "Moonbeam", "Multi-Color", "Navy/White", "Pale Nude", "Panda", "Pink Blast", "Platinum", 
  "Protection Pack", "Puma Pure", "Sail/Midnight", "Sea Salt", "Bullet", "Silver/Black", 
  "Silver/Navy", "Solar", "Starlight", "Summit", "Sunset Orange", "Triple", "Volt/Black", 
  "White/Black", "White/Blue", "White/Cool", "White/Glowing", "White/Green", "White/Grey", 
  "White/Marshmallow", "White/Pastel", "White/Pink", "White/Red", "White/Royal", "White/Varsity", 
  "White/Victory", "White/Wolf", "Wonder Taupe", "Yellow/Blue"
];

const MATERIALS = [
  "Carbon Fiber", "Fiber/Mesh", "Carbon/Mesh", "Engineered Knit", "Mesh", "Flyknit", 
  "Gore-Tex/Knit", "HybridTouch", "Kangaroo Leather", "K-Better", "Synthetic Leather/Mesh", 
  "Leather/Suede", "Mesh/Carbon", "Mesh/Leather", "Mesh/Nubuck", "Mesh/Suede", "Mesh/Synthetic", 
  "Neoprene/Leather", "Nylon/Suede", "Pigskin/Mesh", "Primeknit", "Recycled", "Soft Suede", 
  "Suede/Mesh", "Suede/Nylon", "Synthetic/Mesh", "Textile", "Textile/Leather"
];

const CLOSURES = ["Laceless", "Laces", "Slip-on", "Toggle", "Velcro/Laces"];
const HEELS = ["Chunkey", "Flat", "Pillars", "Platform"];
const MANUFACTURERS = ["Adidas", "New Balance", "Nike", "Puma"];

// --- TYPES ---
interface Shoe {
  id: number;
  name: string;
  price: number;
  color: string;
  material: string;
  closure: string;
  heel: string;
  waterResistant: boolean;
  manufacturer: string;
  image: string;
}

// Example Mock Data
const SHOE_DATA: Shoe[] = [
  { id: 1, name: "Zoom Pegasus", price: 120, color: "Black/White", material: "Mesh", closure: "Laces", heel: "Flat", waterResistant: false, manufacturer: "Nike", image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg" },
  { id: 2, name: "Boost 350", price: 220, color: "Panda", material: "Primeknit", closure: "Laces", heel: "Flat", waterResistant: false, manufacturer: "Adidas", image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg" },
];

export default function CollectionPage() {
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState(500);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [cart, setCart] = useState<Shoe[]>([]);

  // Filtering Logic
  const filteredShoes = useMemo(() => {
    return SHOE_DATA.filter(shoe => {
      const matchesSearch = shoe.name.toLowerCase().includes(search.toLowerCase());
      const matchesPrice = shoe.price <= priceRange;
      const matchesColor = selectedColors.length === 0 || selectedColors.includes(shoe.color);
      const matchesMaterial = selectedMaterials.length === 0 || selectedMaterials.includes(shoe.material);
      return matchesSearch && matchesPrice && matchesColor && matchesMaterial;
    });
  }, [search, priceRange, selectedColors, selectedMaterials]);

  const toggleFilter = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* LEFT PANEL: FILTERS */}
      <aside className="w-72 bg-white border-r p-6 overflow-y-auto hidden md:block">
        <h2 className="text-xl font-bold mb-6">Filters</h2>
        
        {/* Price Slider */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">Max Price: ${priceRange}</label>
          <input 
            type="range" min="0" max="1000" value={priceRange} 
            onChange={(e) => setPriceRange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
          />
        </div>

        {/* Colors */}
        <div className="mb-8">
          <h3 className="font-semibold mb-3">Color</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {COLORS.map(c => (
              <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" onChange={() => toggleFilter(selectedColors, setSelectedColors, c)} className="rounded border-gray-300" />
                {c}
              </label>
            ))}
          </div>
        </div>

        {/* Materials */}
        <div className="mb-8">
          <h3 className="font-semibold mb-3">Material Type</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {MATERIALS.map(m => (
              <label key={m} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" onChange={() => toggleFilter(selectedMaterials, setSelectedMaterials, m)} className="rounded border-gray-300" />
                {m}
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* CENTER: SEARCH & GRID */}
      <main className="flex-1 p-8">
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" placeholder="Search shoes..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredShoes.map(shoe => (
            <div key={shoe.id} className="bg-white rounded-2xl shadow-sm border p-4 hover:shadow-md transition-shadow">
              <img src={shoe.image} className="w-full h-48 object-cover rounded-xl mb-4" alt={shoe.name} />
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">{shoe.name}</h3>
                  <span className="text-xl font-black">${shoe.price}</span>
                </div>
                <div className="grid grid-cols-2 gap-y-1 text-xs text-gray-500">
                  <p>Brand: <span className="text-black">{shoe.manufacturer}</span></p>
                  <p>Color: <span className="text-black">{shoe.color}</span></p>
                  <p>Heel: <span className="text-black">{shoe.heel}</span></p>
                  <p>Water: <span className="text-black">{shoe.waterResistant ? "Yes" : "No"}</span></p>
                </div>
                <button 
                  onClick={() => setCart([...cart, shoe])}
                  className="w-full bg-black text-white py-2 rounded-lg mt-4 font-semibold hover:bg-gray-800 transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* RIGHT PANEL: CART */}
      <aside className="w-80 bg-white border-l p-6 hidden xl:block">
        <div className="flex items-center gap-2 mb-6">
          <ShoppingCart className="w-6 h-6" />
          <h2 className="text-xl font-bold">Your Cart ({cart.length})</h2>
        </div>
        <div className="space-y-4">
          {cart.map((item, idx) => (
            <div key={idx} className="flex gap-3 border-b pb-4">
              <img src={item.image} className="w-16 h-16 object-cover rounded-lg" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{item.name}</p>
                <p className="text-xs text-gray-500">${item.price}</p>
                <button 
                  onClick={() => setCart(cart.filter((_, i) => i !== idx))}
                  className="text-red-500 text-[10px] mt-1 hover:underline"
                >Remove</button>
              </div>
            </div>
          ))}
          {cart.length === 0 && <p className="text-gray-400 text-center py-20">Cart is empty</p>}
        </div>
        {cart.length > 0 && (
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl mt-8 font-bold">
            Checkout ${cart.reduce((acc, curr) => acc + curr.price, 0)}
          </button>
        )}
      </aside>
    </div>
  );
}