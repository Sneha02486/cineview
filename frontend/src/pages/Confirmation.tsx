import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, Ticket, Download, ArrowRight, Film, Calendar, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import { fetchBookingDetails } from '../services/api';
import { BookingResponse } from '../types';
import { formatINR } from '../utils/currency';

export const Confirmation: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<BookingResponse | null>(
    (location.state as any)?.booking || null
  );
  const [loading, setLoading] = useState(!booking);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e61e43', '#f59e0b', '#38bdf8', '#ffffff'],
      });
    } catch (_) {}

    if (!booking && bookingId) {
      loadBooking(bookingId);
    }
  }, [bookingId]);

  const loadBooking = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetchBookingDetails(id);
      setBooking(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTicket = () => {
    if (!booking) return;

    const seatsText = booking.bookingSeats
      .map((bs) => `${bs.seat.seatCode} (${bs.seat.type} - ${formatINR(bs.price)})`)
      .join(', ');

    const ticketContent = `
=============================================================
                CINEVIEW INDIA — 3D CINEMA E-TICKET
            "See Your View Before You Book — India"
=============================================================
Booking Reference : ${booking.bookingReference}
Status            : CONFIRMED (DEMO BOOKING)
Movie             : ${booking.showtime.movie.title} (${booking.showtime.movie.language})
Cinema            : ${booking.showtime.screen.theater.name}
City & Location   : ${booking.showtime.screen.theater.city} (${booking.showtime.screen.theater.address})
Screen/Auditorium : ${booking.showtime.screen.name}
Date & Time       : ${booking.showtime.date} at ${booking.showtime.startTime}
Format            : ${booking.showtime.format}
-------------------------------------------------------------
Customer Name     : ${booking.customerName}
Customer Email    : ${booking.customerEmail}
Customer Phone    : ${booking.customerPhone}
-------------------------------------------------------------
Seats Reserved    : ${seatsText}
Ticket Subtotal   : ${formatINR(booking.subtotal)}
Convenience Fee   : ${formatINR(booking.convenienceFee)}
Total Amount Paid : ${formatINR(booking.totalAmount)}
-------------------------------------------------------------
* NOTICE: This is a demonstration simulated booking ticket.
CineView Technologies — Verified Cinema Listing & 3D Preview
Thank you for experiencing CineView!
=============================================================
    `.trim();

    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CineView-Ticket-${booking.bookingReference}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4 animate-pulse">
        <Sparkles className="w-10 h-10 text-crimson-500 mx-auto animate-spin" />
        <h3 className="text-xl font-bold text-white">Loading Your E-Ticket...</h3>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="p-12 rounded-3xl bg-charcoal-900 border border-charcoal-800 text-center space-y-4 max-w-lg mx-auto">
        <h3 className="text-xl font-bold text-white">Booking Details</h3>
        <p className="text-slate-400 text-sm">{error || 'Booking reference not found.'}</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold"
        >
          Return to Movies
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16">
      {/* Success Badge */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-9 h-9 text-emerald-400" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
          Booking Confirmed!
        </h1>
        <p className="text-slate-300 text-sm">
          Your demo booking is verified. We've sent your simulated e-ticket to{' '}
          <span className="font-semibold text-white">{booking.customerEmail}</span>.
        </p>
      </div>

      {/* Modern E-Ticket Card */}
      <div className="relative rounded-3xl overflow-hidden bg-charcoal-900 border border-charcoal-800 shadow-2xl">
        {/* Ticket Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-crimson-900/60 via-charcoal-900 to-charcoal-900 border-b border-charcoal-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Booking Reference
            </span>
            <p
              data-testid="booking-reference"
              className="font-display font-black text-2xl sm:text-3xl text-white tracking-wider"
            >
              {booking.bookingReference}
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>CONFIRMED (DEMO)</span>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Movie Details */}
          <div className="flex gap-5 items-start">
            <img
              src={booking.showtime.movie.posterUrl}
              alt={booking.showtime.movie.title}
              className="w-20 h-28 object-cover rounded-xl border border-charcoal-700 shadow-md shrink-0"
            />
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-crimson-400 uppercase tracking-wider">
                {booking.showtime.movie.genre} • {booking.showtime.movie.language}
              </span>
              <h3 className="font-display font-black text-xl text-white">
                {booking.showtime.movie.title}
              </h3>
              <p className="text-xs text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-crimson-500 shrink-0" />
                <span>
                  {booking.showtime.screen.theater.name} ({booking.showtime.screen.theater.city})
                </span>
              </p>
              <p className="text-xs text-slate-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cinema-gold shrink-0" />
                <span>
                  {booking.showtime.date} at {booking.showtime.startTime} ({booking.showtime.format})
                </span>
              </p>
            </div>
          </div>

          <div className="h-px bg-charcoal-800 border-dashed" />

          {/* Seats & Attendee Info */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block mb-1">Seats Reserved</span>
              <div className="flex flex-wrap gap-1.5">
                {booking.bookingSeats.map((bs) => (
                  <span
                    key={bs.id}
                    className="px-2.5 py-1 rounded-md bg-crimson-600/30 border border-crimson-500/50 text-crimson-300 font-extrabold"
                  >
                    {bs.seat.seatCode}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block mb-1">Booked For</span>
              <p className="font-bold text-white">{booking.customerName}</p>
              <p className="text-slate-400 text-[11px]">{booking.customerPhone}</p>
            </div>
          </div>

          <div className="h-px bg-charcoal-800" />

          {/* Amount Paid in INR */}
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Total Amount (INR)</span>
              <span className="text-[10px] text-slate-500">Includes ticket subtotal & taxes/convenience fee</span>
            </div>
            <span className="font-display font-black text-2xl text-cinema-gold">
              {formatINR(booking.totalAmount)}
            </span>
          </div>
        </div>

        {/* Ticket Footer Actions */}
        <div className="p-4 sm:p-6 bg-charcoal-950/80 border-t border-charcoal-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            data-testid="download-ticket-btn"
            onClick={handleDownloadTicket}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-white text-xs font-bold border border-charcoal-700 flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-cinema-gold" />
            <span>Download Demo E-Ticket (₹)</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-extrabold shadow-glow-crimson flex items-center justify-center gap-2 transition-all"
          >
            <span>Book Another Movie</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
