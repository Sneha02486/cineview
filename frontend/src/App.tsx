import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { MovieDetails } from './pages/MovieDetails';
import { SeatSelection } from './pages/SeatSelection';
import { Preview3D } from './pages/Preview3D';
import { BookingSummary } from './pages/BookingSummary';
import { Confirmation } from './pages/Confirmation';

export const App: React.FC = () => {
  return (
    <BookingProvider>
      <div className="min-h-screen flex flex-col bg-charcoal-950 text-slate-100">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:idOrSlug" element={<MovieDetails />} />
            <Route path="/seats/:showtimeId" element={<SeatSelection />} />
            <Route path="/preview-3d/:showtimeId" element={<Preview3D />} />
            <Route path="/booking/:showtimeId" element={<BookingSummary />} />
            <Route path="/confirmation/:bookingId" element={<Confirmation />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BookingProvider>
  );
};

export default App;

