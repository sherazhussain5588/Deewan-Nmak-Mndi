import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import GalleryAndVideo from './components/GalleryAndVideo';
import Reviews from './components/Reviews';
import MenuSection from './components/MenuSection';
import BookingForm from './components/BookingForm';
import CartModal from './components/CartModal';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import { MenuItem, CartItem, User } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [authOpen, setAuthOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Load Session & Cart on start
  useEffect(() => {
    const savedToken = localStorage.getItem('diwan_auth_token');
    const savedUser = localStorage.getItem('diwan_user_data');
    const savedCart = localStorage.getItem('diwan_cart_data');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // Fetch initial menu
    fetchMenu();

    // Poll for updates every 8 seconds to support real-time sync with edits from other administrators
    const interval = setInterval(() => {
      fetchMenu();
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Scroll to top of window on tab switch to avoid showing bottom footer
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [activeTab]);

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      if (res.ok) {
        const data = await res.json();
        setMenuItems(data);
      }
    } catch (err) {
      console.error('Failed to fetch menu:', err);
    }
  };

  const handleAuthSuccess = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('diwan_auth_token', authToken);
    localStorage.setItem('diwan_user_data', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('diwan_auth_token');
    localStorage.removeItem('diwan_user_data');
    setActiveTab('home');
  };

  // Add to Cart
  const handleAddToCart = (item: MenuItem) => {
    const existing = cart.find((i) => i.menuItem.id === item.id);
    let updatedCart: CartItem[] = [];

    if (existing) {
      updatedCart = cart.map((i) =>
        i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updatedCart = [...cart, { menuItem: item, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem('diwan_cart_data', JSON.stringify(updatedCart));
  };

  // Update Cart Quantity
  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    let updatedCart: CartItem[] = [];

    if (quantity <= 0) {
      updatedCart = cart.filter((i) => i.menuItem.id !== itemId);
    } else {
      updatedCart = cart.map((i) =>
        i.menuItem.id === itemId ? { ...i, quantity } : i
      );
    }

    setCart(updatedCart);
    localStorage.setItem('diwan_cart_data', JSON.stringify(updatedCart));
  };

  const handleClearCart = () => {
    setCart([]);
    localStorage.removeItem('diwan_cart_data');
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Smooth scroll to element helper
  const scrollToMenu = () => {
    setActiveTab('menu');
    setTimeout(() => {
      document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const scrollToBook = () => {
    setActiveTab('book');
    setTimeout(() => {
      document.getElementById('book-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-[#FFC107] selection:text-black">
      
      {/* Global Navigation Header */}
      <Header
        user={user}
        onLogout={handleLogout}
        onOpenAuth={() => setAuthOpen(true)}
        cartCount={totalCartCount}
        onOpenCart={() => setCartOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Views Container */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <div className="animate-in fade-in duration-500">
            {/* Hero Banner */}
            <Hero onOrderNow={scrollToMenu} onBookTable={scrollToBook} />
            
            {/* Gallery and Promos */}
            <GalleryAndVideo />
            
            {/* Highlights Menu Section */}
            <MenuSection
              menuItems={menuItems}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
              onOpenCart={() => setCartOpen(true)}
            />
            
            {/* Reviews Section */}
            <Reviews />
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="animate-in fade-in duration-300">
            <MenuSection
              menuItems={menuItems}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
              onOpenCart={() => setCartOpen(true)}
            />
          </div>
        )}

        {activeTab === 'book' && (
          <div className="animate-in fade-in duration-300">
            <BookingForm user={user} onBookingSuccess={() => {}} />
          </div>
        )}

        {activeTab === 'dashboard' && user && token && (
          <div className="animate-in fade-in duration-300">
            <Dashboard user={user} token={token} />
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="animate-in fade-in duration-300">
            <AdminPanel
              token={token}
              user={user}
              onAuthSuccess={handleAuthSuccess}
              onLogout={handleLogout}
              setActiveTab={setActiveTab}
              onMenuChange={fetchMenu}
            />
          </div>
        )}
      </main>

      {/* Footer Branding & Contact Info */}
      <Footer onAdminClick={() => setActiveTab('admin')} />

      {/* Modal Dialogs */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <CartModal
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        user={user}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        onPlaceOrderSuccess={() => {}}
      />

    </div>
  );
}
