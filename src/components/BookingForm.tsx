import { useState, FormEvent } from 'react';
import { Calendar, User, Phone, Users, Clock, CheckCircle, Flame } from 'lucide-react';
import { User as UserType } from '../types';

interface BookingFormProps {
  user: UserType | null;
  onBookingSuccess: () => void;
}

export default function BookingForm({ user, onBookingSuccess }: BookingFormProps) {
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:00');
  const [guests, setGuests] = useState(4);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date || !time || !guests) {
      alert('Please fill out all booking fields');
      return;
    }

    setLoading(true);

    const bookingData = {
      userId: user?.id || undefined,
      name,
      phone,
      date,
      time,
      guests,
    };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Failed to create reservation');
      }

      setSuccess(true);
      onBookingSuccess();
    } catch (err) {
      console.error(err);
      alert('Error booking table. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-black py-20 text-white border-b border-zinc-900" id="book-section">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Reservation Card */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-none overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* Side Info */}
          <div className="md:col-span-5 bg-[#FFC107] p-8 sm:p-10 text-black flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center space-x-2 bg-black text-white px-3.5 py-1.5 rounded-none mb-6">
                <Flame className="h-3.5 w-3.5 text-[#EF4444]" />
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#FFC107]">VIP Experience</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-serif font-light italic leading-none mb-4 text-black">
                Dine at the <br /><span className="not-italic font-bold">Deewan</span>
              </h3>
              <p className="text-black/80 text-xs md:text-sm leading-relaxed mb-8">
                Reserve family VIP air-conditioned cabins, traditional open-air floor seating, or tables in the central dining hall. Beautiful, cozy, and perfect for families.
              </p>
            </div>

            <div className="space-y-4 border-t border-black/15 pt-6">
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-widest text-black/50">Timing</span>
                <span className="text-xs font-bold uppercase">12:00 PM - 01:00 AM</span>
              </div>
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-widest text-black/50">Location</span>
                <span className="text-xs font-bold">Circular Road, D.I Khan</span>
              </div>
            </div>
          </div>

          {/* Booking Inputs Form */}
          <div className="md:col-span-7 p-8 sm:p-10 bg-zinc-950">
            {success ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="bg-zinc-900/50 p-4 border border-[#FFC107]/20 text-[#FFC107] mb-6">
                  <CheckCircle className="h-12 w-12" />
                </div>
                <h4 className="text-lg font-serif italic text-white mb-2">Reservation Saved!</h4>
                <p className="text-zinc-400 text-xs max-w-xs mx-auto mb-6 leading-relaxed">
                  Your reservation request is being processed. Our team will contact you shortly on your provided phone number to confirm your table.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="bg-[#FFC107] hover:bg-amber-500 text-black text-xs font-bold px-8 py-3 rounded-none uppercase tracking-[0.15em] transition-all duration-300"
                >
                  Book Another Table
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-base font-serif italic text-white border-b border-zinc-900 pb-3 tracking-wide">
                  Book A Table
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black border border-zinc-900 focus:border-[#FFC107] p-3 pl-11 rounded-none text-xs text-white placeholder-zinc-600 focus:outline-none transition"
                      placeholder="Your Full Name"
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-black border border-zinc-900 focus:border-[#FFC107] p-3 pl-11 rounded-none text-xs text-white placeholder-zinc-600 focus:outline-none transition"
                      placeholder="Phone (e.g. 03001234567)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Date */}
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-black border border-zinc-900 focus:border-[#FFC107] p-3 pl-11 rounded-none text-xs text-white placeholder-zinc-600 focus:outline-none transition"
                    />
                  </div>

                  {/* Time */}
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-black border border-zinc-900 focus:border-[#FFC107] p-3 pl-11 rounded-none text-xs text-white focus:outline-none transition appearance-none"
                    >
                      <option value="12:00">12:00 PM</option>
                      <option value="13:30">01:30 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="17:00">05:00 PM</option>
                      <option value="19:00">07:00 PM</option>
                      <option value="20:30">08:30 PM</option>
                      <option value="22:00">10:00 PM</option>
                      <option value="23:30">11:30 PM</option>
                    </select>
                  </div>

                  {/* Guests */}
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full bg-black border border-zinc-900 focus:border-[#FFC107] p-3 pl-11 rounded-none text-xs text-white focus:outline-none transition appearance-none"
                    >
                      <option value="1">1 Person</option>
                      <option value="2">2 Persons</option>
                      <option value="4">4 Persons</option>
                      <option value="6">6 Persons</option>
                      <option value="8">8 Persons</option>
                      <option value="10">10+ Persons</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FFC107] hover:bg-amber-500 disabled:bg-zinc-800 text-black font-bold py-3.5 rounded-none uppercase text-xs tracking-[0.2em] transition-all duration-300 shadow-[0_4px_12px_rgba(255,193,7,0.15)]"
                >
                  {loading ? 'Submitting Reservation...' : 'Submit Table Booking'}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
