"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, User, PlusCircle, ShoppingBag, LayoutGrid } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          
          {/* LOGO - Navigates to Home */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center overflow-hidden">
               <span className="text-white font-bold text-xl">L</span>
            </div>
            <h1 className="text-2xl font-bold text-black tracking-tighter">LOKUS</h1>
          </Link>

          {/* MAIN NAVIGATION */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className={`${pathname === '/' ? 'text-black' : 'text-gray-500'} hover:text-black transition-colors font-medium`}
            >
              Shop
            </Link>

            {/* EXPLORE COLLECTION - Links to the new route */}
            <Link 
              href="/collection" 
              className={`flex items-center gap-1 px-4 py-2 rounded-full font-medium transition-all ${
                pathname === '/collection' 
                ? 'bg-black text-white' 
                : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Explore Collection
            </Link>
            
            {/* ADD SHOE - Links to management route */}
            <Link 
              href="/addashoe" 
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium bg-blue-50 px-3 py-1.5 rounded-full transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Add Shoe
            </Link>
          </nav>

          {/* UTILITY ICONS */}
          <div className="flex items-center gap-5">
            <button className="text-gray-600 hover:text-black transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/cart" className="text-gray-600 hover:text-black transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              {/* Badge logic can be added here based on cart state */}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}