import React from 'react';
import { Film, Heart, Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal-900 border-t border-charcoal-800/80 mt-20 pt-12 pb-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-crimson-600 flex items-center justify-center text-white font-bold">
                <Film className="w-4 h-4" />
              </div>
              <span className="font-display font-extrabold text-xl text-white tracking-wide">
                CINE<span className="text-crimson-500">VIEW</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed">
              CineView revolutionizes cinema ticketing by providing an accurate 3D preview of the movie screen from your chosen seat coordinates. Experience viewing distance, horizontal angle, and line of sight before booking.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cinema-gold" /> Real Three.js 3D Physics
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> Secure Instant Reservations
              </span>
            </div>
          </div>

          {/* Technology Stack */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-3">
              Technologies
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>React & TypeScript</li>
              <li>Three.js & React Three Fiber</li>
              <li>Tailwind CSS Glassmorphism</li>
              <li>Node.js, Express & Prisma ORM</li>
              <li>SQLite Atomic Transactions</li>
            </ul>
          </div>

          {/* Standards */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-3">
              Cinema Metrics
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>SMPTE Viewing Angles (30° - 45°)</li>
              <li>THX Sweet Spot Calibration</li>
              <li>Physically accurate eye-level offset</li>
              <li>Interactive Cinema Raycasting</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-charcoal-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CineView Technologies. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-crimson-500 fill-crimson-500" /> for cinema lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};

