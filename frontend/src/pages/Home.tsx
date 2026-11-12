import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Star,
  Clock,
  Sparkles,
  Film,
  ArrowRight,
  Play,
  MapPin,
  Globe,
  Calendar,
  Layers,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { fetchMovies, fetchCatalogStatus, refreshCatalog, CatalogMetadata } from '../services/api';
import { Movie } from '../types';
import { useBooking } from '../context/BookingContext';
import { KERALA_CITIES } from '../components/Navbar';
import { MoviePoster } from '../components/MoviePoster';

// Requirement 3: All | Malayalam | Tamil | Hindi | English
const KERALA_LANGUAGES = ['All', 'Malayalam', 'Tamil', 'Hindi', 'English'];
const GENRES = ['All', 'Action', 'Drama', 'Comedy', 'Sci-Fi', 'Thriller', 'Animation'];
const FORMATS = ['All', '2D', '3D', 'IMAX'];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCity, setSelectedCity } = useBooking();

  const [nowShowingMovies, setNowShowingMovies] = useState<Movie[]>([]);
  const [comingSoonMovies, setComingSoonMovies] = useState<Movie[]>([]);
  const [catalogStatus, setCatalogStatus] = useState<CatalogMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedFormat, setSelectedFormat] = useState('All');

  useEffect(() => {
    loadCatalog();
  }, [selectedCity, selectedLanguage, selectedGenre, selectedFormat]);

  const loadCatalog = async (query?: string) => {
    try {
      setLoading(true);
      setError(null);
      const q = query !== undefined ? query : search;

      // Fetch verified metadata status
      try {
        const status = await fetchCatalogStatus();
        setCatalogStatus(status);
      } catch (_) {}

      // Fetch currently screening movies for selected Kerala city
      const nowShowing = await fetchMovies(
        q,
        selectedGenre,
        selectedLanguage,
        selectedCity,
        'NOW_SHOWING',
        selectedFormat
      );
      setNowShowingMovies(nowShowing);

      // Fetch coming soon / confirmed future releases (strictly separate from Now Showing)
      const comingSoon = await fetchMovies(
        q,
        selectedGenre,
        selectedLanguage,
        'All',
        'COMING_SOON'
      );
      setComingSoonMovies(comingSoon);
    } catch (err: any) {
      setError(err.message || 'Failed to load movie catalog');
    } finally {
      setLoading(false);
    }
  };

  const handleManualRefresh = async () => {
    try {
      setRefreshing(true);
      await refreshCatalog();
      await loadCatalog(search);
    } catch (err: any) {
      setError(err.message || 'Failed to refresh catalog');
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadCatalog(search);
  };

  const featuredMovie = nowShowingMovies[0] || comingSoonMovies[0];

  return (
    <div className="space-y-12">
      {/* City Switcher Banner & Verification Header for Kerala */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-crimson-600/20 border border-crimson-500/40 flex items-center justify-center text-crimson-400 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Selected Cinema Region
              </p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Theaters</span>
              </span>
            </div>
            <p className="text-sm font-extrabold text-white">
              Currently Showing in <span className="text-crimson-400">{selectedCity}, Kerala</span>
            </p>
          </div>
        </div>

        {/* City Toggle Buttons & Catalog Refresh Action */}
        <div className="flex flex-wrap items-center gap-2">
          {KERALA_CITIES.map((city) => (
            <button
              key={city}
              data-testid={`city-btn-${city}`}
              onClick={() => setSelectedCity(city)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                selectedCity === city
                  ? 'bg-crimson-600 text-white shadow-glow-crimson'
                  : 'bg-charcoal-800 text-slate-300 hover:text-white hover:bg-charcoal-700'
              }`}
            >
              {city}
            </button>
          ))}

          {/* Catalog Refresh Button */}
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-slate-300 hover:text-white text-xs font-semibold border border-charcoal-700 transition-all disabled:opacity-50"
            title="Refresh verified movie listings"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-crimson-400 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-charcoal-800/80 bg-gradient-to-r from-charcoal-950 via-charcoal-900 to-charcoal-950 p-6 sm:p-10 lg:p-14 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-crimson-600/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-crimson-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-crimson-500/15 border border-crimson-500/30 text-crimson-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cinema-gold animate-spin" />
              <span>YOUR PERFECT VIEW STARTS HERE</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              See Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-crimson-400 to-crimson-600">View</span> Before You Book.
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
              Experience the best theatres in <strong className="text-white">{selectedCity}</strong> — from PVR INOX LuLu Mall to Ariesplex SL Cinemas. Preview screen distance, elevation, and 3D line-of-sight from any seat before booking in Indian Rupees (₹).
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {featuredMovie && (
                <button
                  onClick={() => navigate(`/movie/${featuredMovie.slug || featuredMovie.id}`)}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-crimson-600 to-crimson-500 hover:from-crimson-500 hover:to-crimson-600 text-white font-bold text-sm shadow-glow-crimson hover:shadow-xl transition-all flex items-center gap-2 group"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Book in {selectedCity}: {featuredMovie.title}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>

          {/* Featured Poster Banner */}
          {featuredMovie && (
            <div className="lg:col-span-5 hidden lg:block">
              <div
                onClick={() => navigate(`/movie/${featuredMovie.slug || featuredMovie.id}`)}
                className="cursor-pointer group relative rounded-2xl overflow-hidden border border-charcoal-700/80 bg-charcoal-900 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-crimson-500/50"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <MoviePoster movie={featuredMovie} aspectRatio="aspect-[16/9]" priority />
                </div>
                <div className="p-5 space-y-2 bg-charcoal-950/90 border-t border-charcoal-800">
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-crimson-600 text-white font-bold">
                      {featuredMovie.language}
                    </span>
                    <span className="flex items-center gap-1 text-cinema-gold font-bold">
                      <Star className="w-3.5 h-3.5 fill-cinema-gold" /> {featuredMovie.rating.toFixed(1)}/10
                    </span>
                    <span>•</span>
                    <span className="truncate">{featuredMovie.genre}</span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-white group-hover:text-crimson-400 transition-colors">
                    {featuredMovie.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{featuredMovie.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Filter Section: Language Buttons, Search, Genre & Format */}
      <section className="space-y-6">
        {/* Row 1: Search & Language Filters (All | Malayalam | Tamil | Hindi | English) */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              data-testid="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search movies, actors, or directors..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-charcoal-900/90 border border-charcoal-700/80 text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-crimson-500 transition-colors shadow-inner"
            />
          </form>

          {/* Attractive Language Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mr-1">
              <Globe className="w-4 h-4 text-crimson-400" />
              <span>Language:</span>
            </div>
            {KERALA_LANGUAGES.map((lang) => (
              <button
                key={lang}
                data-testid={`lang-btn-${lang}`}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedLanguage === lang
                    ? 'bg-crimson-600 border-crimson-500 text-white shadow-glow-crimson'
                    : 'bg-charcoal-900 border-charcoal-750 text-slate-300 hover:text-white hover:border-charcoal-600'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Genre & Screen Format Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
          {/* Genre Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-xs text-slate-400 font-semibold mr-1">Genre:</span>
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedGenre === genre
                    ? 'bg-charcoal-700 text-white font-bold border border-charcoal-600'
                    : 'bg-charcoal-900/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Format Pills (2D, 3D, IMAX) */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>Format:</span>
            </span>
            {FORMATS.map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                  selectedFormat === fmt
                    ? 'bg-sky-950/70 text-sky-300 border-sky-500'
                    : 'bg-charcoal-900 text-slate-400 border-charcoal-800 hover:text-slate-200'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: NOW SHOWING (Currently Screening in Selected Kerala City)       */}
        {/* ========================================================================= */}
        <div className="pt-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-charcoal-800/80 pb-4">
            <div className="flex items-center gap-3">
              <Film className="w-5 h-5 text-crimson-500" />
              <h2 className="font-display text-2xl font-bold text-white tracking-tight">
                Now Showing in {selectedCity}
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">
                {nowShowingMovies.length} {nowShowingMovies.length === 1 ? 'Movie' : 'Movies'} Screening Today
              </span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified {catalogStatus?.verifiedDate || 'Nov 13, 2026'}</span>
              </span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-96 rounded-2xl bg-charcoal-900 border border-charcoal-800" />
              ))}
            </div>
          ) : error ? (
            <div className="p-8 rounded-2xl bg-crimson-900/20 border border-crimson-800/50 text-center space-y-3">
              <p className="text-crimson-300 font-semibold">{error}</p>
              <button
                onClick={() => loadCatalog()}
                className="px-4 py-2 rounded-lg bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold"
              >
                Retry
              </button>
            </div>
          ) : nowShowingMovies.length === 0 ? (
            <div className="text-center py-12 space-y-3 bg-charcoal-900/40 rounded-2xl border border-charcoal-800">
              <Film className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-white font-semibold">No movies currently screening for this filter</h3>
              <p className="text-slate-400 text-xs">
                Try switching between Kochi and Thiruvananthapuram, or selecting "All" languages.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {nowShowingMovies.map((movie) => (
                <div
                  key={movie.id}
                  data-testid="movie-card"
                  onClick={() => navigate(`/movie/${movie.slug || movie.id}`)}
                  className="cursor-pointer group flex flex-col rounded-2xl overflow-hidden bg-charcoal-900 border border-charcoal-800 hover:border-crimson-500/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5"
                >
                  {/* Poster Image with Custom Typography Title Card Fallback */}
                  <MoviePoster movie={movie} />

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-semibold text-slate-300">{movie.language}</span>
                        <span className="flex items-center gap-1 text-cinema-gold font-bold">
                          <Star className="w-3.5 h-3.5 fill-cinema-gold" /> {movie.rating.toFixed(1)}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-lg text-white group-hover:text-crimson-400 transition-colors line-clamp-1">
                        {movie.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-1">{movie.genre}</p>
                    </div>

                    <div className="pt-2 border-t border-charcoal-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {movie.durationMinutes}m
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/movie/${movie.slug || movie.id}`);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-crimson-600 hover:bg-crimson-500 text-white font-bold transition-colors shadow-sm"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: COMING SOON / EXPLORE (Confirmed Future Releases Only)         */}
        {/* ========================================================================= */}
        <div className="pt-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-charcoal-800/80 pb-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-cinema-gold" />
              <div>
                <h2 className="font-display text-2xl font-bold text-white tracking-tight">
                  Coming Soon to Kerala Theatres
                </h2>
                <p className="text-xs text-slate-400">
                  Confirmed upcoming theatrical releases. 3D seat previews and bookings open prior to premiere.
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {comingSoonMovies.length} Confirmed Releases
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {comingSoonMovies.map((movie) => (
              <div
                key={movie.id}
                data-testid="coming-soon-card"
                onClick={() => navigate(`/movie/${movie.slug || movie.id}`)}
                className="cursor-pointer group flex flex-col rounded-2xl overflow-hidden bg-charcoal-900/60 border border-charcoal-800 hover:border-cinema-gold/40 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative">
                  <MoviePoster movie={movie} />
                  <div className="absolute top-3 left-3 z-20">
                    <span className="px-2.5 py-1 rounded-md bg-cinema-gold/90 text-charcoal-950 font-black text-[10px] uppercase tracking-wider shadow-md">
                      Upcoming
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold text-slate-300">{movie.language}</span>
                      <span className="text-cinema-gold font-bold text-[11px]">{movie.releaseDate}</span>
                    </div>

                    <h3 className="font-display font-bold text-base text-white group-hover:text-cinema-gold transition-colors line-clamp-1">
                      {movie.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-1">{movie.genre}</p>
                  </div>

                  <div className="pt-2 border-t border-charcoal-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px] truncate">
                      Dir: {movie.director.split(',')[0]}
                    </span>
                    <span className="text-cinema-gold font-semibold text-[11px] group-hover:underline">
                      View Info →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
