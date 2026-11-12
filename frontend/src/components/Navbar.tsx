import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Ticket, MapPin, Sparkles } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export const KERALA_CITIES = ['Kochi', 'Thiruvananthapuram'];

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { selectedCity, setSelectedCity } = useBooking();

  return (
    <header className="sticky top-0 z-50 bg-charcoal-950/90 backdrop-blur-xl border-b border-charcoal-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-crimson-500 to-crimson-700 flex items-center justify-center shadow-glow-crimson group-hover:scale-105 transition-transform duration-300">
            <Film className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-2xl tracking-wider text-white">
                CINE<span className="text-crimson-500">VIEW</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-crimson-500/15 text-crimson-400 border border-crimson-500/30">
                KERALA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-tight hidden sm:block">
              See Your View Before You Book
            </p>
          </div>
        </Link>

        {/* City Selector & Navigation */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Kerala City Selector: Kochi / Thiruvananthapuram */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-charcoal-850 border border-charcoal-700 text-xs shadow-inner">
            <MapPin className="w-4 h-4 text-crimson-500 shrink-0" />
            <select
              data-testid="city-selector"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer pr-1"
            >
              {KERALA_CITIES.map((city) => (
                <option key={city} value={city} className="bg-charcoal-900 text-slate-100 font-semibold">
                  {city}
                </option>
              ))}
            </select>
          </div>

          <Link
            to="/"
            className={`text-sm font-medium transition-colors hidden md:block ${
              location.pathname === '/' ? 'text-crimson-500 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Movies
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs sm:text-sm font-bold shadow-glow-crimson hover:shadow-lg transition-all"
          >
            <Ticket className="w-4 h-4" />
            <span>Book Tickets</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
