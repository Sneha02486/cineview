import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, ArrowRight, ArrowLeft, Info, Sparkles, Check, Armchair, ShieldCheck } from 'lucide-react';
import { fetchShowtimeSeats } from '../services/api';
import { ShowtimeSeatsResponse, SeatData } from '../types';
import { useBooking } from '../context/BookingContext';
import { formatINR } from '../utils/currency';

export const SeatSelection: React.FC = () => {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const navigate = useNavigate();

  const {
    setSelectedMovie,
    setSelectedShowtime,
    setSelectedTheater,
    setSelectedScreen,
    selectedSeats,
    toggleSeat,
    previewSeat,
    setPreviewSeat,
    subtotal,
    convenienceFee,
    totalAmount,
  } = useBooking();

  const [data, setData] = useState<ShowtimeSeatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (showtimeId) {
      loadSeatingData(showtimeId);
    }
  }, [showtimeId]);

  const loadSeatingData = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchShowtimeSeats(id);
      setData(res);

      setSelectedMovie(res.movie as any);
      setSelectedShowtime(res.showtime);
      setSelectedTheater(res.theater);
      setSelectedScreen(res.screen);

      if (!previewSeat && res.seats.length > 0) {
        const midSeat =
          res.seats.find((s) => s.row === 'F' && s.number === 7 && !s.isOccupied) ||
          res.seats.find((s) => !s.isOccupied);
        if (midSeat) setPreviewSeat(midSeat);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load seating chart');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seat: SeatData) => {
    if (seat.isOccupied) return;
    toggleSeat(seat);
  };

  const handleQuickPreview = (e: React.MouseEvent, seat: SeatData) => {
    e.stopPropagation();
    if (seat.isOccupied) return;
    setPreviewSeat(seat);
    navigate(`/preview-3d/${showtimeId}`);
  };

  const handleOpen3DPreview = () => {
    if (!previewSeat && selectedSeats.length > 0) {
      setPreviewSeat(selectedSeats[0]);
    }
    navigate(`/preview-3d/${showtimeId}`);
  };

  const handleProceedBooking = () => {
    if (selectedSeats.length === 0) return;
    navigate(`/booking/${showtimeId}`);
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4 animate-pulse">
        <div className="h-96 rounded-3xl bg-charcoal-900 border border-charcoal-800" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-12 rounded-3xl bg-crimson-900/20 border border-crimson-800/50 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Seating Chart Unavailable</h3>
        <p className="text-slate-400 text-sm">{error || 'Could not load seats for this showtime.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { movie, theater, showtime, screen, rows } = data;

  return (
    <div className="space-y-8 pb-32">
      {/* Top Breadcrumb & Showtime Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="p-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-display font-extrabold text-xl text-white">{movie.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {theater.name} ({theater.city}) • {screen.name} • {showtime.startTime} ({showtime.format})
            </p>
          </div>
        </div>

        {/* PROMINENT "PREVIEW VIEW FROM THIS SEAT" BUTTON */}
        <button
          data-testid="preview-3d-button"
          onClick={handleOpen3DPreview}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-crimson-600 to-crimson-500 hover:from-crimson-500 hover:to-crimson-600 text-white text-xs font-black shadow-glow-crimson flex items-center gap-2.5 group transition-all"
        >
          <Sparkles className="w-4 h-4 text-cinema-gold animate-spin" />
          <span>Preview View From This Seat</span>
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Screen Area (Curved 2D Indicator) */}
      <div className="py-6 flex flex-col items-center">
        <div className="w-full max-w-2xl h-12 relative flex items-center justify-center">
          <svg className="w-full h-12 overflow-visible" viewBox="0 0 600 40">
            <path
              d="M 20 35 Q 300 0 580 35"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="5"
              strokeLinecap="round"
              className="drop-shadow-[0_0_12px_rgba(56,189,248,0.7)]"
            />
          </svg>
        </div>
        <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mt-1">
          Curved Cinema Screen This Way
        </span>
      </div>

      {/* 2D Seating Chart Grid */}
      <div className="bg-charcoal-900/70 p-6 sm:p-10 rounded-3xl border border-charcoal-800 overflow-x-auto shadow-2xl">
        <div className="min-w-[680px] flex flex-col items-center gap-3">
          {rows.map((rowObj) => (
            <div key={rowObj.row} className="flex items-center gap-4">
              {/* Row Label Left */}
              <span className="w-6 text-center text-xs font-bold text-slate-400">
                {rowObj.row}
              </span>

              {/* Seats in Row */}
              <div className="flex items-center gap-2">
                {rowObj.seats.map((seat, seatIndex) => {
                  const isSelected = selectedSeats.some((s) => s.id === seat.id);
                  const isOccupied = seat.isOccupied;
                  const isPreview = previewSeat?.id === seat.id;
                  const hasAisle = seatIndex === 6; // Center aisle after 7th seat

                  let seatStyle = 'bg-charcoal-800 border-charcoal-700 text-slate-300 hover:border-slate-500';
                  if (seat.type === 'RECLINER' || seat.type === 'VIP') {
                    seatStyle = 'bg-purple-950/40 border-purple-600/70 text-purple-300';
                  } else if (seat.type === 'EXECUTIVE') {
                    seatStyle = 'bg-indigo-950/40 border-indigo-600/70 text-indigo-300';
                  } else if (seat.type === 'PREMIUM') {
                    seatStyle = 'bg-sky-950/40 border-sky-600/70 text-sky-300';
                  }

                  if (isOccupied) {
                    seatStyle = 'bg-charcoal-950 border-charcoal-850 text-slate-600 cursor-not-allowed opacity-40';
                  } else if (isSelected) {
                    seatStyle = 'bg-crimson-600 border-crimson-500 text-white shadow-glow-crimson scale-105';
                  }

                  return (
                    <React.Fragment key={seat.id}>
                      <button
                        data-testid={`seat-${seat.seatCode}`}
                        disabled={isOccupied}
                        onClick={() => handleSeatClick(seat)}
                        className={`relative w-8 h-8 rounded-lg border text-[11px] font-bold flex items-center justify-center transition-all ${seatStyle}`}
                        title={`${seat.seatCode} (${seat.type}) - ${formatINR(seat.price)}${
                          isOccupied ? ' [OCCUPIED]' : ''
                        }`}
                      >
                        {seat.number}

                        {/* Quick 3D Eye Preview Trigger on hover */}
                        {!isOccupied && (
                          <div
                            onClick={(e) => handleQuickPreview(e, seat)}
                            className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-charcoal-950 border border-cinema-gold text-cinema-gold flex items-center justify-center opacity-0 hover:opacity-100 hover:scale-110 transition-all z-20 shadow-md"
                            title={`Preview 3D view from ${seat.seatCode}`}
                          >
                            <Eye className="w-3 h-3" />
                          </div>
                        )}

                        {/* Preview Indicator Ring */}
                        {isPreview && (
                          <span className="absolute inset-0 rounded-lg ring-2 ring-cinema-gold ring-offset-2 ring-offset-charcoal-950" />
                        )}
                      </button>

                      {/* Center Aisle Spacer */}
                      {hasAisle && <div className="w-8" />}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Row Label Right */}
              <span className="w-6 text-center text-xs font-bold text-slate-400">
                {rowObj.row}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend with Indian ticket categories per Requirement 7 */}
      <div className="flex flex-wrap items-center justify-center gap-6 p-4 rounded-2xl bg-charcoal-900 border border-charcoal-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-charcoal-800 border border-charcoal-600" />
          <span className="text-slate-300">Regular (₹150)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-sky-950/60 border border-sky-500" />
          <span className="text-slate-300">Premium (₹220)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-indigo-950/60 border border-indigo-500" />
          <span className="text-slate-300">Executive (₹280)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-purple-950/60 border border-purple-500" />
          <span className="text-slate-300">Recliner (₹350)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-crimson-600 border border-crimson-500 shadow-glow-crimson" />
          <span className="text-white font-bold">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-charcoal-950 border border-charcoal-850 opacity-50" />
          <span className="text-slate-500">Occupied</span>
        </div>
      </div>

      {/* Floating Bottom Booking Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-charcoal-950/90 backdrop-blur-xl border-t border-charcoal-800/80 p-4 sm:p-5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Selected Seat Summary */}
          <div className="flex items-center gap-6">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Selected Seats ({selectedSeats.length})
              </p>
              <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                {selectedSeats.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">No seats selected yet</span>
                ) : (
                  selectedSeats.map((s) => (
                    <span
                      key={s.id}
                      className="px-2 py-0.5 rounded bg-crimson-600/30 border border-crimson-500/50 text-crimson-300 text-xs font-bold"
                    >
                      {s.seatCode}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="h-8 w-px bg-charcoal-800 hidden sm:block" />

            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Total Amount (INR)
              </p>
              <p className="font-display font-extrabold text-xl text-white">
                {formatINR(totalAmount)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleOpen3DPreview}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-charcoal-700 transition-all"
            >
              <Eye className="w-4 h-4 text-cinema-gold" />
              <span>3D Preview</span>
            </button>

            <button
              data-testid="proceed-booking-button"
              disabled={selectedSeats.length === 0}
              onClick={handleProceedBooking}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                selectedSeats.length > 0
                  ? 'bg-crimson-600 hover:bg-crimson-500 text-white shadow-glow-crimson'
                  : 'bg-charcoal-800 text-slate-500 cursor-not-allowed opacity-50'
              }`}
            >
              <span>Proceed to Booking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
