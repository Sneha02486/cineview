import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Eye, ArrowLeft, Check, Sparkles, Compass, Ruler, Shield, Layers } from 'lucide-react';
import { fetchShowtimeSeats } from '../services/api';
import { ShowtimeSeatsResponse, SeatData, CameraSeatMetrics } from '../types';
import { useBooking } from '../context/BookingContext';
import { CinemaHall } from '../components/Cinema3D/CinemaHall';
import { CinemaScreen } from '../components/Cinema3D/CinemaScreen';
import { AllSeats } from '../components/Cinema3D/AllSeats';
import { CameraRig } from '../components/Cinema3D/CameraRig';
import { calculateSeatMetrics } from '../components/Cinema3D/cinemaGeometry';
import { formatINR } from '../utils/currency';

export const Preview3D: React.FC = () => {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const navigate = useNavigate();

  const {
    selectedSeats,
    selectSeat,
    previewSeat,
    setPreviewSeat,
    setSelectedMovie,
    setSelectedShowtime,
    setSelectedTheater,
    setSelectedScreen,
  } = useBooking();

  const [data, setData] = useState<ShowtimeSeatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMetrics, setCurrentMetrics] = useState<CameraSeatMetrics | null>(null);

  useEffect(() => {
    if (showtimeId) {
      loadData(showtimeId);
    }
  }, [showtimeId]);

  const loadData = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchShowtimeSeats(id);
      setData(res);

      setSelectedMovie(res.movie as any);
      setSelectedShowtime(res.showtime);
      setSelectedTheater(res.theater);
      setSelectedScreen(res.screen);

      // Determine initial preview seat
      let initialSeat: SeatData | undefined = previewSeat || undefined;
      if (!initialSeat && selectedSeats.length > 0) {
        initialSeat = selectedSeats[0];
      }
      if (!initialSeat && res.seats.length > 0) {
        initialSeat =
          res.seats.find((s) => s.row === 'F' && s.number === 7 && !s.isOccupied) ||
          res.seats.find((s) => !s.isOccupied);
      }

      if (initialSeat) {
        setPreviewSeat(initialSeat);
        setCurrentMetrics(calculateSeatMetrics(initialSeat));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initialize 3D cinema');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatChange = (seat: SeatData) => {
    if (seat.isOccupied) return;
    setPreviewSeat(seat);
    setCurrentMetrics(calculateSeatMetrics(seat));
  };

  const handleConfirmAndProceed = () => {
    if (previewSeat) {
      selectSeat(previewSeat);
    }
    navigate(`/booking/${showtimeId}`);
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Sparkles className="w-10 h-10 text-crimson-500 animate-spin" />
        <p className="text-white font-display font-bold text-lg">
          Rendering 3D Virtual Cinema...
        </p>
        <p className="text-slate-400 text-xs">
          Simulating physical seat eye-level line of sight & screen perspective
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-12 rounded-3xl bg-crimson-900/20 border border-crimson-800/50 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">3D Preview Failed to Load</h3>
        <p className="text-slate-400 text-sm">{error || 'Could not initialize 3D scene.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold"
        >
          Return to 2D Seating
        </button>
      </div>
    );
  }

  const { movie, theater, showtime, screen, seats } = data;

  return (
    <div className="relative h-[86vh] -mt-6 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden rounded-3xl border border-charcoal-800 bg-black">
      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 3.2, 16], fov: 52 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <CinemaHall />
        <CinemaScreen movieTitle={movie.title} backdropUrl={movie.backdropUrl} />
        <AllSeats
          seats={seats}
          selectedSeatIds={selectedSeats.map((s) => s.id)}
          previewSeatId={previewSeat?.id}
          onSeatClick={handleSeatChange}
        />
        <CameraRig targetSeat={previewSeat} />
      </Canvas>

      {/* TOP HUD: Movie & Theater Info */}
      <div className="absolute top-4 inset-x-4 sm:inset-x-6 flex items-center justify-between pointer-events-none z-20">
        <div className="pointer-events-auto flex items-center gap-3 bg-charcoal-950/85 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-charcoal-700/80 shadow-2xl">
          <button
            data-testid="change-seat-button"
            onClick={() => navigate(`/seats/${showtimeId}`)}
            className="p-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-slate-300 hover:text-white transition-colors"
            title="Return to 2D Seating Map"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="font-display font-extrabold text-sm text-white flex items-center gap-2">
              <span>{movie.title}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-crimson-600 text-white uppercase font-bold">
                {showtime.format}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {theater.name} ({theater.city}) • {screen.name}
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-charcoal-950/85 backdrop-blur-xl px-3.5 py-2 rounded-2xl border border-charcoal-700/80 text-xs text-slate-300 pointer-events-auto shadow-2xl">
          <Sparkles className="w-3.5 h-3.5 text-cinema-gold animate-spin" />
          <span>Physical 3D Eye-Level Perspective</span>
        </div>
      </div>

      {/* FLOATING HUD: Live Viewing Angle & Screen Distance Metrics */}
      {currentMetrics && (
        <div className="absolute top-20 left-4 sm:left-6 z-20 pointer-events-auto max-w-sm">
          <div className="bg-charcoal-950/90 backdrop-blur-2xl p-4 sm:p-5 rounded-3xl border border-charcoal-700/80 shadow-2xl space-y-4">
            {/* Header: Seat Code & Price in INR */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Active Eye-Level Perspective
                </span>
                <h2
                  data-testid="preview-seat-code"
                  className="font-display font-black text-2xl text-white flex items-center gap-2"
                >
                  Seat {currentMetrics.seatCode}
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-crimson-500/20 text-crimson-400 border border-crimson-500/30">
                    {currentMetrics.type}
                  </span>
                </h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Price (INR)
                </span>
                <span className="font-display font-bold text-lg text-cinema-gold">
                  {formatINR(currentMetrics.price)}
                </span>
              </div>
            </div>

            {/* Scientific Viewing Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-charcoal-900/90 border border-charcoal-800 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
                  <Ruler className="w-3.5 h-3.5 text-sky-400" />
                  <span>Distance</span>
                </div>
                <p
                  data-testid="preview-distance"
                  className="font-display font-extrabold text-base text-white"
                >
                  {currentMetrics.distanceToScreen} m
                </p>
                <span className="text-[10px] text-slate-500">From screen center</span>
              </div>

              <div className="p-3 rounded-xl bg-charcoal-900/90 border border-charcoal-800 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold">
                  <Compass className="w-3.5 h-3.5 text-cinema-gold" />
                  <span>FOV Angle</span>
                </div>
                <p
                  data-testid="preview-angle"
                  className="font-display font-extrabold text-base text-white"
                >
                  {currentMetrics.horizontalViewingAngle}°
                </p>
                <span className="text-[10px] text-slate-500">SMPTE horizontal span</span>
              </div>
            </div>

            {/* Quality Rating */}
            <div className="p-3 rounded-xl bg-charcoal-900/70 border border-charcoal-800 space-y-1.5">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200">
                  {currentMetrics.comfortScore}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {currentMetrics.recommendationNote}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM HUD: Quick Seat Selector & Action Buttons */}
      <div className="absolute bottom-4 inset-x-4 sm:inset-x-6 z-20 pointer-events-auto">
        <div className="bg-charcoal-950/90 backdrop-blur-2xl p-4 rounded-3xl border border-charcoal-700/80 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quick Row/Seat Switcher Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap mr-1">
              Quick Views:
            </span>
            {['A7', 'C7', 'F7', 'H7', 'J7', 'F2', 'F13'].map((code) => {
              const seat = seats.find((s) => s.seatCode === code);
              if (!seat) return null;
              const isActive = previewSeat?.seatCode === code;
              return (
                <button
                  key={code}
                  onClick={() => handleSeatChange(seat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-cinema-gold text-charcoal-950 border-cinema-gold shadow-glow-gold'
                      : 'bg-charcoal-900 text-slate-300 border-charcoal-800 hover:border-charcoal-700 hover:text-white'
                  }`}
                >
                  {code} {code === 'F7' ? '★' : ''}
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate(`/seats/${showtimeId}`)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-slate-300 text-xs font-bold border border-charcoal-700 transition-colors"
            >
              2D Seat Map
            </button>

            <button
              data-testid="confirm-seat-button"
              onClick={handleConfirmAndProceed}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-crimson-600 to-crimson-500 hover:from-crimson-500 hover:to-crimson-600 text-white text-xs font-extrabold shadow-glow-crimson flex items-center justify-center gap-2 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Confirm & Book Seat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
