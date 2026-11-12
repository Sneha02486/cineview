import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Ticket, CreditCard, Sparkles, AlertCircle, Smartphone, QrCode } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { createBooking } from '../services/api';
import { formatINR } from '../utils/currency';

export const BookingSummary: React.FC = () => {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const navigate = useNavigate();

  const {
    selectedMovie,
    selectedShowtime,
    selectedTheater,
    selectedScreen,
    selectedSeats,
    subtotal,
    convenienceFee,
    totalAmount,
    clearSelection,
  } = useBooking();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  if (!selectedMovie || !selectedShowtime || selectedSeats.length === 0) {
    return (
      <div className="py-20 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">No Seats Selected</h3>
        <p className="text-slate-400 text-sm">Please select seats from the theater layout first.</p>
        <button
          onClick={() => navigate(showtimeId ? `/seats/${showtimeId}` : '/')}
          className="px-6 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold"
        >
          Return to Seat Selection
        </button>
      </div>
    );
  }

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!name.trim()) {
      errors.name = 'Full name is required';
    }
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!phone.trim()) {
      errors.phone = 'Mobile number is required';
    } else if (phone.trim().length < 10) {
      errors.phone = 'Please enter a valid 10-digit mobile number';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      setErrorMessage(null);

      const response = await createBooking({
        showtimeId: showtimeId || selectedShowtime.id,
        seatIds: selectedSeats.map((s) => s.id),
        customerName: name.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
      });

      clearSelection();
      navigate(`/confirmation/${response.id}`, { state: { booking: response } });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to complete booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(`/seats/${showtimeId}`)}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Change Seats</span>
      </button>

      <div className="flex items-center gap-3">
        <Ticket className="w-6 h-6 text-crimson-500" />
        <h1 className="font-display text-3xl font-black text-white tracking-tight">
          Booking Summary
        </h1>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-crimson-900/30 border border-crimson-600/50 flex items-start gap-3 text-crimson-200 text-sm">
          <AlertCircle className="w-5 h-5 text-crimson-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Booking Error</p>
            <p className="text-xs text-crimson-300 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Customer Form & Payment */}
        <div className="md:col-span-7 space-y-6">
          <form onSubmit={handleConfirmBooking} className="space-y-6">
            {/* Customer Details */}
            <div className="p-6 rounded-3xl bg-charcoal-900 border border-charcoal-800 space-y-4 shadow-xl">
              <h3 className="font-display font-bold text-base text-white">
                Contact Information
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    data-testid="input-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Menon"
                    className={`w-full px-4 py-3 rounded-xl bg-charcoal-850 border ${
                      validationErrors.name ? 'border-crimson-500' : 'border-charcoal-700'
                    } text-slate-100 text-sm focus:outline-none focus:border-crimson-500 transition-colors`}
                  />
                  {validationErrors.name && (
                    <p className="text-crimson-400 text-[11px] mt-1">{validationErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    data-testid="input-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rahul.menon@example.in"
                    className={`w-full px-4 py-3 rounded-xl bg-charcoal-850 border ${
                      validationErrors.email ? 'border-crimson-500' : 'border-charcoal-700'
                    } text-slate-100 text-sm focus:outline-none focus:border-crimson-500 transition-colors`}
                  />
                  {validationErrors.email && (
                    <p className="text-crimson-400 text-[11px] mt-1">{validationErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    data-testid="input-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98470 12345"
                    className={`w-full px-4 py-3 rounded-xl bg-charcoal-850 border ${
                      validationErrors.phone ? 'border-crimson-500' : 'border-charcoal-700'
                    } text-slate-100 text-sm focus:outline-none focus:border-crimson-500 transition-colors`}
                  />
                  {validationErrors.phone && (
                    <p className="text-crimson-400 text-[11px] mt-1">{validationErrors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Indian Payment Options (Simulated Demo) */}
            <div className="p-6 rounded-3xl bg-charcoal-900 border border-charcoal-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-white">Payment Method</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Instant Demo Sandbox
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'upi', label: 'UPI / GPay', icon: QrCode },
                  { id: 'card', label: 'Debit / Card', icon: CreditCard },
                  { id: 'netbanking', label: 'Net Banking', icon: Smartphone },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPaymentMethod(item.id as any)}
                      className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        paymentMethod === item.id
                          ? 'bg-crimson-600/20 border-crimson-500 text-white'
                          : 'bg-charcoal-850 border-charcoal-750 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-crimson-400" />
                      <span className="text-xs font-semibold">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                * Note: This is a demonstration booking in Indian Rupees (INR). No actual money will be deducted.
              </p>
            </div>

            <button
              type="submit"
              data-testid="confirm-booking-btn"
              disabled={submitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-crimson-600 to-crimson-500 hover:from-crimson-500 hover:to-crimson-600 text-white font-extrabold text-sm shadow-glow-crimson transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-cinema-gold" />
                  <span>Reserving Seats in Database...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Confirm Booking ({formatINR(totalAmount)})</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Order Details & Price Breakdown */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-charcoal-900 border border-charcoal-800 space-y-6 shadow-2xl">
            {/* Movie Info */}
            <div className="flex gap-4 items-start">
              <img
                src={selectedMovie.posterUrl}
                alt={selectedMovie.title}
                className="w-18 h-24 object-cover rounded-xl border border-charcoal-700 shrink-0"
              />
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-crimson-400 uppercase tracking-wider">
                  {selectedMovie.genre}
                </span>
                <h4 className="font-display font-extrabold text-base text-white">
                  {selectedMovie.title}
                </h4>
                <p className="text-xs text-slate-400">
                  {selectedTheater?.name} ({selectedTheater?.city})
                </p>
                <p className="text-xs font-semibold text-slate-300">
                  {selectedShowtime.startTime} ({selectedShowtime.format})
                </p>
              </div>
            </div>

            <div className="h-px bg-charcoal-800" />

            {/* Selected Seats Badge List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>Selected Seats ({selectedSeats.length})</span>
                <span>Type & Rate (₹)</span>
              </div>

              <div className="space-y-1.5">
                {selectedSeats.map((seat) => (
                  <div
                    key={seat.id}
                    className="flex items-center justify-between text-xs p-2 rounded-lg bg-charcoal-850/80"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-crimson-600/30 text-crimson-300 font-bold">
                        {seat.seatCode}
                      </span>
                      <span className="text-slate-400">{seat.type}</span>
                    </div>
                    <span className="font-bold text-white">{formatINR(seat.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-charcoal-800" />

            {/* Price Calculations in INR */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Ticket Subtotal</span>
                <span className="text-slate-200 font-medium">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Convenience Fee (₹30/seat)</span>
                <span className="text-slate-200 font-medium">{formatINR(convenienceFee)}</span>
              </div>
              <div className="pt-3 border-t border-charcoal-800 flex justify-between items-baseline">
                <span className="font-display font-bold text-sm text-white">Total Amount</span>
                <span
                  data-testid="total-price"
                  className="font-display font-black text-2xl text-crimson-400"
                >
                  {formatINR(totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
