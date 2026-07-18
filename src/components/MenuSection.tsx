import { useState } from 'react';
import { 
  Search, Plus, Minus, Flame, Heart, ShoppingBag, 
  Award, Leaf, ShieldCheck, Users, MapPin, ChefHat,
  LayoutGrid, CookingPot, Disc, CircleDot, GlassWater 
} from 'lucide-react';
import { MenuItem, CartItem, Category } from '../types';

interface MenuSectionProps {
  menuItems: MenuItem[];
  cart: CartItem[];
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onOpenCart: () => void;
}

export default function MenuSection({
  menuItems,
  cart,
  onAddToCart,
  onUpdateQuantity,
  onOpenCart,
}: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: (Category | 'All')[] = ['All', 'BBQ', 'Karahi', 'Roti', 'Rice', 'Raita & Salad', 'Drinks'];

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'all':
        return <LayoutGrid className="h-3.5 w-3.5" />;
      case 'bbq':
        return <Flame className="h-3.5 w-3.5" />;
      case 'karahi':
        return <CookingPot className="h-3.5 w-3.5" />;
      case 'roti':
        return <Disc className="h-3.5 w-3.5" />;
      case 'rice':
        return <CircleDot className="h-3.5 w-3.5" />;
      case 'raita & salad':
      case 'raita':
        return <Leaf className="h-3.5 w-3.5" />;
      case 'drinks':
        return <GlassWater className="h-3.5 w-3.5" />;
      default:
        return <ChefHat className="h-3.5 w-3.5" />;
    }
  };

  // Filter items
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCartQuantity = (itemId: string) => {
    const cartItem = cart.find((item) => item.menuItem.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <section className="bg-black py-20 text-white border-b border-zinc-900" id="menu-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header - Premium Visual Styling matching the mockup */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-zinc-950 border border-zinc-800/80 px-4 py-1.5 rounded-full mb-4">
            <span className="h-2 w-2 rounded-full bg-[#FFC107] animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#FFC107] uppercase">
              DEEWAN SPECIALTIES
            </span>
          </div>

          {/* Thin elegant separator with custom golden stars */}
          <div className="flex items-center justify-center gap-4 text-[#FFC107] opacity-60 mb-2">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#FFC107]" />
            <span className="text-xs">✦ ✦ ✦</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#FFC107]" />
          </div>

          <span className="font-cursive text-2xl md:text-3.5xl text-[#FFC107] block mb-2 font-medium tracking-wide">
            Discover
          </span>

          <h2 className="text-4xl md:text-6xl font-serif font-extrabold text-white uppercase tracking-tight leading-none mb-4">
            Exceptional <span className="text-[#FFC107]">Flavors</span>
          </h2>

          {/* Elegant gold plate cover cloche separator line */}
          <div className="flex items-center justify-center gap-4 text-[#FFC107] opacity-80 mb-6">
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-[#FFC107]" />
            <ChefHat className="h-5 w-5 text-[#FFC107]" />
            <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-[#FFC107]" />
          </div>

          <p className="mt-4 text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Every dish is freshly prepared, packed with authentic taste, and crafted using premium ingredients with Deewan's{' '}
            <span className="font-cursive text-lg md:text-xl text-[#FFC107] whitespace-nowrap block md:inline-block mt-1 md:mt-0">
              secret spice combinations.
            </span>
          </p>

          {/* Four High-Contrast Premium Features */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12 text-left border-t border-zinc-900/50 pt-8">
            <div className="flex items-start space-x-3 group">
              <div className="p-2 bg-zinc-950 border border-zinc-850 rounded-lg group-hover:border-[#FFC107] transition-colors duration-300 shrink-0">
                <Award className="h-4.5 w-4.5 text-[#FFC107]" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">Authentic Taste</h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">Traditional recipes with real spices</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 group">
              <div className="p-2 bg-zinc-950 border border-zinc-850 rounded-lg group-hover:border-[#FFC107] transition-colors duration-300 shrink-0">
                <Leaf className="h-4.5 w-4.5 text-[#FFC107]" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">Premium Quality</h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">Fresh ingredients every single day</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 group">
              <div className="p-2 bg-zinc-950 border border-zinc-850 rounded-lg group-hover:border-[#FFC107] transition-colors duration-300 shrink-0">
                <ShieldCheck className="h-4.5 w-4.5 text-[#FFC107]" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">Hygienic & Safe</h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">Clean kitchen, safe food</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 group">
              <div className="p-2 bg-zinc-950 border border-zinc-850 rounded-lg group-hover:border-[#FFC107] transition-colors duration-300 shrink-0">
                <Users className="h-4.5 w-4.5 text-[#FFC107]" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">Warm Ambience</h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">Comfortable dining for every occasion</p>
              </div>
            </div>
          </div>

          {/* Golden border map pin location pill */}
          <div className="mt-10 flex justify-center">
            <div className="inline-flex items-center space-x-2 bg-zinc-950/80 border border-zinc-800/80 hover:border-[#FFC107]/60 px-5 py-2.5 rounded-full text-[10px] font-bold tracking-widest text-[#FFC107] uppercase shadow-lg transition duration-300">
              <MapPin className="h-3.5 w-3.5 text-[#FFC107]" />
              <span>Namak Mandi, Dera Ismail Khan</span>
            </div>
          </div>
        </div>

        {/* Toolbar: Category tabs + Search bar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-10 border-b border-zinc-900 mb-12">
          {/* Category Tabs - Wrapped and highly visible */}
          <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center space-x-1.5 px-2.5 md:px-4 py-1.5 md:py-2 text-[9.5px] md:text-xs font-bold uppercase tracking-[0.06em] md:tracking-[0.1em] whitespace-nowrap transition duration-300 cursor-pointer border ${
                  selectedCategory === category
                    ? 'bg-[#FFC107] text-black font-extrabold border-[#FFC107] shadow-[0_4px_12px_rgba(255,193,7,0.15)]'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white border-zinc-800'
                }`}
              >
                {getCategoryIcon(category)}
                <span>{category === 'Raita & Salad' ? 'RAITA' : category}</span>
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 py-3 pl-11 pr-4 text-xs tracking-wide text-white placeholder-zinc-600 focus:outline-none focus:border-[#FFC107] transition duration-300"
            />
          </div>
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => {
              const qty = getCartQuantity(item.id);

              return (
                <div
                  key={item.id}
                  className="bg-zinc-950 border border-zinc-900 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-[#FFC107]/40 group"
                >
                  {/* Image container */}
                  <div className="relative aspect-square overflow-hidden bg-black">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                    
                    {/* Add visual badge for popular items */}
                    {item.price > 1000 && (
                      <span className="absolute top-4 right-4 bg-[#EF4444] text-white text-[9px] font-extrabold uppercase px-2.5 py-1 tracking-wider shadow-[0_2px_8px_rgba(239,68,68,0.4)]">
                        Premium Special
                      </span>
                    )}

                    {/* Price Tag Overlay */}
                    <span className="absolute bottom-4 left-4 bg-black/90 text-[#FFC107] text-xs font-bold font-mono px-3.5 py-1.5 border border-zinc-850">
                      Rs. {item.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Body Info */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-extrabold tracking-[0.2em] text-[#3B82F6] uppercase">
                          {item.category}
                        </span>
                        <button className="text-zinc-700 hover:text-[#EF4444] transition duration-300">
                          <Heart className="h-4 w-4" />
                        </button>
                      </div>

                      <h3 className="text-lg font-serif italic text-white font-semibold group-hover:text-[#FFC107] transition-colors duration-300 mb-2">
                        {item.name}
                      </h3>

                      <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Actions button */}
                    <div className="mt-6 pt-4 border-t border-zinc-900">
                      {qty > 0 ? (
                        <div className="flex items-center justify-between bg-[#FFC107] text-black px-4 py-2.5 font-bold text-xs uppercase tracking-wider font-mono">
                          <button
                            onClick={() => onUpdateQuantity(item.id, qty - 1)}
                            className="p-1 hover:bg-black/10 transition"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="text-xs font-extrabold font-mono">{qty}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, qty + 1)}
                            className="p-1 hover:bg-black/10 transition"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onAddToCart(item)}
                          className="w-full flex items-center justify-center space-x-2 bg-zinc-900 border border-zinc-800 hover:bg-[#FFC107] hover:text-black text-[#FFC107] font-bold py-3 transition-all duration-300 text-[10px] uppercase tracking-[0.15em] shadow-[0_0_15px_rgba(255,193,7,0.05)]"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          <span>Add To Cart</span>
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-950 border border-zinc-900">
            <p className="text-zinc-500 text-sm">No dishes found matching your selection.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 bg-zinc-900 border border-zinc-800 text-[#FFC107] text-[10px] tracking-widest uppercase font-bold py-2.5 px-6 transition hover:bg-zinc-850"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Floating Cart Indicator if Cart has items & active on this screen */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6 z-40 md:hidden">
            <button
              onClick={onOpenCart}
              className="bg-[#FFC107] text-black p-4 rounded-full shadow-2xl flex items-center justify-center space-x-2 animate-bounce"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="font-extrabold text-xs">{cart.length}</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
