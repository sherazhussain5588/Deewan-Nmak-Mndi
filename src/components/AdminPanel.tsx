import { useState, useEffect, FormEvent } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  Utensils,
  Users,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Check,
  RefreshCw,
  X,
  Bell,
  MessageSquare,
  Lock,
  Mail,
  MapPin,
  Phone,
  Clock,
  Sparkles,
  TrendingUp,
  DollarSign,
  Menu,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { MenuItem, Order, Booking, User, Category } from '../types';

interface RestaurantSettings {
  name: string;
  location: string;
  phone: string;
  email: string;
  openingHours: string;
  whatsappEnabled: boolean;
  whatsappNumber: string;
  bannerImage: string;
  bannerTitle: string;
  bannerSubtitle: string;
}

interface AdminPanelProps {
  token: string | null;
  user: User | null;
  onAuthSuccess: (user: User, token: string) => void;
  onLogout: () => void;
  setActiveTab: (tab: string) => void;
  onMenuChange?: () => void;
}

export default function AdminPanel({
  token,
  user,
  onAuthSuccess,
  onLogout,
  setActiveTab: setGlobalActiveTab,
  onMenuChange
}: AdminPanelProps) {
  // Sidebar navigation panel selection
  const [activePanel, setActivePanel] = useState<'dashboard' | 'orders' | 'bookings' | 'menu' | 'customers' | 'settings'>('dashboard');
  
  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings>({
    name: 'Deewan Namak Mandi',
    location: 'Circular Road, near Town Hall, Dera Ismail Khan, Pakistan',
    phone: '+92 300 1234567',
    email: 'orders@deewan.com',
    openingHours: 'Monday - Sunday: 12:00 PM - 01:00 AM',
    whatsappEnabled: true,
    whatsappNumber: '+923001234567',
    bannerImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1600',
    bannerTitle: 'Sizzling Namak Mandi Karahi & Charcoal BBQ',
    bannerSubtitle: 'The Authentic Taste of Dera Ismail Khan'
  });

  const [loading, setLoading] = useState(true);
  const [prevOrdersCount, setPrevOrdersCount] = useState<number | null>(null);
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Authentication Fields (for direct Admin Login if not authenticated)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Selected details overlay states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);

  // Menu Form fields
  const [menuName, setMenuName] = useState('');
  const [menuPrice, setMenuPrice] = useState('');
  const [menuCategory, setMenuCategory] = useState<Category>('BBQ');
  const [menuImage, setMenuImage] = useState('');
  const [menuDesc, setMenuDesc] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Settings Form fields
  const [settingsName, setSettingsName] = useState('');
  const [settingsLocation, setSettingsLocation] = useState('');
  const [settingsPhone, setSettingsPhone] = useState('');
  const [settingsEmail, setSettingsEmail] = useState('');
  const [settingsHours, setSettingsHours] = useState('');
  const [settingsWhatsappEnabled, setSettingsWhatsappEnabled] = useState(true);
  const [settingsWhatsappNumber, setSettingsWhatsappNumber] = useState('');
  const [settingsBannerImage, setSettingsBannerImage] = useState('');
  const [settingsBannerTitle, setSettingsBannerTitle] = useState('');
  const [settingsBannerSubtitle, setSettingsBannerSubtitle] = useState('');

  // Filters and search fields
  const [ordersSearch, setOrdersSearch] = useState('');
  const [ordersStatusFilter, setOrdersStatusFilter] = useState<'all' | 'pending' | 'preparing' | 'completed' | 'cancelled'>('all');
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCategoryFilter, setMenuCategoryFilter] = useState<string>('all');
  const [customerSearch, setCustomerSearch] = useState('');

  // Custom non-blocking alert / confirmation states
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'menu' | 'order';
    id: string;
    title: string;
    message: string;
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const isAdmin = user && user.role === 'admin' && token;

  // Initialize and Sync Live Records
  const syncRecords = async (showLoader = true) => {
    if (!isAdmin || !token) return;
    if (showLoader) setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [ordersRes, bookingsRes, menuRes, usersRes, settingsRes] = await Promise.all([
        fetch('/api/orders', { headers }),
        fetch('/api/bookings', { headers }),
        fetch('/api/menu'),
        fetch('/api/users', { headers }),
        fetch('/api/settings')
      ]);

      if (ordersRes.ok && bookingsRes.ok && menuRes.ok && usersRes.ok) {
        const fetchedOrders: Order[] = await ordersRes.ok ? await ordersRes.json() : [];
        const fetchedBookings = await bookingsRes.ok ? await bookingsRes.json() : [];
        const fetchedMenu = await menuRes.ok ? await menuRes.json() : [];
        const fetchedUsers = await usersRes.ok ? await usersRes.json() : [];
        
        setOrders(fetchedOrders);
        setBookings(fetchedBookings);
        setMenu(fetchedMenu);
        setUsers(fetchedUsers);

        if (settingsRes.ok) {
          const fetchedSettings = await settingsRes.json();
          setSettings(fetchedSettings);
          // Populate settings forms
          setSettingsName(fetchedSettings.name);
          setSettingsLocation(fetchedSettings.location);
          setSettingsPhone(fetchedSettings.phone);
          setSettingsEmail(fetchedSettings.email);
          setSettingsHours(fetchedSettings.openingHours);
          setSettingsWhatsappEnabled(fetchedSettings.whatsappEnabled);
          setSettingsWhatsappNumber(fetchedSettings.whatsappNumber);
          setSettingsBannerImage(fetchedSettings.bannerImage || '');
          setSettingsBannerTitle(fetchedSettings.bannerTitle || '');
          setSettingsBannerSubtitle(fetchedSettings.bannerSubtitle || '');
        }

        // Real-time order count alerting logic
        if (prevOrdersCount !== null && fetchedOrders.length > prevOrdersCount) {
          setNewOrderAlert(true);
          // Simple visual / audio alert simulation
          try {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = context.createOscillator();
            const gain = context.createGain();
            osc.connect(gain);
            gain.connect(context.destination);
            osc.frequency.value = 587.33; // D5 pitch
            gain.gain.setValueAtTime(0.1, context.currentTime);
            osc.start();
            osc.stop(context.currentTime + 0.15);
          } catch (e) {
            console.log("Audio play blocked by browser policy");
          }
        }
        setPrevOrdersCount(fetchedOrders.length);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  // Automated 10-second polling for live records
  useEffect(() => {
    if (isAdmin && token) {
      syncRecords(true);
      const interval = setInterval(() => {
        syncRecords(false);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isAdmin, token]);

  // Handle direct Admin Login
  const handleAdminLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setAuthError('Please enter both email and password');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
      if (data.user.role !== 'admin') {
        throw new Error('Access denied: You must be an administrator.');
      }
      onAuthSuccess(data.user, data.token);
    } catch (err: any) {
      setAuthError(err.message || 'Login failed');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Order Status update
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: status as any } : o));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: status as any });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Order deletion
  const handleDeleteOrder = (orderId: string) => {
    setDeleteConfirm({
      type: 'order',
      id: orderId,
      title: 'Delete Order',
      message: 'Are you sure you want to permanently delete this order? This action is irreversible.'
    });
  };

  const executeDeleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        setOrders(orders.filter(o => o.id !== orderId));
        setSelectedOrder(null);
        setPrevOrdersCount(prev => prev !== null ? prev - 1 : null);
        showToast('Order permanently deleted', 'success');
      } else {
        showToast('Failed to delete order.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('An error occurred while deleting the order.', 'error');
    }
  };

  // Handle Booking Status update
  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: status as any } : b));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Menu Form (Add or Edit)
  const handleMenuSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!menuName || !menuPrice || !menuCategory || !menuImage || !menuDesc) {
      showToast('Please fill out all fields', 'error');
      return;
    }

    const payload = {
      name: menuName,
      price: Number(menuPrice),
      category: menuCategory,
      image: menuImage,
      description: menuDesc,
    };

    try {
      const url = editingItemId ? `/api/menu/${editingItemId}` : '/api/menu';
      const method = editingItemId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const item = await response.json();
        if (editingItemId) {
          setMenu(menu.map(m => m.id === editingItemId ? item : m));
          setEditingItemId(null);
          showToast('Menu item updated successfully!', 'success');
        } else {
          setMenu([...menu, item]);
          showToast('New menu item added successfully!', 'success');
        }
        onMenuChange?.();
        // Reset form
        setMenuName('');
        setMenuPrice('');
        setMenuCategory('BBQ');
        setMenuImage('');
        setMenuDesc('');
      } else {
        showToast('Failed to save menu item', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('An error occurred while saving the menu item.', 'error');
    }
  };

  // Populate Menu form for editing
  const handleEditMenuClick = (item: MenuItem) => {
    setEditingItemId(item.id);
    setMenuName(item.name);
    setMenuPrice(item.price.toString());
    setMenuCategory(item.category);
    setMenuImage(item.image);
    setMenuDesc(item.description);
    setActivePanel('menu'); // focus on manager panel
  };

  // Delete Menu Item
  const handleDeleteMenuItem = (itemId: string) => {
    setDeleteConfirm({
      type: 'menu',
      id: itemId,
      title: 'Delete Menu Item',
      message: 'Are you sure you want to permanently delete this menu item from the restaurant database?'
    });
  };

  const executeDeleteMenuItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/menu/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setMenu(menu.filter(m => m.id !== itemId));
        onMenuChange?.();
        showToast('Menu item deleted successfully', 'success');
      } else {
        showToast('Failed to delete menu item.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('An error occurred while deleting the menu item.', 'error');
    }
  };

  // Submit Settings Form
  const handleSettingsSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: settingsName,
        location: settingsLocation,
        phone: settingsPhone,
        email: settingsEmail,
        openingHours: settingsHours,
        whatsappEnabled: settingsWhatsappEnabled,
        whatsappNumber: settingsWhatsappNumber,
        bannerImage: settingsBannerImage,
        bannerTitle: settingsBannerTitle,
        bannerSubtitle: settingsBannerSubtitle
      };

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const updatedSettings = await response.json();
        setSettings(updatedSettings);
        showToast('Restaurant configuration updated successfully!', 'success');
      } else {
        showToast('Failed to update settings', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('An error occurred while updating settings.', 'error');
    }
  };

  // Formatted Helper to construct a WhatsApp web alert link
  const getWhatsappUrl = (order: Order) => {
    const itemsText = order.items.map(i => `${i.name} (x${i.quantity})`).join(', ');
    const messageText = `Assalamu Alaikum ${order.customerName},\n\nYour order from Deewan Namak Mandi is confirmed!\n\nOrder ID: ${order.id}\nItems: ${itemsText}\nTotal Bill: Rs. ${order.total.toLocaleString()}\nStatus: Preparing\n\nThank you for choosing Deewan!`;
    const formattedPhone = order.customerPhone.replace(/[\s+()-]/g, '');
    return `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(messageText)}`;
  };

  // Status style helper
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
      case 'confirmed':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'preparing':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'cancelled':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    }
  };

  // Quick stats calculation
  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.total, 0);

  const todayOrders = orders.filter(o => {
    const todayStr = new Date().toDateString();
    const orderStr = new Date(o.createdAt).toDateString();
    return todayStr === orderStr;
  });

  const todayRevenue = todayOrders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.total, 0);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(ordersSearch.toLowerCase()) ||
      order.customerName.toLowerCase().includes(ordersSearch.toLowerCase()) ||
      order.customerPhone.includes(ordersSearch);
    const matchesStatus = ordersStatusFilter === 'all' || order.status === ordersStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter menu
  const filteredMenuItems = menu.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(menuSearch.toLowerCase());
    const matchesCategory = menuCategoryFilter === 'all' || item.category === menuCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filter customers
  const filteredCustomers = users.filter(u => {
    return (
      u.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
      u.phone.includes(customerSearch)
    );
  });

  // Check if admin is NOT logged in: render the auth portal
  if (!isAdmin) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden shadow-2xl relative">
          
          <div className="bg-[#FFC107] text-black text-center py-10 px-6">
            <Lock className="h-8 w-8 mx-auto mb-3" />
            <h2 className="text-2xl font-serif italic uppercase tracking-wider font-light">
              Deewan <span className="font-bold">Staff Gate</span>
            </h2>
            <p className="text-[10px] uppercase font-bold tracking-widest mt-1.5 opacity-80">
              Authorized Restaurant Administration Access Only
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="p-8 space-y-5">
            {user && user.role !== 'admin' && (
              <div className="bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[11px] p-4 rounded-none leading-relaxed">
                You are currently logged in as <strong>{user.name}</strong> (Customer). 
                Please authenticate with an <strong>Administrator</strong> account to access the control panel.
              </div>
            )}

            {authError && (
              <div className="bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs p-4 rounded-none font-bold">
                {authError}
              </div>
            )}

            <div>
              <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-black border border-zinc-900 focus:border-[#FFC107] p-3 pl-10 text-xs text-white placeholder-zinc-700 rounded-none focus:outline-none transition"
                  placeholder="admin@deewan.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                Secret Access Code
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-black border border-zinc-900 focus:border-[#FFC107] p-3 pl-10 pr-10 text-xs text-white placeholder-zinc-700 rounded-none focus:outline-none transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-[#FFC107] hover:bg-amber-500 disabled:bg-zinc-800 text-black font-bold py-3.5 rounded-none uppercase text-xs tracking-widest transition-all duration-300 shadow-[0_4px_16px_rgba(255,193,7,0.15)]"
            >
              {authLoading ? 'Verifying Credentials...' : 'Authenticate Access'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Dashboard main layout
  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans flex flex-col lg:flex-row">
      
      {/* Dynamic Order Toast Alert banner */}
      {newOrderAlert && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#EF4444] border border-red-400 text-white px-6 py-4 shadow-2xl flex items-center space-x-4 animate-bounce max-w-md w-[90%] rounded-lg">
          <Bell className="h-5 w-5 text-white animate-pulse shrink-0" />
          <div className="flex-1 min-w-0">
            <h5 className="font-bold text-xs uppercase tracking-wider">New Order Alert!</h5>
            <p className="text-[11px] opacity-90 truncate">A brand-new order has just been placed live!</p>
          </div>
          <button
            onClick={() => {
              setNewOrderAlert(false);
              syncRecords(true);
            }}
            className="bg-black/20 hover:bg-black/40 text-white text-[10px] font-bold px-3 py-1.5 uppercase transition shrink-0"
          >
            Refreshed Pool
          </button>
        </div>
      )}

      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-zinc-950 border-b border-zinc-900 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-cursive text-xl font-bold text-[#EF4444]">Deewan</span>
          <span className="text-[10px] uppercase bg-[#FFC107]/10 text-[#FFC107] px-2 py-0.5 font-bold border border-[#FFC107]/20">Admin</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-zinc-400 hover:text-white transition focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`w-80 bg-zinc-950 border-r border-zinc-900 flex-col shrink-0 lg:flex ${
        mobileSidebarOpen ? 'flex fixed inset-y-0 left-0 z-50' : 'hidden'
      }`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-zinc-900 flex items-center justify-between bg-zinc-950">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-cursive text-2xl font-bold text-[#EF4444]">Deewan</span>
              <span className="font-urdu text-sm text-[#3B82F6]">نمک منڈی</span>
            </div>
            <p className="text-[8px] uppercase tracking-[0.25em] text-zinc-500 font-extrabold mt-1">
              Restaurant Control Deck
            </p>
          </div>
          {mobileSidebarOpen && (
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-2 text-zinc-500 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Current Active User Profile widget */}
        <div className="p-6 border-b border-zinc-900 bg-black/40">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-[#FFC107] text-black font-bold rounded-full flex items-center justify-center uppercase font-mono shadow-[0_0_12px_rgba(255,193,7,0.2)]">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h5 className="text-white text-xs font-bold uppercase truncate">{user.name}</h5>
              <span className="text-[9px] text-[#3B82F6] font-mono tracking-wider block font-bold uppercase mt-0.5">
                Role: Server {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation panel Links */}
        <nav className="flex-1 p-4 space-y-1 bg-zinc-950">
          {[
            { id: 'dashboard', label: 'Overview Panel', icon: LayoutDashboard },
            { id: 'orders', label: 'Live Orders Pool', icon: ShoppingBag, count: orders.filter(o => o.status === 'pending' || o.status === 'preparing').length },
            { id: 'bookings', label: 'Reservations', icon: Calendar, count: bookings.filter(b => b.status === 'pending').length },
            { id: 'menu', label: 'Menu Manager', icon: Utensils },
            { id: 'customers', label: 'Customer Hub', icon: Users },
            { id: 'settings', label: 'Content Settings', icon: Settings }
          ].map(item => {
            const isActive = activePanel === item.id;
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePanel(item.id as any);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-none border transition duration-300 ${
                  isActive
                    ? 'bg-[#FFC107] text-black border-[#FFC107] shadow-[0_4px_12px_rgba(255,193,7,0.1)]'
                    : 'bg-transparent text-zinc-400 border-transparent hover:text-white hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className={`px-2 py-0.5 text-[9px] font-mono font-bold ${
                    isActive ? 'bg-black text-white' : 'bg-[#EF4444] text-white'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-900 bg-zinc-950 space-y-2">
          <button
            onClick={() => setGlobalActiveTab('home')}
            className="w-full text-center py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold uppercase text-[10px] tracking-wider transition"
          >
            ← View Frontend Store
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 py-2.5 bg-rose-950/20 hover:bg-rose-900/40 text-rose-400 font-bold uppercase text-[10px] tracking-wider border border-rose-900/30 transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 bg-black p-6 lg:p-10 min-w-0">
        
        {/* Workspace Title & Live Sync Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-6 mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif text-white uppercase font-light tracking-tight italic">
              Staff Portal <span className="not-italic text-[#FFC107] font-bold">/ {activePanel}</span>
            </h2>
            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-1">
              Active configuration: {settings.name} (Live Sync Status)
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => syncRecords(true)}
              className="flex items-center space-x-2 bg-zinc-950 border border-zinc-900 hover:border-zinc-700 text-[#FFC107] hover:text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Force Sync</span>
            </button>
          </div>
        </div>

        {/* LOADING INDICATOR BLOCK */}
        {loading && (
          <div className="text-center py-24 bg-zinc-950 border border-zinc-900 p-8 mb-6">
            <RefreshCw className="h-10 w-10 text-[#FFC107] animate-spin mx-auto mb-4" />
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-500">Querying and syncing database records...</p>
          </div>
        )}

        {/* TAB WORKSPACES */}
        {!loading && (
          <>
            {/* 1. OVERVIEW PANEL TAB */}
            {activePanel === 'dashboard' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Metrics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-zinc-950 border border-zinc-900 p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-zinc-500 text-[9px] uppercase tracking-widest font-bold">
                      <span>Total Revenue Pool</span>
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                    </div>
                    <div className="mt-4">
                      <span className="block text-2xl font-bold font-mono text-[#FFC107]">Rs. {totalRevenue.toLocaleString()}</span>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wide block mt-1">From Completed Orders</span>
                    </div>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-900 p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-zinc-500 text-[9px] uppercase tracking-widest font-bold">
                      <span>Orders Today</span>
                      <ShoppingBag className="h-3.5 w-3.5 text-amber-500" />
                    </div>
                    <div className="mt-4">
                      <span className="block text-2xl font-bold font-mono text-white">{todayOrders.length}</span>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wide block mt-1">
                        Rs. {todayRevenue.toLocaleString()} completed
                      </span>
                    </div>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-900 p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-zinc-500 text-[9px] uppercase tracking-widest font-bold">
                      <span>Bookings Pending</span>
                      <Calendar className="h-3.5 w-3.5 text-blue-500" />
                    </div>
                    <div className="mt-4">
                      <span className="block text-2xl font-bold font-mono text-white">
                        {bookings.filter(b => b.status === 'pending').length}
                      </span>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wide block mt-1">
                        Out of {bookings.length} total reservations
                      </span>
                    </div>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-900 p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-zinc-500 text-[9px] uppercase tracking-widest font-bold">
                      <span>Active Menu Size</span>
                      <Utensils className="h-3.5 w-3.5 text-rose-500" />
                    </div>
                    <div className="mt-4">
                      <span className="block text-2xl font-bold font-mono text-white">{menu.length}</span>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wide block mt-1">Dishes listed on client</span>
                    </div>
                  </div>
                </div>

                {/* Main section of dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Recent Orders Pool */}
                  <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 p-6">
                    <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-900">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#FFC107]">Recent Orders Pool</h4>
                      <button
                        onClick={() => setActivePanel('orders')}
                        className="text-[10px] font-bold uppercase text-zinc-500 hover:text-white transition"
                      >
                        See All
                      </button>
                    </div>

                    {orders.length > 0 ? (
                      <div className="divide-y divide-zinc-900">
                        {orders.slice(0, 5).map(o => (
                          <div
                            key={o.id}
                            onClick={() => {
                              setSelectedOrder(o);
                              setActivePanel('orders');
                            }}
                            className="py-4 flex items-center justify-between hover:bg-zinc-900/30 px-2 cursor-pointer transition rounded-sm"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center space-x-2.5">
                                <span className="text-xs font-mono font-bold text-white">{o.id}</span>
                                <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 ${getStatusBadgeClass(o.status)}`}>
                                  {o.status}
                                </span>
                              </div>
                              <p className="text-[11px] text-zinc-400 mt-1 uppercase font-bold">
                                {o.customerName} • {o.items.length} items
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="block text-xs font-bold font-mono text-[#FFC107]">
                                Rs. {o.total.toLocaleString()}
                              </span>
                              <span className="text-[9px] text-zinc-500 font-mono block mt-0.5">
                                {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 text-zinc-500 text-xs uppercase tracking-wider">
                        No orders have been recorded yet.
                      </div>
                    )}
                  </div>

                  {/* Right Column: Mini Stats Summary & Contacts */}
                  <div className="space-y-6">
                    <div className="bg-zinc-950 border border-zinc-900 p-6">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 pb-2 border-b border-zinc-900">
                        Real-time Orders Feed Status
                      </h4>
                      <ul className="space-y-4 text-xs">
                        <li className="flex justify-between items-center">
                          <span className="text-zinc-500 uppercase font-bold text-[10px]">Pending Orders</span>
                          <span className="font-mono text-white font-bold bg-[#EF4444]/10 text-[#EF4444] px-2.5 py-0.5 border border-red-500/20">
                            {orders.filter(o => o.status === 'pending').length}
                          </span>
                        </li>
                        <li className="flex justify-between items-center">
                          <span className="text-zinc-500 uppercase font-bold text-[10px]">Preparing Orders</span>
                          <span className="font-mono text-white font-bold bg-amber-500/10 text-amber-400 px-2.5 py-0.5 border border-amber-500/20">
                            {orders.filter(o => o.status === 'preparing').length}
                          </span>
                        </li>
                        <li className="flex justify-between items-center">
                          <span className="text-zinc-500 uppercase font-bold text-[10px]">Completed Orders</span>
                          <span className="font-mono text-white font-bold bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 border border-emerald-500/20">
                            {orders.filter(o => o.status === 'completed').length}
                          </span>
                        </li>
                        <li className="flex justify-between items-center">
                          <span className="text-zinc-500 uppercase font-bold text-[10px]">Cancelled Orders</span>
                          <span className="font-mono text-white font-bold bg-zinc-900 text-zinc-500 px-2.5 py-0.5 border border-zinc-800">
                            {orders.filter(o => o.status === 'cancelled').length}
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-900 p-6">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#FFC107] mb-4 pb-2 border-b border-zinc-900">
                        Integration Status
                      </h4>
                      <div className="space-y-3.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400 font-bold text-[10px] uppercase">WhatsApp API alerts</span>
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 border ${
                            settings.whatsappEnabled
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                              : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                          }`}>
                            {settings.whatsappEnabled ? 'ENABLED' : 'DISABLED'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400 font-bold text-[10px] uppercase">Notification Audio</span>
                          <span className="text-[9px] font-mono text-zinc-400">Standard WebAudio</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 italic leading-relaxed pt-1.5 border-t border-zinc-900">
                          * Placement of new orders automatically triggers an alert banner and play sound instantly.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. LIVE ORDERS POOL TAB */}
            {activePanel === 'orders' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-950 p-5 border border-zinc-900">
                  <div className="w-full md:w-80">
                    <input
                      type="text"
                      value={ordersSearch}
                      onChange={(e) => setOrdersSearch(e.target.value)}
                      className="w-full bg-black border border-zinc-900 focus:border-[#FFC107] p-3 text-xs text-white placeholder-zinc-700 focus:outline-none"
                      placeholder="Search ID, customer name or phone..."
                    />
                  </div>

                  <div className="flex space-x-2 w-full md:w-auto overflow-x-auto scrollbar-none">
                    {['all', 'pending', 'preparing', 'completed', 'cancelled'].map(status => (
                      <button
                        key={status}
                        onClick={() => setOrdersStatusFilter(status as any)}
                        className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap ${
                          ordersStatusFilter === status
                            ? 'bg-[#FFC107] text-black border-[#FFC107]'
                            : 'bg-black text-zinc-500 border-zinc-900 hover:border-zinc-800 hover:text-white'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orders Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  
                  {/* Orders List Pool (2 cols) */}
                  <div className="lg:col-span-2 space-y-4">
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map(order => {
                        const isSelected = selectedOrder && selectedOrder.id === order.id;
                        return (
                          <div
                            key={order.id}
                            onClick={() => setSelectedOrder(order)}
                            className={`p-6 bg-zinc-950 border rounded-none transition duration-300 cursor-pointer ${
                              isSelected
                                ? 'border-[#FFC107] shadow-[0_4px_24px_rgba(255,193,7,0.04)]'
                                : 'border-zinc-900 hover:border-zinc-800'
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                              <div className="flex items-center space-x-2.5">
                                <span className="text-xs font-mono font-bold text-white uppercase">ID: {order.id}</span>
                                <span className={`text-[8px] font-extrabold uppercase px-2.5 py-0.5 ${getStatusBadgeClass(order.status)}`}>
                                  {order.status}
                                </span>
                              </div>
                              <span className="text-[10px] text-zinc-500 font-mono">
                                {new Date(order.createdAt).toLocaleString()}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mb-4">
                              <div>
                                <span className="block text-[8px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Customer</span>
                                <strong className="text-white uppercase font-bold tracking-wide">{order.customerName}</strong>
                                <p className="text-zinc-500 font-mono mt-0.5">{order.customerPhone}</p>
                              </div>
                              <div>
                                <span className="block text-[8px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Type</span>
                                <span className="uppercase text-zinc-300 font-semibold">
                                  {order.type === 'table' ? `Table Service #${order.tableNumber}` : 'Home Delivery'}
                                </span>
                              </div>
                              <div className="sm:text-right">
                                <span className="block text-[8px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Total Bill</span>
                                <strong className="text-[#FFC107] font-mono text-base">Rs. {order.total.toLocaleString()}</strong>
                              </div>
                            </div>

                            {/* Actions bar */}
                            <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-900/60 items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-[9px] font-bold uppercase text-zinc-500 tracking-wider">Status:</span>
                                <select
                                  value={order.status}
                                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="bg-black border border-zinc-900 py-1.5 px-3 text-[10px] uppercase font-bold text-white focus:outline-none focus:border-[#FFC107] rounded-none cursor-pointer"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="preparing">Preparing</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </div>

                              <div className="flex items-center space-x-2" onClick={e => e.stopPropagation()}>
                                {settings.whatsappEnabled && (
                                  <a
                                    href={getWhatsappUrl(order)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center space-x-1.5 bg-emerald-950 border border-emerald-900/40 hover:bg-emerald-900/30 text-emerald-400 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider"
                                  >
                                    <MessageSquare className="h-3 w-3" />
                                    <span>WhatsApp Alert</span>
                                  </a>
                                )}
                                <button
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="p-1.5 text-zinc-600 hover:text-rose-500 border border-transparent hover:border-rose-950/20 rounded-none transition"
                                  title="Delete Order Record"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-20 bg-zinc-950 border border-zinc-900">
                        <p className="text-zinc-500 text-xs uppercase tracking-wider">No matching orders found</p>
                      </div>
                    )}
                  </div>

                  {/* Order Details Paper Invoice Panel (1 col) */}
                  <div className="lg:sticky lg:top-24">
                    {selectedOrder ? (
                      <div className="bg-zinc-950 border border-[#FFC107]/40 p-6 shadow-2xl relative space-y-6">
                        <button
                          onClick={() => setSelectedOrder(null)}
                          className="absolute top-4 right-4 text-zinc-500 hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>

                        {/* Invoice Header */}
                        <div className="text-center pb-4 border-b border-zinc-900">
                          <h4 className="font-cursive text-2xl font-bold text-[#EF4444] leading-none">Deewan</h4>
                          <span className="font-urdu text-[10px] text-[#3B82F6] block mt-1 tracking-wider">نمک منڈی دسترخوان</span>
                          <p className="text-[8px] uppercase tracking-[0.25em] text-zinc-500 font-extrabold mt-2">
                            CIRCULAR ROAD, D.I KHAN
                          </p>
                        </div>

                        {/* Receipt details */}
                        <div className="space-y-4 text-xs font-mono">
                          <div className="flex justify-between border-b border-zinc-900/60 pb-2">
                            <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Receipt No</span>
                            <span className="text-white font-bold">{selectedOrder.id}</span>
                          </div>
                          <div className="flex justify-between border-b border-zinc-900/60 pb-2">
                            <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Service Mode</span>
                            <span className="text-white uppercase font-bold">
                              {selectedOrder.type === 'table' ? `Table #${selectedOrder.tableNumber}` : 'Home Delivery'}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-zinc-900/60 pb-2">
                            <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Customer</span>
                            <span className="text-white uppercase font-bold truncate max-w-[150px]">{selectedOrder.customerName}</span>
                          </div>
                          <div className="flex justify-between border-b border-zinc-900/60 pb-2">
                            <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Phone No</span>
                            <span className="text-white font-bold">{selectedOrder.customerPhone}</span>
                          </div>
                          <div className="flex justify-between border-b border-zinc-900/60 pb-2">
                            <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Time Stamp</span>
                            <span className="text-white font-bold text-[10px]">
                              {new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        {/* Items Section */}
                        <div className="space-y-2 border-b border-zinc-900/60 pb-4">
                          <h5 className="text-[10px] uppercase tracking-wider text-zinc-500 font-extrabold font-mono">Billable Dishes:</h5>
                          <div className="divide-y divide-zinc-900 font-mono text-xs">
                            {selectedOrder.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between py-2">
                                <span className="text-zinc-300">
                                  {item.name} <strong className="text-[#EF4444]">x{item.quantity}</strong>
                                </span>
                                <span className="text-white font-bold">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Totals section */}
                        <div className="space-y-2 font-mono text-xs">
                          <div className="flex justify-between">
                            <span className="text-zinc-500 uppercase tracking-wide text-[9px]">Subtotal</span>
                            <span className="text-zinc-300 font-bold">Rs. {selectedOrder.subtotal.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500 uppercase tracking-wide text-[9px]">Tax (5% GST)</span>
                            <span className="text-zinc-300 font-bold">Rs. {selectedOrder.tax.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between pt-3 border-t border-dashed border-zinc-900 text-sm">
                            <span className="text-[#FFC107] uppercase tracking-wider font-bold">GRAND TOTAL</span>
                            <strong className="text-[#FFC107] font-bold">Rs. {selectedOrder.total.toLocaleString()}</strong>
                          </div>
                        </div>

                        {/* Quick action controls in detail card */}
                        <div className="pt-4 border-t border-zinc-900 space-y-3">
                          <div>
                            <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-2 font-mono">
                              Update Invoice Status:
                            </label>
                            <div className="flex gap-2">
                              {['pending', 'preparing', 'completed'].map(st => (
                                <button
                                  key={st}
                                  onClick={() => handleUpdateOrderStatus(selectedOrder.id, st)}
                                  className={`flex-1 text-[9px] font-bold uppercase py-2 border font-mono transition ${
                                    selectedOrder.status === st
                                      ? 'bg-zinc-900 text-[#FFC107] border-[#FFC107]'
                                      : 'bg-transparent text-zinc-600 border-zinc-900 hover:text-white'
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-zinc-950 border border-zinc-900 p-8 text-center rounded-none text-xs text-zinc-500 uppercase tracking-wider">
                        Select an order to generate the detailed receipt & execute bill operations.
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* 3. TABLE RESERVATIONS TAB */}
            {activePanel === 'bookings' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {bookings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-zinc-950 border border-zinc-900 p-6 flex flex-col justify-between hover:border-[#FFC107]/30 transition duration-300"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4 border-b border-zinc-900 pb-3">
                            <span className={`text-[9px] font-extrabold uppercase tracking-wider px-3 py-1 ${getStatusBadgeClass(booking.status)}`}>
                              {booking.status}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono">BOOKING ID: {booking.id}</span>
                          </div>

                          <h4 className="text-xl font-serif italic text-white uppercase">{booking.name}</h4>
                          <p className="text-[9px] text-[#FFC107] font-mono tracking-widest mt-1 mb-4 uppercase font-bold">
                            PHONE CONTACT: {booking.phone}
                          </p>
                          
                          <div className="grid grid-cols-3 gap-2 bg-black p-4 border border-zinc-900 text-center text-xs text-zinc-300 font-mono">
                            <div>
                              <span className="block text-[8px] text-zinc-500 uppercase tracking-wider mb-1 font-sans">Date</span>
                              <strong className="text-white font-bold">{booking.date}</strong>
                            </div>
                            <div>
                              <span className="block text-[8px] text-zinc-500 uppercase tracking-wider mb-1 font-sans">Time Range</span>
                              <strong className="text-white font-bold">{booking.time}</strong>
                            </div>
                            <div>
                              <span className="block text-[8px] text-zinc-500 uppercase tracking-wider mb-1 font-sans">Pax count</span>
                              <strong className="text-white font-bold">{booking.guests} Guests</strong>
                            </div>
                          </div>
                        </div>

                        {/* Confirmation Actions dropdown */}
                        <div className="mt-6 pt-4 border-t border-zinc-900 flex gap-3">
                          <button
                            onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                            disabled={booking.status === 'confirmed'}
                            className="flex-1 bg-zinc-950 border border-zinc-900 hover:border-emerald-500 hover:text-emerald-400 disabled:border-zinc-900 disabled:text-zinc-600 py-3 text-[10px] font-bold uppercase tracking-wider transition cursor-pointer"
                          >
                            Confirm Reservation
                          </button>
                          <button
                            onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                            disabled={booking.status === 'cancelled'}
                            className="flex-1 bg-zinc-950 border border-zinc-900 hover:border-rose-500 hover:text-rose-400 disabled:border-zinc-900 disabled:text-zinc-600 py-3 text-[10px] font-bold uppercase tracking-wider transition cursor-pointer"
                          >
                            Decline & Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-zinc-950 border border-zinc-900">
                    <p className="text-zinc-500 text-xs uppercase tracking-wider">No bookings recorded yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* 4. MENU MANAGER TAB */}
            {activePanel === 'menu' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
                {/* Add/Edit Form Pane (5 cols) */}
                <div className="lg:col-span-5 bg-zinc-950 border border-zinc-900 p-6 sm:p-8 h-fit">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-6">
                    <h3 className="text-base font-serif font-light italic uppercase tracking-wider text-white">
                      {editingItemId ? 'Modify Dish Detail' : 'Create New Dish Item'}
                    </h3>
                    {editingItemId && (
                      <button
                        onClick={() => {
                          setEditingItemId(null);
                          setMenuName('');
                          setMenuPrice('');
                          setMenuCategory('BBQ');
                          setMenuImage('');
                          setMenuDesc('');
                        }}
                        className="text-[9px] text-rose-400 hover:text-rose-300 font-bold uppercase flex items-center space-x-1"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Cancel Edit</span>
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleMenuSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                        Dish / Item Name
                      </label>
                      <input
                        type="text"
                        required
                        value={menuName}
                        onChange={(e) => setMenuName(e.target.value)}
                        className="w-full bg-black border border-zinc-900 p-3 text-xs text-white focus:outline-none focus:border-[#FFC107] placeholder-zinc-750"
                        placeholder="e.g. Special Peshawari Karahi"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                          Price in Rs.
                        </label>
                        <input
                          type="number"
                          required
                          value={menuPrice}
                          onChange={(e) => setMenuPrice(e.target.value)}
                          className="w-full bg-black border border-zinc-900 p-3 text-xs text-white focus:outline-none focus:border-[#FFC107] placeholder-zinc-750"
                          placeholder="e.g. 1450"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                          Dish Category
                        </label>
                        <select
                          value={menuCategory}
                          onChange={(e) => setMenuCategory(e.target.value as Category)}
                          className="w-full bg-black border border-zinc-900 p-3 text-xs text-white focus:outline-none focus:border-[#FFC107]"
                        >
                          <option value="BBQ">BBQ</option>
                          <option value="Karahi">Karahi</option>
                          <option value="Roti">Roti</option>
                          <option value="Rice">Rice</option>
                          <option value="Raita & Salad">Raita & Salad</option>
                          <option value="Drinks">Drinks</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                        Dish Image Source (URL or Asset Path)
                      </label>
                      <input
                        type="text"
                        required
                        value={menuImage}
                        onChange={(e) => setMenuImage(e.target.value)}
                        className="w-full bg-black border border-zinc-900 p-3 text-xs text-white focus:outline-none focus:border-[#FFC107] placeholder-zinc-750"
                        placeholder="e.g. https://picsum.photos/seed/dish/400/400"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                        Dish Recipe Description
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={menuDesc}
                        onChange={(e) => setMenuDesc(e.target.value)}
                        className="w-full bg-black border border-zinc-900 p-3 text-xs text-white focus:outline-none focus:border-[#FFC107] placeholder-zinc-750 leading-relaxed"
                        placeholder="e.g. Hand-carved fresh meat slow-cooked with tomatoes, fresh ginger, and traditional Peshawar spices on a high fire..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#FFC107] hover:bg-amber-500 text-black font-bold py-3.5 rounded-none uppercase text-xs tracking-widest transition-all duration-300 shadow-[0_4px_12px_rgba(255,193,7,0.15)]"
                    >
                      {editingItemId ? 'Update Dish Details' : 'Save Dish to Menu Pool'}
                    </button>
                  </form>
                </div>

                {/* Live Menu Pool Panel List (7 cols) */}
                <div className="lg:col-span-7 bg-zinc-950 border border-zinc-900 rounded-none overflow-hidden flex flex-col">
                  {/* List Header & Search */}
                  <div className="p-6 border-b border-zinc-900 space-y-4 bg-zinc-950">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="text-xs font-bold text-[#FFC107] uppercase tracking-widest">
                        Live Food Dishes Pool ({filteredMenuItems.length})
                      </h3>
                      <div className="flex gap-2">
                        <select
                          value={menuCategoryFilter}
                          onChange={(e) => setMenuCategoryFilter(e.target.value)}
                          className="bg-black border border-zinc-900 py-1.5 px-3 text-[10px] font-bold uppercase text-zinc-400 focus:outline-none focus:border-[#FFC107]"
                        >
                          <option value="all">All Categories</option>
                          <option value="BBQ">BBQ</option>
                          <option value="Karahi">Karahi</option>
                          <option value="Roti">Roti</option>
                          <option value="Rice">Rice</option>
                          <option value="Raita & Salad">Raita & Salad</option>
                          <option value="Drinks">Drinks</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={menuSearch}
                        onChange={(e) => setMenuSearch(e.target.value)}
                        className="w-full bg-black border border-zinc-900 focus:border-[#FFC107] p-2.5 text-xs text-white placeholder-zinc-700 focus:outline-none"
                        placeholder="Filter dishes by name or key ingredient..."
                      />
                    </div>
                  </div>

                  {/* Table area */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-zinc-900 text-zinc-500 uppercase font-bold tracking-wider">
                          <th className="p-4 text-[8px] tracking-widest">Dish Thumbnail & Title</th>
                          <th className="p-4 text-[8px] tracking-widest">Category</th>
                          <th className="p-4 text-[8px] tracking-widest">Pricing</th>
                          <th className="p-4 text-right text-[8px] tracking-widest">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900 font-medium">
                        {filteredMenuItems.map((item) => (
                          <tr key={item.id} className="hover:bg-zinc-900/20 border-b border-zinc-900/60">
                            <td className="p-4 flex items-center space-x-3.5">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 rounded-sm object-cover border border-zinc-900 shrink-0"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  // Fallback image if broken
                                  (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/genericfood/200/200';
                                }}
                              />
                              <div className="min-w-0">
                                <span className="font-bold text-white uppercase text-xs block truncate max-w-[180px]">{item.name}</span>
                                <span className="text-zinc-500 text-[10px] block truncate max-w-[180px] font-mono">{item.id}</span>
                              </div>
                            </td>
                            <td className="p-4 uppercase text-zinc-400 font-semibold">{item.category}</td>
                            <td className="p-4 font-mono text-[#FFC107] font-bold">Rs. {item.price.toLocaleString()}</td>
                            <td className="p-4 text-right space-x-2 shrink-0">
                              <button
                                onClick={() => handleEditMenuClick(item)}
                                className="p-2 text-zinc-500 hover:text-[#FFC107] transition"
                                title="Edit Item Details"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteMenuItem(item.id)}
                                className="p-2 text-zinc-700 hover:text-rose-500 transition"
                                title="Delete Item"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 5. CUSTOMER HUB TAB */}
            {activePanel === 'customers' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in duration-300">
                {/* Registered Customers Pool (2 cols) */}
                <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 rounded-none overflow-hidden">
                  <div className="p-6 border-b border-zinc-900 bg-zinc-950 space-y-4">
                    <h3 className="text-xs font-bold text-[#FFC107] uppercase tracking-widest">
                      Registered Customer Base ({filteredCustomers.length})
                    </h3>
                    <input
                      type="text"
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      className="w-full bg-black border border-zinc-900 focus:border-[#FFC107] p-2.5 text-xs text-white placeholder-zinc-700 focus:outline-none"
                      placeholder="Search customers by name, email or phone..."
                    />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-zinc-900 text-zinc-500 uppercase font-bold tracking-wider">
                          <th className="p-4 text-[8px] tracking-widest">Customer Name</th>
                          <th className="p-4 text-[8px] tracking-widest">Email Contact</th>
                          <th className="p-4 text-[8px] tracking-widest">Phone</th>
                          <th className="p-4 text-right text-[8px] tracking-widest">Total Orders</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900 font-medium">
                        {filteredCustomers.map((u) => {
                          const customerOrders = orders.filter(o => o.userId === u.id || o.customerPhone === u.phone);
                          const isSelected = selectedCustomer && selectedCustomer.id === u.id;
                          return (
                            <tr
                              key={u.id}
                              onClick={() => setSelectedCustomer(u)}
                              className={`cursor-pointer transition border-b border-zinc-900/60 ${
                                isSelected ? 'bg-zinc-900/60 text-white' : 'hover:bg-zinc-900/20 text-zinc-300'
                              }`}
                            >
                              <td className="p-4 uppercase font-bold text-white flex items-center space-x-2">
                                <UserCheck className="h-4 w-4 text-[#3B82F6] shrink-0" />
                                <span>{u.name}</span>
                              </td>
                              <td className="p-4 font-mono text-zinc-400">{u.email}</td>
                              <td className="p-4 font-mono text-zinc-400">{u.phone}</td>
                              <td className="p-4 text-right font-mono font-bold text-[#FFC107] pr-6">
                                {customerOrders.length}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Customer Purchase History Pane (1 col) */}
                <div className="lg:sticky lg:top-24">
                  {selectedCustomer ? (
                    <div className="bg-zinc-950 border border-zinc-900 p-6 shadow-2xl space-y-6">
                      <div className="flex justify-between items-start border-b border-zinc-900 pb-3">
                        <div>
                          <h4 className="text-sm font-bold uppercase text-white tracking-wide">{selectedCustomer.name}</h4>
                          <span className="text-[9px] text-[#3B82F6] font-mono tracking-wider block mt-0.5">
                            ID: {selectedCustomer.id}
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedCustomer(null)}
                          className="text-zinc-500 hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Contact details */}
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-zinc-500 uppercase tracking-widest text-[8px] font-bold">Email</span>
                          <span className="text-zinc-300 font-mono">{selectedCustomer.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500 uppercase tracking-widest text-[8px] font-bold">Phone Contact</span>
                          <span className="text-zinc-300 font-mono">{selectedCustomer.phone}</span>
                        </div>
                      </div>

                      {/* Historical Orders */}
                      <div className="space-y-3 pt-4 border-t border-zinc-900">
                        <h5 className="text-[9px] font-bold uppercase tracking-wider text-[#FFC107]">
                          Purchase History ({orders.filter(o => o.userId === selectedCustomer.id || o.customerPhone === selectedCustomer.phone).length})
                        </h5>
                        
                        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                          {orders.filter(o => o.userId === selectedCustomer.id || o.customerPhone === selectedCustomer.phone).length > 0 ? (
                            orders
                              .filter(o => o.userId === selectedCustomer.id || o.customerPhone === selectedCustomer.phone)
                              .map(o => (
                                <div
                                  key={o.id}
                                  className="p-3 bg-black border border-zinc-900 text-xs flex justify-between items-center hover:border-zinc-800 transition"
                                >
                                  <div>
                                    <span className="font-mono text-white font-bold block">{o.id}</span>
                                    <span className="text-[10px] text-zinc-500 block font-mono mt-0.5">
                                      {new Date(o.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[#FFC107] font-mono font-bold block">Rs. {o.total.toLocaleString()}</span>
                                    <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 inline-block mt-0.5 ${getStatusBadgeClass(o.status)}`}>
                                      {o.status}
                                    </span>
                                  </div>
                                </div>
                              ))
                          ) : (
                            <p className="text-zinc-600 text-xs italic">This customer has placed no orders yet.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-zinc-950 border border-zinc-900 p-8 text-center rounded-none text-xs text-zinc-500 uppercase tracking-wider">
                      Select a customer to load their complete registration status & history log.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 6. SETTINGS & CONTENT MANAGER TAB */}
            {activePanel === 'settings' && (
              <div className="bg-zinc-950 border border-zinc-900 p-6 sm:p-8 animate-in fade-in duration-300">
                <form onSubmit={handleSettingsSubmit} className="space-y-8 text-xs">
                  
                  {/* Category: Restaurant Identity */}
                  <div>
                    <h4 className="text-xs font-bold text-[#FFC107] uppercase tracking-[0.2em] mb-4 pb-1.5 border-b border-zinc-900 flex items-center gap-2">
                      <Sliders className="h-4 w-4" />
                      <span>Restaurant Branding & Identity</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                          Restaurant Name
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsName}
                          onChange={(e) => setSettingsName(e.target.value)}
                          className="w-full bg-black border border-zinc-900 p-3 text-xs text-white focus:outline-none focus:border-[#FFC107]"
                          placeholder="Deewan Namak Mandi"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                          Opening Hours Timings
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsHours}
                          onChange={(e) => setSettingsHours(e.target.value)}
                          className="w-full bg-black border border-zinc-900 p-3 text-xs text-white focus:outline-none focus:border-[#FFC107]"
                          placeholder="Monday - Sunday: 12:00 PM - 01:00 AM"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category: Contacts & Coordinates */}
                  <div>
                    <h4 className="text-xs font-bold text-[#FFC107] uppercase tracking-[0.2em] mb-4 pb-1.5 border-b border-zinc-900">
                      Coordinates & Direct Contacts
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                          Contact Phone Number
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsPhone}
                          onChange={(e) => setSettingsPhone(e.target.value)}
                          className="w-full bg-black border border-zinc-900 p-3 text-xs text-white focus:outline-none focus:border-[#FFC107]"
                          placeholder="+92 300 1234567"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                          Billing Contact Email
                        </label>
                        <input
                          type="email"
                          required
                          value={settingsEmail}
                          onChange={(e) => setSettingsEmail(e.target.value)}
                          className="w-full bg-black border border-zinc-900 p-3 text-xs text-white focus:outline-none focus:border-[#FFC107]"
                          placeholder="orders@deewan.com"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                          WhatsApp Admin Number (Alerts)
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsWhatsappNumber}
                          onChange={(e) => setSettingsWhatsappNumber(e.target.value)}
                          className="w-full bg-black border border-zinc-900 p-3 text-xs text-white focus:outline-none focus:border-[#FFC107]"
                          placeholder="+923001234567"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                        Geographic Location Address
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsLocation}
                        onChange={(e) => setSettingsLocation(e.target.value)}
                        className="w-full bg-black border border-zinc-900 p-3 text-xs text-white focus:outline-none focus:border-[#FFC107]"
                        placeholder="Circular Road, near Town Hall, Dera Ismail Khan, Pakistan"
                      />
                    </div>
                  </div>

                  {/* Category: Banner Hero Presentation */}
                  <div>
                    <h4 className="text-xs font-bold text-[#FFC107] uppercase tracking-[0.2em] mb-4 pb-1.5 border-b border-zinc-900">
                      Banner Presentation & Imagery
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                          Banner Display Title
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsBannerTitle}
                          onChange={(e) => setSettingsBannerTitle(e.target.value)}
                          className="w-full bg-black border border-zinc-900 p-3 text-xs text-white focus:outline-none focus:border-[#FFC107]"
                          placeholder="Sizzling Namak Mandi Karahi & Charcoal BBQ"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                          Banner Display Subtitle
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsBannerSubtitle}
                          onChange={(e) => setSettingsBannerSubtitle(e.target.value)}
                          className="w-full bg-black border border-zinc-900 p-3 text-xs text-white focus:outline-none focus:border-[#FFC107]"
                          placeholder="The Authentic Taste of Dera Ismail Khan"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                        Hero Banner Background Image URL
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsBannerImage}
                        onChange={(e) => setSettingsBannerImage(e.target.value)}
                        className="w-full bg-black border border-zinc-900 p-3 text-xs text-white focus:outline-none focus:border-[#FFC107]"
                        placeholder="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1600"
                      />
                    </div>
                  </div>

                  {/* Category: System Toggles */}
                  <div>
                    <h4 className="text-xs font-bold text-[#FFC107] uppercase tracking-[0.2em] mb-4 pb-1.5 border-b border-zinc-900">
                      System Notification Integrations
                    </h4>

                    <div className="flex items-center space-x-3.5">
                      <input
                        type="checkbox"
                        id="whatsapp-toggle"
                        checked={settingsWhatsappEnabled}
                        onChange={(e) => setSettingsWhatsappEnabled(e.target.checked)}
                        className="h-4.5 w-4.5 accent-[#FFC107] rounded-sm bg-black border border-zinc-900 cursor-pointer"
                      />
                      <label htmlFor="whatsapp-toggle" className="text-xs text-zinc-300 font-bold uppercase select-none cursor-pointer">
                        Enable WhatsApp Notification Triggers for Staff Alerts
                      </label>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-2 italic leading-relaxed">
                      * Enabling this config generates a live WhatsApp pre-filled notification dispatch action for every placed order in the Orders Pool.
                    </p>
                  </div>

                  {/* Submission */}
                  <div className="pt-4 border-t border-zinc-900">
                    <button
                      type="submit"
                      className="bg-[#FFC107] hover:bg-amber-500 text-black font-bold px-8 py-3.5 rounded-none uppercase text-xs tracking-widest transition duration-300"
                    >
                      Save Global Configuration
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}

      </main>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 bg-[#0c0c0e] border border-zinc-900 px-5 py-4 shadow-2xl">
          {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />}
          {toast.type === 'info' && <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />}
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-100">{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-zinc-600 hover:text-zinc-400 p-1">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0a0a0c] border border-zinc-900 rounded-none p-6 md:p-8 space-y-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-none shrink-0">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white">{deleteConfirm.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{deleteConfirm.message}</p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-zinc-900">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-5 py-2.5 bg-zinc-950 border border-zinc-900 hover:border-zinc-700 text-zinc-400 text-[10px] font-bold uppercase tracking-widest transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const { type, id } = deleteConfirm;
                  setDeleteConfirm(null);
                  if (type === 'menu') {
                    await executeDeleteMenuItem(id);
                  } else if (type === 'order') {
                    await executeDeleteOrder(id);
                  }
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold uppercase tracking-widest transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
