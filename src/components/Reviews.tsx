import { Star, MessageSquareQuote } from 'lucide-react';
import { Review } from '../types';

export default function Reviews() {
  const reviews: Review[] = [
    {
      id: 'r1',
      name: 'Muhammad Sheraz',
      rating: 5,
      text: 'Best Shinwari Mutton Tikka in D.I Khan! The meat is extremely tender, cooked to perfection, and has the absolute genuine Namak Mandi flavour. Fast service and clean family cabin!',
      date: '2 days ago'
    },
    {
      id: 'r2',
      name: 'Dr. Tariq Alizai',
      rating: 5,
      text: 'Their Namak Mandi Karahi is phenomenal. No heavy spices, just pure mutton cooked in fat with fresh tomatoes. Reminds me of Peshawari Namak Mandi. Recommended 100%!',
      date: '1 week ago'
    },
    {
      id: 'r3',
      name: 'Aisha Malik',
      rating: 4,
      text: 'We booked a family table here last weekend. The setup was spectacular, floor seating was highly comfortable. Chapli Kabab was massive and crispy. Great overall experience.',
      date: '3 days ago'
    }
  ];

  return (
    <section className="bg-black py-20 text-white border-t border-b border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header - Premium Visual styling matching the mockup */}
        <div className="text-center max-w-4xl mx-auto mb-4">
          <div className="inline-flex items-center space-x-2 bg-zinc-950 border border-[#FFC107]/40 px-5 py-2 rounded-full mb-6 shadow-md shadow-[#FFC107]/5">
            <MessageSquareQuote className="h-3.5 w-3.5 text-[#FFC107]" />
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#FFC107] uppercase">
              DEEWAN REVIEWS
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-serif font-extrabold text-white uppercase tracking-tight leading-none">
            LOVED BY <span className="text-[#FFC107]">OUR GUESTS</span>
          </h2>

          {/* Golden Elegant Fleur-de-lis style Divider */}
          <div className="flex items-center justify-center gap-4 text-[#FFC107] opacity-80 my-5 max-w-xs mx-auto">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#FFC107]" />
            <span className="text-xs text-[#FFC107]">✦ ⚜ ✦</span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#FFC107]" />
          </div>

          <p className="mt-4 text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-sans">
            Hear from our wonderful guests who visit from all over D.I Khan division to experience true traditional tastes.
          </p>
        </div>

        {/* Curved crescent separator line with centered Quote Circle */}
        <div className="relative w-full max-w-3xl mx-auto mt-14 mb-16 h-8">
          {/* Beautiful smooth arched line */}
          <div className="absolute top-0 left-0 right-0 h-16 border-t border-[#FFC107]/25 rounded-[100%/100%_100%_0_0] pointer-events-none" />
          
          {/* Centered quote badge */}
          <div className="relative flex justify-center -translate-y-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-full border border-[#FFC107] bg-black text-[#FFC107] z-10 shadow-[0_0_15px_rgba(255,193,7,0.2)]">
              <span className="font-serif text-3.5xl font-extrabold leading-none select-none pt-2.5">“</span>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-zinc-950 border border-zinc-900 p-8 rounded-none flex flex-col justify-between transition-all duration-300 hover:border-[#FFC107]/40 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
            >
              <div>
                {/* Stars */}
                <div className="flex items-center space-x-1 text-[#FFC107] mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-current text-[#FFC107]' : 'text-zinc-850'}`}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-zinc-300 text-sm leading-relaxed italic font-sans">
                  "{review.text}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center justify-between border-t border-zinc-900 pt-6 mt-8">
                <div>
                  <h4 className="font-serif font-bold italic text-zinc-300 text-sm">
                    {review.name}
                  </h4>
                  <p className="text-[9px] text-[#3B82F6] font-medium uppercase tracking-[0.2em] mt-0.5">
                    Verified Customer
                  </p>
                </div>
                <span className="text-[9px] text-zinc-500 font-mono">
                  {review.date}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
