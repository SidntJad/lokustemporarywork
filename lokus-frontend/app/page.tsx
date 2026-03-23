import Link from 'next/link';
import StorefrontGrid from '@/components/StorefrontGrid';
import UpcomingDropTimer from '@/components/UpcomingDropTimer';

interface Shoe {
  id: number;
  brand: string;
  model_name: string;
  colorway: string;
  price_inr: number;
  image_url: string; 
  is_active: boolean;
}

async function getDrops() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/v1/drops', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.live_drops || [];
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const drops: Shoe[] = await getDrops();

  return (
    <main className="min-h-screen bg-neutral-100 text-stone-800 p-8 font-sans selection:bg-red-800 selection:text-white">
      <div className="max-w-6xl mx-auto">
        
        <section className="py-24 text-center">
          <h2 className="text-7xl font-black uppercase tracking-tighter mb-6 leading-none text-stone-900">
            The Ultimate <br/> Sneaker Hub.
          </h2>
          <p className="text-xl text-stone-500 mb-10 max-w-2xl mx-auto font-medium">
            Cop the latest drops, discover verified grails, and find your perfect fit. Built for the culture.
          </p>
        </section>

        {/* 1. The Countdown Timer */}
        {/* Make sure to set a date in the future to see it tick! */}
        <UpcomingDropTimer dropDate="2026-04-15T12:00:00" dropName="Cactus Jack x Travis Scott Vault" />

        {/* 2. The Interactive Grid */}
        <StorefrontGrid initialDrops={drops} />

      </div>
    </main>
  );
}