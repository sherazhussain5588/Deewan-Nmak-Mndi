import { useState, FormEvent } from 'react';
import { X, Lock, Mail, User, Phone, LogIn, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any, token: string) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    const payload = isLogin
      ? { email, password }
      : { name, email, phone, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onAuthSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-zinc-950 border border-zinc-900 rounded-none w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Visual Header */}
        <div className="relative bg-[#FFC107] px-6 py-8 text-black text-center rounded-none">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-black/60 hover:text-black rounded-none transition"
          >
            <X className="h-4 w-4" />
          </button>
          
          <Sparkles className="h-6 w-6 mx-auto mb-2 text-black" />
          <h3 className="text-xl font-serif font-light italic text-black uppercase leading-none">
            {isLogin ? 'Welcome Back' : 'Join the Deewan'}
          </h3>
          <p className="text-[9px] text-black/80 mt-1.5 font-bold uppercase tracking-widest">
            {isLogin ? 'Sign in to track orders' : 'Register for premium perks'}
          </p>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-none font-bold">
              {errorMsg}
            </div>
          )}

          {!isLogin && (
            <>
              {/* Name (Signup only) */}
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black border border-zinc-900 focus:border-[#FFC107] p-3 pl-11 rounded-none text-xs text-white placeholder-zinc-600 focus:outline-none transition"
                  placeholder="Full Name"
                />
              </div>

              {/* Phone (Signup only) */}
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black border border-zinc-900 focus:border-[#FFC107] p-3 pl-11 rounded-none text-xs text-white placeholder-zinc-600 focus:outline-none transition"
                  placeholder="Phone Number (e.g. +92 300 1234567)"
                />
              </div>
            </>
          )}

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-zinc-900 focus:border-[#FFC107] p-3 pl-11 rounded-none text-xs text-white placeholder-zinc-600 focus:outline-none transition"
              placeholder="Email Address"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-zinc-900 focus:border-[#FFC107] p-3 pl-11 rounded-none text-xs text-white placeholder-zinc-600 focus:outline-none transition"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFC107] hover:bg-amber-500 disabled:bg-zinc-800 text-black font-bold py-3.5 rounded-none uppercase text-xs tracking-[0.2em] transition-all duration-300 shadow-[0_4px_12px_rgba(255,193,7,0.15)]"
          >
            {loading ? 'Synergizing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>

          {/* Toggle Tab */}
          <div className="text-center pt-4 border-t border-zinc-900 text-xs text-zinc-500">
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-[#FFC107] hover:text-amber-500 font-bold focus:outline-none"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-[#FFC107] hover:text-amber-500 font-bold focus:outline-none"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

          {/* Helper details for easy evaluation */}
          {isLogin && (
            <div className="mt-4 p-3 bg-black rounded-none border border-zinc-900 text-[10px] text-zinc-500 leading-normal space-y-1">
              <strong className="block text-zinc-400 font-bold uppercase tracking-wider mb-1">💡 Quick-Test Account:</strong>
              <div><strong>Customer:</strong> customer@deewan.com / customer</div>
            </div>
          )}
        </form>

      </div>
    </div>
  );
}
