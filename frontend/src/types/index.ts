export interface Movie {
  id: string;
  title: string;
  slug: string;
  tagline?: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl?: string;
  genre: string;
  durationMinutes: number;
  rating: number;
  language: string;
  ageRating: string;
  releaseDate: string;
  director: string;
  cast: string;
  status?: 'NOW_SHOWING' | 'COMING_SOON';
  showtimes?: ShowtimeSummary[];
  theaters?: TheaterWithDates[];
}

export interface ShowtimeSummary {
  id: string;
  date: string;
  startTime: string;
  format: string;
}

export interface TheaterWithDates {
  id: string;
  name: string;
  city: string;
  address: string;
  dates: {
    date: string;
    showtimes: {
      id: string;
      screenId: string;
      screenName: string;
      screenType: string;
      startTime: string;
      basePrice: number;
      format: string;
    }[];
  }[];
}

export interface SeatData {
  id: string;
  seatCode: string;
  row: string;
  number: number;
  type: 'STANDARD' | 'PREMIUM' | 'EXECUTIVE' | 'VIP' | 'RECLINER';
  priceMultiplier: number;
  price: number;
  isOccupied: boolean;
  posX: number;
  posY: number;
  posZ: number;
}

export interface RowData {
  row: string;
  seats: SeatData[];
}

export interface ShowtimeDetail {
  id: string;
  date: string;
  startTime: string;
  format: string;
  basePrice: number;
}

export interface ShowtimeSeatsResponse {
  showtime: ShowtimeDetail;
  movie: {
    id: string;
    title: string;
    genre: string;
    durationMinutes: number;
    rating: number;
    ageRating: string;
    posterUrl: string;
    backdropUrl: string;
  };
  theater: {
    id: string;
    name: string;
    city: string;
    address: string;
  };
  screen: {
    id: string;
    name: string;
    screenType: string;
    totalRows: number;
    seatsPerRow: number;
  };
  summary: {
    totalSeats: number;
    occupiedSeatsCount: number;
    availableSeatsCount: number;
  };
  seats: SeatData[];
  rows: RowData[];
}

export interface BookingResponse {
  id: string;
  bookingReference: string;
  showtimeId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  subtotal: number;
  convenienceFee: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  bookingSeats: {
    id: string;
    price: number;
    seat: SeatData;
  }[];
  showtime: {
    id: string;
    date: string;
    startTime: string;
    format: string;
    movie: Movie;
    screen: {
      id: string;
      name: string;
      screenType: string;
      theater: {
        id: string;
        name: string;
        city: string;
        address: string;
      };
    };
  };
}

export interface CameraSeatMetrics {
  seatCode: string;
  row: string;
  number: number;
  type: string;
  price: number;
  distanceToScreen: number; // in meters
  horizontalViewingAngle: number; // in degrees
  verticalViewingAngle: number; // in degrees
  comfortScore: string;
  recommendationNote: string;
}

