import React, { useState } from 'react';
import { Star, Film } from 'lucide-react';
import { Movie } from '../types';

interface MoviePosterProps {
  movie: Movie;
  className?: string;
  aspectRatio?: string;
  priority?: boolean;
}

export const MoviePoster: React.FC<MoviePosterProps> = ({
  movie,
  className = '',
  aspectRatio = 'aspect-[2/3]',
  priority = false,
}) => {
  const [imageError, setImageError] = useState(false);

  // Dynamic theme colors by language
  const getTheme = () => {
    switch (movie.language) {
      case 'Malayalam':
        return {
          bg: 'from-violet-950 via-charcoal-900 to-charcoal-950',
          badge: 'bg-violet-600 text-white',
          border: 'border-violet-600/40',
          accent: 'text-violet-400',
        };
      case 'Tamil':
        return {
          bg: 'from-rose-950 via-charcoal-900 to-charcoal-950',
          badge: 'bg-rose-600 text-white',
          border: 'border-rose-600/40',
          accent: 'text-rose-400',
        };
      case 'Hindi':
        return {
          bg: 'from-amber-950 via-charcoal-900 to-charcoal-950',
          badge: 'bg-amber-600 text-white',
          border: 'border-amber-600/40',
          accent: 'text-amber-400',
        };
      case 'English':
      default:
        return {
          bg: 'from-sky-950 via-charcoal-900 to-charcoal-950',
          badge: 'bg-sky-600 text-white',
          border: 'border-sky-600/40',
          accent: 'text-sky-400',
        };
    }
  };

  const theme = getTheme();

  return (
    <div
      className={`relative ${aspectRatio} overflow-hidden rounded-2xl bg-charcoal-950 ${className}`}
    >
      {!imageError && movie.posterUrl ? (
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading={priority ? 'eager' : 'lazy'}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        /* Professional Cinematic Title Card Placeholder (Zero Stock Photos) */
        <div
          className={`w-full h-full bg-gradient-to-br ${theme.bg} p-5 flex flex-col justify-between border ${theme.border} relative overflow-hidden select-none`}
        >
          {/* Subtle Ambient Glow & Reel Watermark */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-crimson-600/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
            <Film className="w-48 h-48 text-white" />
          </div>

          {/* Top Metadata Badges */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <span
              className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${theme.badge} shadow-sm`}
            >
              {movie.language}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded bg-charcoal-900/90 border border-charcoal-700 text-slate-300 text-[10px] font-bold">
                {movie.ageRating}
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-charcoal-900/90 border border-charcoal-700 text-cinema-gold text-[10px] font-black">
                <Star className="w-2.5 h-2.5 fill-cinema-gold" />
                <span>{movie.rating.toFixed(1)}</span>
              </span>
            </div>
          </div>

          {/* Center Title Display */}
          <div className="relative z-10 my-auto text-center space-y-2 py-4">
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              {movie.genre.split('/')[0].trim()}
            </p>
            <h3 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight leading-tight line-clamp-3 drop-shadow-md">
              {movie.title}
            </h3>
            {movie.tagline && (
              <p className="text-[11px] italic text-slate-300 line-clamp-2 px-2 opacity-90">
                "{movie.tagline}"
              </p>
            )}
          </div>

          {/* Bottom Credits & Verification */}
          <div className="relative z-10 pt-3 border-t border-charcoal-800/80 text-[10px] text-slate-400 space-y-1">
            <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-slate-500 font-bold">
              <span>Directed By</span>
              <span className={theme.accent}>CineView Verified</span>
            </div>
            <p className="text-slate-200 font-semibold truncate">{movie.director}</p>
          </div>
        </div>
      )}
    </div>
  );
};

