import { useState } from 'react';
import { Play, Film, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function GalleryAndVideo() {
  const [activeMedia, setActiveMedia] = useState<'photos' | 'videos'>('photos');

  // Realistic photos of Deewan Namak Mandi dishes
  const galleryPhotos = [
    {
      src: '/src/assets/images/karahi_hero_1784129531728.jpg',
      title: 'Namak Mandi Mutton Karahi',
      tag: 'Signature Dish',
      desc: 'Cooked fresh on customer order with pure sheep fat & tomatoes.'
    },
    {
      src: '/src/assets/images/mutton_tikka_1784129551509.jpg',
      title: 'Shinwari Mutton Tikka',
      tag: 'Best Seller',
      desc: 'Sizzling hot charcoal grilled tender mutton chunks.'
    },
    {
      src: '/src/assets/images/chapli_kabab_1784129571254.jpg',
      title: 'Peshawari Chapli Kabab',
      tag: 'Traditional Feast',
      desc: 'Shallow-fried crispy flat minced beef patties.'
    },
    {
      src: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkpp4J8E8c9GBt3u4T-Qn1-lNonBaoYoeSJ3Q3cZn5oe_UzDn8WRM0mSydLjh7SvgQujCH7a3nkjSlyrnfbwTaJPZdshEWqO0Jm5LRW5-Wm-p1IUbuhIT1loMfo-Tz1KeXhMqGY=s680-w680-h510-rw',
      title: 'Deewan Family Dining Hall',
      tag: 'Ambience',
      desc: 'Comfortable floor majlis seating & private family cabins.'
    },
    {
      src: '/src/assets/images/sizzling_bbq_platter_1784185241441.jpg',
      title: 'Sizzling BBQ Platter',
      tag: 'BBQ Special',
      desc: 'An assortment of tender Shinwari mutton tikka, chicken seekh kababs, and smoky malai boti, grilled over charcoal and served sizzling.'
    },
    {
      src: '/src/assets/images/roghni_naan_tandoor_1784185710299.jpg',
      title: 'Traditional Roghni Naan Tandoor',
      tag: 'From Tandoor',
      desc: 'Freshly baked buttery Roghni Naan prepared live.'
    }
  ];

  return (
    <section className="bg-black py-20 border-t border-b border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 relative">
          {/* Top Divider with Fleur-de-lis style icon in blue */}
          <div className="flex items-center justify-center gap-4 text-[#3B82F6] opacity-90 mb-5 max-w-xs mx-auto">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#3B82F6]/60" />
            <span className="text-sm select-none">⚜</span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#3B82F6]/60" />
          </div>

          {/* Title with sparkles and styling */}
          <div className="relative inline-block mb-5 px-10">
            {/* Sparkle top left */}
            <span className="absolute -top-3 left-2 text-white/90 animate-pulse select-none text-2xl font-light">✦</span>
            {/* Sparkle bottom right */}
            <span className="absolute -bottom-3 right-2 text-white/90 animate-pulse select-none text-2xl font-light">✦</span>

            <h2 className="text-4xl md:text-6xl font-serif font-light italic text-white uppercase tracking-tight leading-none">
              The Taste of <span className="text-[#FFC107] not-italic font-extrabold font-serif">D.I. Khan</span>
            </h2>
          </div>

          {/* Bottom Divider */}
          <div className="flex items-center justify-center gap-4 text-[#3B82F6]/40 mb-6 max-w-xs mx-auto">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#3B82F6]/30" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]/70" />
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#3B82F6]/30" />
          </div>

          <p className="mt-4 text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-sans">
            Authentic <span className="text-[#3B82F6] font-semibold">Namak Mandi</span> flavors with premium dining experience in D.I. Khan.
          </p>

          {/* Toggle Tab */}
          <div className="flex justify-center mt-8">
            <div className="inline-flex bg-zinc-950 border border-zinc-800 p-1">
              <button
                onClick={() => setActiveMedia('photos')}
                className={`flex items-center space-x-2 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.15em] transition duration-300 ${
                  activeMedia === 'photos'
                    ? 'bg-[#FFC107] text-black shadow-[0_4px_12px_rgba(255,193,7,0.15)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                <span>Photos ({galleryPhotos.length})</span>
              </button>
              <button
                onClick={() => setActiveMedia('videos')}
                className={`flex items-center space-x-2 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.15em] transition duration-300 ${
                  activeMedia === 'videos'
                    ? 'bg-[#FFC107] text-black shadow-[0_4px_12px_rgba(255,193,7,0.15)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Film className="h-3.5 w-3.5" />
                <span>Promo Video</span>
              </button>
            </div>
          </div>
        </div>

        {/* Media Container */}
        {activeMedia === 'photos' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryPhotos.map((photo, index) => (
              <div
                key={index}
                className="group bg-zinc-950 border border-zinc-900 transition-all duration-300 hover:border-[#FFC107]/40 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80"></div>
                  
                  {/* Category Tag */}
                  <span className="absolute top-4 left-4 bg-[#3B82F6] text-white text-[9px] font-extrabold uppercase px-2.5 py-1 tracking-wider shadow-[0_2px_8px_rgba(59,130,246,0.3)]">
                    {photo.tag}
                  </span>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-serif italic text-[#EF4444] mb-1 font-semibold group-hover:text-[#FFC107] transition-colors duration-300">
                    {photo.title}
                  </h3>
                  <p className="text-zinc-400 text-xs">
                    {photo.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Embedded Video Player Frame */}
            <div className="relative aspect-video border border-zinc-800 bg-zinc-950 shadow-2xl group rounded-lg overflow-hidden">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/S_vGAsXbHks?autoplay=1&mute=1&playlist=S_vGAsXbHks&loop=1"
                title="Deewan Namak Mandi Promo Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="no-referrer"
              ></iframe>
              
              {/* Symmetrical framing element to look incredibly stylish */}
              <div className="absolute inset-x-0 bottom-0 bg-black/90 px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-zinc-800 pointer-events-none">
                <div className="flex items-center space-x-3">
                  <Play className="h-4 w-4 text-[#EF4444] animate-pulse" />
                  <span className="text-[10px] font-bold text-zinc-300 tracking-[0.15em] uppercase">Playing: Deewan Namak Mandi Experience Tour</span>
                </div>
                <span className="text-[9px] text-[#FFC107]/90 font-mono mt-1 sm:mt-0 uppercase tracking-widest">Dera Ismail Khan Cuisine</span>
              </div>
            </div>
            
            {/* Small description for the video */}
            <div className="text-center mt-6">
              <p className="text-xs text-zinc-500 italic">
                * Experience the live preparation of Namak Mandi Karahi & Charcoal BBQ Skewers from our kitchen straight to your plate.
              </p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

