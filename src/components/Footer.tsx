import { MapPin, Phone, Mail, Clock, Heart } from 'lucide-react';

interface FooterProps {
  onAdminClick?: () => void;
}

export default function Footer({ onAdminClick }: FooterProps) {
  return (
    <footer className="bg-black border-t border-zinc-900 text-zinc-500 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand col */}
          <div className="md:col-span-2">
            {/* Branded Logo aligned with the Header and the user's uploaded design */}
            <div className="flex items-center space-x-3 mb-4" id="footer-brand-logo-container">
              {/* Typography */}
              <div className="flex items-center space-x-2 select-none shrink-0">
                <span className="font-cursive text-3xl font-bold text-[#EF4444] drop-shadow-[0_2px_8px_rgba(239,68,68,0.8)]" style={{ transform: 'rotate(-2deg)' }}>
                  Deewan
                </span>
                <span className="font-urdu text-lg font-bold text-[#3B82F6] drop-shadow-[0_2px_8px_rgba(59,130,246,0.8)] pr-1 pt-1" style={{ direction: 'rtl' }}>
                  نمک منڈی
                </span>
              </div>
            </div>
            <p className="mt-4 text-xs text-zinc-400 leading-relaxed max-w-sm">
              Authentic traditional dining experience featuring signature charcoal BBQ and exquisite Peshawari Shinwari Karahi prepared fresh in Dera Ismail Khan, Pakistan.
            </p>
          </div>

          {/* Quick contact details */}
          <div>
            <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Contact Info</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start space-x-2.5">
                <MapPin className="h-4 w-4 text-[#FFC107] shrink-0" />
                <span className="text-zinc-400">Circular Road, near Town Hall, Dera Ismail Khan, Pakistan</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4 text-[#FFC107] shrink-0" />
                <span className="text-zinc-400">+92 300 1234567</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="h-4 w-4 text-[#FFC107] shrink-0" />
                <span className="text-zinc-400">orders@deewan.com</span>
              </li>
            </ul>
          </div>

          {/* Timings */}
          <div>
            <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Opening Hours</h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center space-x-2.5">
                <Clock className="h-4 w-4 text-[#FFC107] shrink-0" />
                <div>
                  <span className="block font-bold text-white text-xs">Monday - Sunday</span>
                  <span className="text-zinc-400 text-xs">12:00 PM - 01:00 AM</span>
                </div>
              </div>
              <p className="text-[10px] text-[#FFC107]/80 italic font-medium">
                * Serving lunch, evening platters, and late-night dinners.
              </p>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="border-t border-zinc-950 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-wider text-zinc-600 font-medium">
          <div className="flex flex-wrap items-center gap-4">
            <p>© 2026 Deewan Namak Mandi. All Traditional Rights Reserved.</p>
            {onAdminClick && (
              <button
                onClick={onAdminClick}
                className="text-[#FFC107] hover:text-amber-400 font-bold tracking-widest uppercase transition duration-300 focus:outline-none cursor-pointer"
              >
                [ Staff Portal ]
              </button>
            )}
          </div>
          <p className="flex items-center space-x-1.5">
            <span>Crafted with</span>
            <Heart className="h-3.5 w-3.5 text-red-500 fill-current" />
            <span>for the food enthusiasts of D.I Khan</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
