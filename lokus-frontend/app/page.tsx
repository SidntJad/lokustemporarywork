"use client";

import React, { useState, useEffect } from 'react';
import { ChevronRight, Heart, ShoppingBag, Bell, Clock } from 'lucide-react';

// --- DATA ARRAYS ---

const brands = [
  { name: 'Nike', icon: '👟' },
  { name: 'Adidas', icon: '🏃' },
  { name: 'Jordan', icon: '🏀' },
  { name: 'Puma', icon: '🐆' },
  { name: 'Converse', icon: '⭐' },
  { name: 'New Balance', icon: 'N' },
];

const featuredShoes = [
  {
    id: 1,
    name: 'Air Velocity Pro',
    brand: 'Nike',
    price: '$149.99',
    rating: '4.8',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 2,
    name: 'Urban Runner X',
    brand: 'Adidas',
    price: '$129.99',
    rating: '4.9',
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 3,
    name: 'Classic High-Top',
    brand: 'Converse',
    price: '$89.99',
    rating: '4.7',
    image: 'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600'
  }
];

const products = [
  {
    id: 1,
    name: 'Air Velocity Pro',
    brand: 'Nike',
    price: '$149.99',
    image: 'https://images.pexels.com/photos/3407857/pexels-photo-3407857.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.8,
    status: 'available',
    stockCount: 15,
  },
  {
    id: 2,
    name: 'UltraBoost Essence',
    brand: 'Adidas',
    price: '$159.99',
    image: 'https://images.pexels.com/photos/3945682/pexels-photo-3945682.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.9,
    status: 'low_stock',
    stockCount: 3,
  },
  {
    id: 3,
    name: 'Retro 1 High OG',
    brand: 'Jordan',
    price: '$199.99',
    image: 'https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 5.0,
    status: 'out_of_stock',
    stockCount: 0,
  }
];

// --- COMPONENT DEFINITIONS ---

function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Find Your Perfect Sole
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Discover premium footwear from the world's finest brands. From street style to athletic performance, LOCUS has every step covered.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                Explore Collection
                <ChevronRight className="w-5 h-5" />
              </button>
              <a href="#brand-showcase" className="border-2 border-gray-300 text-center text-gray-900 px-8 py-4 rounded-lg font-semibold hover:border-gray-900 hover:bg-gray-50 transition-colors">
                View Brands
              </a>
            </div>

            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold text-gray-900">500+</p>
                <p className="text-gray-600">Premium Shoes</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">50+</p>
                <p className="text-gray-600">Global Brands</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">4.9★</p>
                <p className="text-gray-600">Customer Rating</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-96 md:h-full min-h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl"></div>
            <img
              src="https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Hero Sneaker"
              className="absolute inset-0 w-full h-full object-cover rounded-3xl shadow-2xl mix-blend-multiply"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandShowcase() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Premium Brands</h2>
          <p className="text-gray-600 text-lg">Shop from the world's most trusted shoe manufacturers</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {brands.map((brand) => (
            <button
              key={brand.name}
              className="group bg-white rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:shadow-lg transition-all duration-300 hover:border-black border-2 border-transparent"
            >
              <span className="text-5xl group-hover:scale-110 transition-transform">{brand.icon}</span>
              <h3 className="font-semibold text-gray-900 text-center">{brand.name}</h3>
            </button>
          ))}
        </div>

        <div className="mt-16 bg-black text-white rounded-3xl p-12 text-center">
          <h3 className="text-3xl font-bold mb-4">Exclusive Member Benefits</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join thousands of shoe enthusiasts and get early access to new releases, member-only pricing, and free shipping on all orders.
          </p>
          <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors">
            Join Now
          </button>
        </div>
      </div>
    </section>
  );
}

function FeaturedShoes() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Releases</h2>
            <p className="text-gray-600">The most sought-after drops of the week</p>
          </div>
          <button className="text-black font-semibold hover:underline hidden sm:block">
            View All Featured
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredShoes.map((shoe) => (
            <div key={shoe.id} className="group cursor-pointer">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 mb-4">
                <img
                  src={shoe.image}
                  alt={shoe.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute top-4 right-4 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-gray-50">
                  <Heart className="w-5 h-5 text-gray-700" />
                </button>
                <button className="absolute bottom-4 right-4 bg-black text-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-gray-800">
                  <ShoppingBag className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500 font-medium">{shoe.brand}</p>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-black transition-colors">
                  {shoe.name}
                </h3>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xl font-bold text-gray-900">{shoe.price}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-600">★ {shoe.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductShowcase() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Product Availability</h2>
          <p className="text-gray-600">Live inventory tracking for our most popular styles</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <h4 className="font-semibold text-gray-900">Available</h4>
            </div>
            <p className="text-sm text-gray-600">In stock and ready to purchase</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <h4 className="font-semibold text-gray-900">Low Stock</h4>
            </div>
            <p className="text-sm text-gray-600">Limited quantity remaining, hurry!</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <h4 className="font-semibold text-gray-900">Out of Stock</h4>
            </div>
            <p className="text-sm text-gray-600">Currently unavailable, get notified</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <h4 className="font-semibold text-gray-900">Coming Soon</h4>
            </div>
            <p className="text-sm text-gray-600">Upcoming releases</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
             <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="relative aspect-[4/3] bg-gray-100">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 flex gap-2">
                  {product.status === 'low_stock' && (
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                       <Clock className="w-3 h-3" /> Only {product.stockCount} left
                    </span>
                  )}
                  {product.status === 'out_of_stock' && (
                    <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full">
                       Sold Out
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-500 font-medium mb-1">{product.brand}</p>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold">{product.price}</p>
                  {product.status !== 'out_of_stock' ? (
                     <button className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm">
                       Add to Cart
                     </button>
                  ) : (
                     <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
                       <Bell className="w-4 h-4" /> Notify Me
                     </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- MAIN PAGE ASSEMBLY ---

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow">
        
        <section id="hero">
          <Hero />
        </section>

        <section id="brand-showcase">
          <BrandShowcase />
        </section>

        <section id="featured-shoes">
          <FeaturedShoes />
        </section>

        <section id="product-showcase">
          <ProductShowcase />
        </section>

      </main>
    </div>
  );
}