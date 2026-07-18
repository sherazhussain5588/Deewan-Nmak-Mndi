import { useState } from 'react';
import { ShoppingBag, Menu, X, User, LogOut, Shield } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  user: UserType | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  cartCount: number;
  onOpenCart: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Header({
  user,
  onLogout,
  onOpenAuth,
  cartCount,
  onOpenCart,
  activeTab,
  setActiveTab,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Our Menu' },
    { id: 'book', label: 'Book Table' },
  ];

  if (user) {
    navItems.push({ id: 'dashboard', label: 'My Dashboard' });
    if (user.role === 'admin') {
      navItems.push({ id: 'admin', label: 'Admin Panel' });
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-black text-white border-b border-zinc-800 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer space-x-2 md:space-x-3 group py-1 animate-in fade-in duration-700" 
            onClick={() => handleNavClick('home')}
            id="header-brand-logo-container"
          >
            {/* Typography Section: Deewan in red cursive + Namak Mandi in blue Urdu */}
            <div className="flex items-center space-x-1 md:space-x-1.5 select-none shrink-0">
              {/* English "Deewan" in gorgeous cursive script */}
              <span className="font-cursive text-xl md:text-2xl font-bold tracking-tight text-[#EF4444] drop-shadow-[0_1px_4px_rgba(239,68,68,0.6)] pr-0.5" style={{ transform: 'rotate(-2deg)' }}>
                Deewan
              </span>
              
              {/* Urdu "نمک منڈی" in glowing blue Nastaliq */}
              <span className="font-urdu text-[11px] md:text-sm font-bold text-[#3B82F6] drop-shadow-[0_1px_4px_rgba(59,130,246,0.6)] pr-0.5 pt-0.5 tracking-normal" style={{ direction: 'rtl' }}>
                نمک منڈی
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-x-2.5 lg:gap-x-5 xl:gap-x-6 mx-3 lg:mx-6 shrink-0">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-[9.5px] lg:text-[11px] xl:text-xs uppercase tracking-[0.08em] lg:tracking-[0.12em] font-semibold transition-all duration-300 whitespace-nowrap relative py-1.5 ${
                  activeTab === item.id
                    ? 'text-[#FFC107]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FFC107] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Icons and Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="bg-zinc-950 border border-zinc-800 px-5 py-2 rounded-full text-[11px] uppercase tracking-[0.15em] font-medium flex items-center gap-2.5 hover:bg-zinc-900 transition-all duration-300 text-zinc-300 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${cartCount > 0 ? 'bg-[#EF4444] animate-pulse shadow-[0_0_8px_#EF4444]' : 'bg-zinc-700'}`}></span>
              <span>Cart ({cartCount})</span>
            </button>

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.05)]">
                  {user.role === 'admin' ? (
                    <Shield className="h-3.5 w-3.5 text-[#3B82F6]" />
                  ) : (
                    <User className="h-3.5 w-3.5 text-[#3B82F6]" />
                  )}
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-300">
                    {user.name.split(' ')[0]}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/25 rounded-full transition duration-300"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="bg-[#FFC107] text-black hover:bg-amber-500 font-bold text-[10px] uppercase tracking-[0.2em] px-5 py-2 transition-all duration-300 rounded shadow-[0_4px_12px_rgba(255,193,7,0.2)]"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Right Bar */}
          <div className="flex md:hidden items-center space-x-4">
            <button
              onClick={onOpenCart}
              className="relative p-2 text-[#FFC107]"
            >
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-[0_0_8px_#EF4444]">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/98 border-t border-zinc-800 px-4 py-6 space-y-4 animate-in fade-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left text-base font-semibold tracking-wide uppercase py-2 border-b border-zinc-800 ${
                  activeTab === item.id ? 'text-[#FFC107]' : 'text-gray-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-4 flex flex-col space-y-4">
            {user ? (
              <div className="flex items-center justify-between bg-zinc-950 p-3 rounded-none border border-zinc-800">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-[#3B82F6]" />
                  <span className="text-sm font-semibold text-zinc-300">{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-1 text-red-400 hover:text-red-300 text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-[#FFC107] hover:bg-amber-500 text-black font-bold text-sm py-3 rounded-none uppercase tracking-wider text-center transition-all duration-300"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
