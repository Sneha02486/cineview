import React, { createContext, useContext, useState, useMemo } from 'react';
import { Movie, ShowtimeDetail, SeatData } from '../types';

interface TheaterInfo {
  id: string;
  name: string;
  city: string;
  address: string;
}

interface ScreenInfo {
  id: string;
  name: string;
  screenType: string;
}

interface BookingContextType {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedMovie: Movie | null;
  setSelectedMovie: (movie: Movie | null) => void;
  selectedShowtime: ShowtimeDetail | null;
  setSelectedShowtime: (showtime: ShowtimeDetail | null) => void;
  selectedTheater: TheaterInfo | null;
  setSelectedTheater: (theater: TheaterInfo | null) => void;
  selectedScreen: ScreenInfo | null;
  setSelectedScreen: (screen: ScreenInfo | null) => void;
  selectedSeats: SeatData[];
  previewSeat: SeatData | null;
  setPreviewSeat: (seat: SeatData | null) => void;
  toggleSeat: (seat: SeatData) => void;
  selectSeat: (seat: SeatData) => void;
  deselectSeat: (seatId: string) => void;
  clearSelection: () => void;
  subtotal: number;
  convenienceFee: number;
  totalAmount: number;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Requirement 2: Default city: Kochi. Use local storage to remember selected city.
  const [selectedCity, setSelectedCityState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('cineview_kerala_city');
      return saved === 'Thiruvananthapuram' ? 'Thiruvananthapuram' : 'Kochi';
    } catch {
      return 'Kochi';
    }
  });

  const setSelectedCity = (city: string) => {
    setSelectedCityState(city);
    try {
      localStorage.setItem('cineview_kerala_city', city);
    } catch {}
  };

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<ShowtimeDetail | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<TheaterInfo | null>(null);
  const [selectedScreen, setSelectedScreen] = useState<ScreenInfo | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<SeatData[]>([]);
  const [previewSeat, setPreviewSeat] = useState<SeatData | null>(null);

  const toggleSeat = (seat: SeatData) => {
    if (seat.isOccupied) return;

    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.id === seat.id);
      if (exists) {
        return prev.filter((s) => s.id !== seat.id);
      } else {
        setPreviewSeat(seat);
        return [...prev, seat];
      }
    });
  };

  const selectSeat = (seat: SeatData) => {
    if (seat.isOccupied) return;
    setSelectedSeats((prev) => {
      if (prev.some((s) => s.id === seat.id)) return prev;
      return [...prev, seat];
    });
    setPreviewSeat(seat);
  };

  const deselectSeat = (seatId: string) => {
    setSelectedSeats((prev) => prev.filter((s) => s.id !== seatId));
  };

  const clearSelection = () => {
    setSelectedSeats([]);
    setPreviewSeat(null);
  };

  const subtotal = useMemo(() => {
    return selectedSeats.reduce((acc, s) => acc + (s.price || 150.0), 0);
  }, [selectedSeats]);

  // Kerala standard convenience fee: ₹30 per seat
  const convenienceFee = useMemo(() => {
    return selectedSeats.length > 0 ? selectedSeats.length * 30 : 0;
  }, [selectedSeats]);

  const totalAmount = useMemo(() => {
    return subtotal + convenienceFee;
  }, [subtotal, convenienceFee]);

  return (
    <BookingContext.Provider
      value={{
        selectedCity,
        setSelectedCity,
        selectedMovie,
        setSelectedMovie,
        selectedShowtime,
        setSelectedShowtime,
        selectedTheater,
        setSelectedTheater,
        selectedScreen,
        setSelectedScreen,
        selectedSeats,
        previewSeat,
        setPreviewSeat,
        toggleSeat,
        selectSeat,
        deselectSeat,
        clearSelection,
        subtotal,
        convenienceFee,
        totalAmount,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
