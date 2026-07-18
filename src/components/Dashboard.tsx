import { useState, useEffect } from 'react';
import { User, ShoppingBag, Calendar, Clock, RefreshCw, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Order, Booking, User as UserType } from '../types';

interface DashboardProps {
  user: UserType;
  token: string;
}

export default function Dashboard({ user, token }: DashboardProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'bookings'>('orders');

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const [ordersRes, bookingsRes] = await Promise.all([
        fetch('/api/orders', { headers }),
        fetch('/api/bookings', { headers })
      ]);

      if (ordersRes.ok && bookingsRes.ok) {
        const ordersData = await ordersRes.json();
        const bookingsData = await bookingsRes.json();
        setOrders(ordersData);
        setBookings(bookingsData);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
      case 'confirmed':
        return 'bg-green-500/10 text-green-400 border border-green-500/30';
      case 'preparing':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/30';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border border-red-500/30';
      default:
        return 'bg-red-600/10 text-red-400 border border-yellow-500/30';
    }
  };

  return (
    <div className="bg-black min-h-[80vh] text-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
         {/* Profile Card Summary */}
        <div className="bg-zinc-950 border border-zinc-900 p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="bg-[#FFC107] text-black p-4">
              <User className="h-6 w-6 text-black" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-serif font-light italic text-white uppercase tracking-tight">
                {user.name}
              </h2>
              <p className="text-zinc-500 text-xs mt-1 font-mono">{user.email} | {user.phone}</p>
              <span className="inline-block mt-3 bg-zinc-900 border border-zinc-800 text-[#FFC107] text-[9px] font-extrabold uppercase px-2.5 py-1 tracking-wider">
                Active Member
              </span>
            </div>
          </div>

          <button
            onClick={fetchData}
            className="flex items-center space-x-2 text-xs font-bold text-[#FFC107] hover:text-white uppercase tracking-wider bg-black px-5 py-3 rounded-none border border-zinc-800 hover:border-[#FFC107]/20 transition duration-300"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Stats</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 border-b border-zinc-900 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-2.5 pb-2 text-xs font-bold uppercase tracking-wider transition duration-300 border-b-2 ${
              activeTab === 'orders' ? 'text-[#FFC107] border-[#FFC107]' : 'text-zinc-500 border-transparent hover:text-white'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Order History ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center space-x-2.5 pb-2 text-xs font-bold uppercase tracking-wider transition duration-300 border-b-2 ${
              activeTab === 'bookings' ? 'text-[#FFC107] border-[#FFC107]' : 'text-zinc-500 border-transparent hover:text-white'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Reservations ({bookings.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        {loading ? (
          <div className="text-center py-20">
            <RefreshCw className="h-8 w-8 text-[#FFC107] animate-spin mx-auto mb-4" />
            <p className="text-zinc-500 text-xs uppercase tracking-widest">Loading records...</p>
          </div>
        ) : activeTab === 'orders' ? (
          /* Order History tab */
          orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-zinc-950 border border-zinc-900 p-6 sm:p-8 flex flex-col md:flex-row justify-between gap-6 hover:border-[#FFC107]/40 transition duration-300"
                >
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="text-[10px] font-mono font-bold text-zinc-500">ID: {order.id}</span>
                      <span className={`text-[9px] font-extrabold uppercase tracking-wider px-3 py-1 ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="text-[9px] bg-black text-zinc-400 font-extrabold uppercase px-3 py-1 border border-zinc-900">
                        {order.type === 'table' ? `Table Service (#${order.tableNumber})` : 'Home Delivery'}
                      </span>
                    </div>

                    {/* Items detail list */}
                    <div className="bg-black/50 p-4 border border-zinc-900 mb-4">
                      <ul className="divide-y divide-zinc-900 space-y-2">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between text-xs py-1.5 text-zinc-300">
                            <span>{item.name} <span className="text-[#EF4444] font-mono">x{item.quantity}</span></span>
                            <span className="font-mono text-zinc-500 font-bold">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-[10px] text-zinc-600 font-mono">
                      Placed on: {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {/* Summary / Totals */}
                  <div className="md:w-60 flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-zinc-900 pt-6 md:pt-0 md:pl-6 text-right">
                    <div>
                      <span className="block text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Total Bill Amount</span>
                      <span className="text-2xl font-bold text-[#FFC107] font-mono">Rs. {order.total.toLocaleString()}</span>
                    </div>

                    {order.status === 'pending' && (
                      <span className="text-[10px] text-[#FFC107]/70 italic flex items-center space-x-1.5 mt-4">
                        <AlertCircle className="h-3.5 w-3.5 inline" />
                        <span>Deewan chefs are preparing this order.</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-zinc-950 border border-zinc-900">
              <p className="text-zinc-500 text-sm">You haven't placed any orders yet.</p>
            </div>
          )
        ) : (
          /* Bookings/Reservations Tab */
          bookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-zinc-950 border border-zinc-900 p-6 sm:p-8 flex justify-between items-start hover:border-[#FFC107]/40 transition duration-300"
                >
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className={`text-[9px] font-extrabold uppercase tracking-wider px-3 py-1 ${getStatusBadgeClass(booking.status)}`}>
                        {booking.status}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">ID: {booking.id}</span>
                    </div>

                    <h4 className="text-lg font-serif italic text-white mb-2">Table Reservation</h4>
                    
                    <div className="space-y-2 text-xs text-zinc-400">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-[#FFC107]" />
                        <span>Date: <strong className="text-white">{booking.date}</strong> at <strong className="text-white">{booking.time} PM</strong></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-[#FFC107]" />
                        <span>Guests capacity: <strong className="text-white">{booking.guests} Persons</strong></span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[9px] text-zinc-500 font-mono text-right uppercase tracking-wider">
                    Booked on:<br />{new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-zinc-950 border border-zinc-900">
              <p className="text-zinc-500 text-sm">You haven't booked any tables yet.</p>
            </div>
          )
        )}

      </div>
    </div>
  );
}
