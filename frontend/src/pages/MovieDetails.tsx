import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Calendar, MapPin, Film, Sparkles, ChevronRight, ArrowLeft, Info, ShieldCheck, AlertCircle } from 'lucide-react';
import { fetchMovieDetails } from '../services/api';
import { Movie } from '../types';
import { useBooking } from '../context/BookingContext';
import { formatINR } from '../utils/currency';
import { KERALA_CITIES } from '../components/Navbar';
import { MoviePoster } from '../components/MoviePoster';

export const MovieDetails: React.FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const navigate = useNavigate();
  const { setSelectedMovie, setSelectedTheater, setSelectedShowtime, selectedCity, setSelectedCity } = useBooking();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTheaterIndex, setSelectedTheaterIndex] = useState(0);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  useEffect(() => {
    if (idOrSlug) {
      loadMovie(idOrSlug, selectedCity);
    }
  }, [idOrSlug, selectedCity]);

  const loadMovie = async (identifier: string, city: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMovieDetails(identifier, city);
      setMovie(data);
      setSelectedMovie(data);
      setSelectedTheaterIndex(0);
      setSelectedDateIndex(0);
    } catch (err: any) {
      setError(err.message || 'Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4 animate-pulse">
        <div className="h-80 rounded-3xl bg-charcoal-900 border border-charcoal-800" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="p-12 rounded-3xl bg-crimson-900/20 border border-crimson-800/50 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Movie Not Found</h3>
        <p className="text-slate-400 text-sm">{error || 'Could not find the requested movie.'}</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold"
        >
          Back to Movies
        </button>
      </div>
    );
  }

  const isComingSoon = movie.status === 'COMING_SOON';
  const allTheaters = movie.theaters || [];

  // Strict City Isolation: Filter strictly by selectedCity
  const theaters = allTheaters.filter(
    (t) => t.city.toLowerCase() === selectedCity.toLowerCase()
  );

  const currentTheater = theaters[selectedTheaterIndex] || theaters[0];
  const dates = currentTheater ? currentTheater.dates || [] : [];
  const currentDate = dates[selectedDateIndex] || dates[0];
  const showtimes = currentDate ? currentDate.showtimes || [] : [];

  const handleSelectShowtime = (showtime: any) => {
    setSelectedMovie(movie);
    if (currentTheater) {
      setSelectedTheater({
        id: currentTheater.id,
        name: currentTheater.name,
        city: currentTheater.city,
        address: currentTheater.address,
      });
    }
    setSelectedShowtime({
      id: showtime.id,
      date: currentDate.date,
      startTime: showtime.startTime,
      format: showtime.format,
      basePrice: showtime.basePrice,
    });
    navigate(`/seats/${showtime.id}`);
  };

  return (
    <div className="space-y-12">
      {/* Back Button & City Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Movies</span>
        </button>

        {/* Kerala City Switcher */}
        <div className="flex items-center gap-2 bg-charcoal-900 p-1.5 rounded-xl border border-charcoal-800 text-xs">
          <span className="text-slate-400 px-2 font-medium">City:</span>
          {KERALA_CITIES.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedCity === city
                  ? 'bg-crimson-600 text-white shadow-glow-crimson'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Movie Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-charcoal-800 bg-charcoal-900 shadow-2xl">
        <div className="relative aspect-[21/9] max-h-[480px] w-full overflow-hidden bg-charcoal-950">
          <img
            src={movie.backdropUrl || movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950 via-charcoal-950/40 to-transparent" />
        </div>

        <div className="relative p-6 sm:p-10 -mt-32 sm:-mt-48 z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          {/* Floating Poster */}
          <div className="md:col-span-4 lg:col-span-3 flex justify-center md:justify-start">
            <div className="w-52 sm:w-60 rounded-2xl overflow-hidden border-2 border-charcoal-700 shadow-2xl bg-charcoal-950">
              <MoviePoster movie={movie} priority />
            </div>
          </div>

          {/* Details Header */}
          <div className="md:col-span-8 lg:col-span-9 space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-crimson-600 font-bold text-white uppercase tracking-wider">
                {movie.ageRating}
              </span>
              <span className="px-3 py-1 rounded-md bg-charcoal-800/90 border border-charcoal-700 text-slate-200 font-semibold">
                {movie.genre}
              </span>
              <span className="px-3 py-1 rounded-md bg-crimson-950/60 border border-crimson-600/50 text-crimson-300 font-bold">
                {movie.language}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-charcoal-800/90 border border-charcoal-700 text-cinema-gold font-bold">
                <Star className="w-3.5 h-3.5 fill-cinema-gold" />
                <span>{movie.rating.toFixed(1)} / 10</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-3.5 h-3.5" />
                <span>{movie.durationMinutes} min</span>
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-sm sm:text-base italic text-slate-300 font-medium">"{movie.tagline}"</p>
            )}

            <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              {movie.description}
            </p>

            <div className="pt-2 flex flex-wrap gap-x-8 gap-y-2 text-xs text-slate-400">
              <div>
                <span className="text-slate-500 font-semibold">Director: </span>
                <span className="text-slate-300">{movie.director}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold">Cast: </span>
                <span className="text-slate-300">{movie.cast}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Showtime Selection Section */}
      {isComingSoon ? (
        <section className="p-8 sm:p-12 rounded-3xl bg-charcoal-900 border border-charcoal-800 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-cinema-gold/15 border border-cinema-gold/40 flex items-center justify-center text-cinema-gold mx-auto">
            <Calendar className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-black text-2xl text-white">Upcoming Theatrical Release</h3>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">
              This title is currently scheduled for future theatrical release in Kerala ({movie.releaseDate}). Verified showtimes and 3D seat reservations will open prior to release date.
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold shadow-glow-crimson"
          >
            Explore Now Showing Movies
          </button>
        </section>
      ) : (
        <section className="space-y-8 bg-charcoal-900/60 p-6 sm:p-10 rounded-3xl border border-charcoal-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-crimson-500" />
              <h2 className="font-display text-2xl font-bold text-white tracking-tight">
                Verified Cinemas & Showtimes in {selectedCity}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-charcoal-850 px-3 py-1.5 rounded-full border border-charcoal-750">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Real Verified Theaters • Demo Showtimes in ₹</span>
            </div>
          </div>

          {theaters.length === 0 ? (
            <div className="p-8 rounded-2xl bg-charcoal-850/80 border border-charcoal-750 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-cinema-gold mx-auto" />
              <h4 className="text-white font-bold text-base">No Screenings in {selectedCity}</h4>
              <p className="text-slate-400 text-xs">
                This movie is not currently scheduled in {selectedCity} theatres. Switch city to check availability.
              </p>
              <button
                onClick={() => setSelectedCity(selectedCity === 'Kochi' ? 'Thiruvananthapuram' : 'Kochi')}
                className="px-4 py-2 rounded-xl bg-charcoal-700 hover:bg-crimson-600 text-white text-xs font-bold transition-colors"
              >
                Switch to {selectedCity === 'Kochi' ? 'Thiruvananthapuram' : 'Kochi'}
              </button>
            </div>
          ) : (
            <>
              {/* 1. Verified Theaters Tabs (Strictly for selected city) */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Theatres in {selectedCity} ({theaters.length})
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {theaters.map((theater, idx) => (
                    <button
                      key={theater.id}
                      data-testid="theater-tab"
                      onClick={() => {
                        setSelectedTheaterIndex(idx);
                        setSelectedDateIndex(0);
                      }}
                      className={`p-4 rounded-2xl text-left border transition-all ${
                        selectedTheaterIndex === idx
                          ? 'bg-crimson-950/40 border-crimson-500 shadow-glow-crimson'
                          : 'bg-charcoal-900/90 border-charcoal-800 hover:border-charcoal-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-display font-bold text-base text-white">{theater.name}</h4>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-crimson-500 shrink-0" />
                            <span>{theater.address}</span>
                          </p>
                        </div>
                        {selectedTheaterIndex === idx && (
                          <span className="w-2.5 h-2.5 rounded-full bg-crimson-500 shadow-glow-crimson shrink-0 mt-1" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Show Dates Tabs */}
              {dates.length > 0 && (
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Select Date
                  </label>
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                    {dates.map((d: any, idx: number) => (
                      <button
                        key={d.date}
                        onClick={() => setSelectedDateIndex(idx)}
                        className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                          selectedDateIndex === idx
                            ? 'bg-crimson-600 border-crimson-500 text-white shadow-glow-crimson'
                            : 'bg-charcoal-850 border-charcoal-750 text-slate-300 hover:border-charcoal-650'
                        }`}
                      >
                        {new Date(d.date).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Showtimes & Formats Grid */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Select Showtime & Screen Format
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {showtimes.map((st: any) => (
                    <button
                      key={st.id}
                      data-testid="showtime-button"
                      onClick={() => handleSelectShowtime(st)}
                      className="group p-4 rounded-2xl bg-charcoal-850/90 border border-charcoal-750 hover:border-crimson-500 hover:shadow-glow-crimson transition-all text-left flex flex-col justify-between space-y-2 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-display font-extrabold text-base text-white group-hover:text-crimson-400 transition-colors">
                          {st.startTime}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-charcoal-700 text-slate-300">
                          {st.screenName ? st.screenName.split('-')[0].trim() : 'Screen'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-charcoal-750/80">
                        <span className="text-slate-400 text-[11px] font-medium">{st.format}</span>
                        <span className="font-black text-cinema-gold text-xs">
                          {formatINR(st.basePrice)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
};
