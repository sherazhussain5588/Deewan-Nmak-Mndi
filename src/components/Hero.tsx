
interface HeroProps {
  onOrderNow: () => void;
  onBookTable: () => void;
  backgroundImage?: string;
}

export default function Hero({ onOrderNow, onBookTable, backgroundImage }: HeroProps) {
  // Use the generated karahi hero image, or a fallback
  const heroImg = backgroundImage || 'https://lh3.googleusercontent.com/d/122Cg-QyTr7EzaYNjbVHexv29_fxLQmIg';

  return (
    <div className="relative min-h-[50vh] md:min-h-[80vh] flex items-center justify-center bg-black overflow-hidden border-b border-zinc-900">
      {/* Background Image with full visibility */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Namak Mandi Karahi"
          className="w-full h-full object-cover object-center opacity-100 transition-transform duration-10000 ease-out"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}
