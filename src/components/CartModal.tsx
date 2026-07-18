import { useState, FormEvent } from 'react';
import { X, Trash2, ShoppingBag, Send, CreditCard, ChevronRight, CheckCircle } from 'lucide-react';
import { CartItem, User } from '../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  user: User | null;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onClearCart: () => void;
  onPlaceOrderSuccess: (order: any) => void;
}

export default function CartModal({
  isOpen,
  onClose,
  cart,
  user,
  onUpdateQuantity,
  onClearCart,
  onPlaceOrderSuccess,
}: CartModalProps) {
  const [orderType, setOrderType] = useState<'home' | 'table'>('home');
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState<any | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const total = subtotal + tax;

  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert('Please fill in your name and phone number');
      return;
    }
    if (orderType === 'home' && !address) {
      alert('Please fill in your delivery address');
      return;
    }
    if (orderType === 'table' && !tableNumber) {
      alert('Please fill in your Table Number');
      return;
    }

    setLoading(true);

    const orderData = {
      userId: user?.id || undefined,
      customerName,
      customerPhone,
      items: cart.map(item => ({
        id: item.menuItem.id,
        name: item.menuItem.name,
        price: item.menuItem.price,
        quantity: item.quantity
      })),
      subtotal,
      tax,
      total,
      type: orderType,
      tableNumber: orderType === 'table' ? tableNumber : undefined,
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to place order on server');
      }

      const placedOrder = await response.json();

      // Formulate WhatsApp message
      // Restaurant Phone: Defaulting to a simulated Deewan official order line
      const restaurantNumber = '923001234567'; // Deewan official line
      
      let message = `*🔥 NEW ORDER FROM DEEWAN NAMAK MANDI * \n\n`;
      message += `*Customer:* ${customerName}\n`;
      message += `*Phone:* ${customerPhone}\n`;
      message += `*Order Type:* ${orderType === 'table' ? `Table Service (Table #${tableNumber})` : 'Home Delivery'}\n`;
      if (orderType === 'home') {
        message += `*Delivery Address:* ${address}\n`;
      }
      message += `\n*🛒 ITEMS ORDERED:*\n`;
      
      cart.forEach((item, index) => {
        message += `${index + 1}. ${item.menuItem.name} x ${item.quantity} - Rs. ${(item.menuItem.price * item.quantity).toLocaleString()}\n`;
      });

      message += `\n*💰 BILL DETAILS:*\n`;
      message += `Subtotal: Rs. ${subtotal.toLocaleString()}\n`;
      message += `GST (5%): Rs. ${tax.toLocaleString()}\n`;
      message += `*Grand Total: Rs. ${total.toLocaleString()}*\n\n`;
      message += `Thank you for ordering from Deewan Namak Mandi!`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${restaurantNumber}?text=${encodedMessage}`;

      // Open WhatsApp link
      window.open(whatsappUrl, '_blank');

      // Set success state
      setSuccessOrder(placedOrder);
      onPlaceOrderSuccess(placedOrder);
      onClearCart();
    } catch (err) {
      console.error(err);
      alert('Error placing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-zinc-950 border border-zinc-900 rounded-none w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-900">
          <div className="flex items-center space-x-2.5">
            <ShoppingBag className="h-4 w-4 text-[#EF4444]" />
            <h3 className="text-sm font-serif italic text-white uppercase tracking-wider">Your Dining Cart</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-500 hover:text-white hover:bg-zinc-900 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {successOrder ? (
          /* Success Screen */
          <div className="flex-1 overflow-y-auto p-8 text-center flex flex-col items-center justify-center">
            <div className="bg-zinc-900/50 p-4 border border-[#FFC107]/20 text-[#FFC107] mb-6">
              <CheckCircle className="h-12 w-12" />
            </div>
            <h4 className="text-2xl font-serif font-light italic text-white uppercase mb-2">Order Dispatched!</h4>
            <p className="text-zinc-400 text-xs max-w-md mx-auto mb-6 leading-relaxed">
              Your order bill has been calculated and a formatted checkout details message has been prepared for WhatsApp.
            </p>
            
            {/* Bill Summary */}
            <div className="bg-black p-6 rounded-none w-full max-w-md border border-zinc-900 text-left mb-8">
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono mb-2">
                <span>ORDER ID</span>
                <span>{successOrder.id}</span>
              </div>
              <div className="border-t border-dashed border-zinc-900 my-3"></div>
              {successOrder.items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-xs text-zinc-300 mb-2">
                  <span>{item.name} x{item.quantity}</span>
                  <span className="font-mono">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-dashed border-zinc-900 my-3"></div>
              <div className="flex justify-between text-xs font-bold text-[#FFC107]">
                <span>TOTAL PAID</span>
                <span className="font-mono text-sm">Rs. {successOrder.total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSuccessOrder(null);
                onClose();
              }}
              className="bg-[#FFC107] hover:bg-amber-500 text-black font-bold px-8 py-3.5 rounded-none uppercase text-xs tracking-wider transition-all duration-300 shadow-[0_4px_12px_rgba(255,193,7,0.15)]"
            >
              Continue Browsing
            </button>
          </div>
        ) : cart.length === 0 ? (
          /* Empty Cart Screen */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <ShoppingBag className="h-10 w-10 text-zinc-700 mb-4" />
            <p className="text-zinc-500 text-sm">Your cart is empty. Browse our menu and add items!</p>
            <button
              onClick={onClose}
              className="mt-4 bg-zinc-900 border border-zinc-800 text-[#FFC107] text-[10px] tracking-widest uppercase font-bold py-2.5 px-6 transition hover:bg-zinc-850"
            >
              Back to Menu
            </button>
          </div>
        ) : (
          /* Regular Cart Screen */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left side: Items lists */}
            <div className="flex-1 overflow-y-auto p-6 border-r border-zinc-900">
              <h4 className="text-[10px] font-extrabold text-[#FFC107] uppercase tracking-[0.2em] mb-4">Cart Summary</h4>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.menuItem.id}
                    className="flex items-center justify-between bg-black p-4 rounded-none border border-zinc-900"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="w-12 h-12 rounded-none object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h5 className="text-xs font-serif italic text-white line-clamp-1">
                          {item.menuItem.name}
                        </h5>
                        <p className="text-[9px] text-[#FFC107] font-mono mt-0.5">
                          Rs. {item.menuItem.price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center space-x-3 bg-zinc-950 border border-zinc-900 px-3 py-1.5 rounded-none">
                      <button
                        onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity - 1)}
                        className="text-zinc-500 hover:text-white"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                      </button>
                      <span className="text-xs font-bold font-mono text-white">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity + 1)}
                        className="text-zinc-500 hover:text-white font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: Delivery details & Checkout Form */}
            <form onSubmit={handleCheckout} className="w-full md:w-80 bg-zinc-950 p-6 flex flex-col justify-between overflow-y-auto">
              <div>
                <h4 className="text-[10px] font-extrabold text-[#FFC107] uppercase tracking-[0.2em] mb-4">Delivery & Service</h4>
                
                {/* Order Type Toggle */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900 border border-zinc-800 mb-4">
                  <button
                    type="button"
                    onClick={() => setOrderType('home')}
                    className={`py-2 text-[10px] font-extrabold uppercase transition duration-300 ${
                      orderType === 'home' ? 'bg-[#FFC107] text-black shadow-[0_4px_12px_rgba(255,193,7,0.15)]' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    Home Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('table')}
                    className={`py-2 text-[10px] font-extrabold uppercase transition duration-300 ${
                      orderType === 'table' ? 'bg-[#FFC107] text-black shadow-[0_4px_12px_rgba(255,193,7,0.15)]' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    At Table
                  </button>
                </div>

                {/* Form Inputs */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-black border border-zinc-900 rounded-none p-2.5 text-xs text-white focus:outline-none focus:border-[#FFC107]"
                      placeholder="e.g. Sheraz"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-black border border-zinc-900 rounded-none p-2.5 text-xs text-white focus:outline-none focus:border-[#FFC107]"
                      placeholder="e.g. +92 312 9876543"
                    />
                  </div>

                  {orderType === 'home' ? (
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                        Delivery Address
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-black border border-zinc-900 rounded-none p-2.5 text-xs text-white focus:outline-none focus:border-[#FFC107]"
                        placeholder="e.g. Circular Road, Dera Ismail Khan"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                        Table Number
                      </label>
                      <input
                        type="text"
                        required
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="w-full bg-black border border-zinc-900 rounded-none p-2.5 text-xs text-white focus:outline-none focus:border-[#FFC107]"
                        placeholder="e.g. Cabin 5, Table 3"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Bill Details */}
              <div className="mt-6 pt-4 border-t border-zinc-900">
                <div className="flex justify-between text-[10px] text-zinc-500 mb-1">
                  <span>Subtotal</span>
                  <span className="font-mono">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] text-zinc-500 mb-3">
                  <span>GST (5%)</span>
                  <span className="font-mono">Rs. {tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-[#FFC107] mb-4">
                  <span>Total Bill</span>
                  <span className="font-mono text-sm">Rs. {total.toLocaleString()}</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 bg-[#FFC107] hover:bg-amber-500 disabled:bg-zinc-800 text-black font-bold py-3.5 rounded-none uppercase text-xs tracking-wider transition-all duration-300 shadow-[0_4px_12px_rgba(255,193,7,0.15)]"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{loading ? 'Processing...' : 'Send to WhatsApp'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
