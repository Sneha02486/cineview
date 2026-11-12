import { Movie, ShowtimeSeatsResponse, BookingResponse } from '../types';

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || '/api';

export interface CatalogMetadata {
  lastUpdated: string;
  verifiedDate: string;
  isLiveFeed: boolean;
  isDemoShowtimes: boolean;
  source: string;
  cachedMovieCount: number;
}

export async function fetchMovies(
  search?: string,
  genre?: string,
  language?: string,
  city?: string,
  status?: string,
  format?: string
): Promise<Movie[]> {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (genre && genre !== 'All') params.append('genre', genre);
  if (language && language !== 'All') params.append('language', language);
  if (city && city !== 'All') params.append('city', city);
  if (status && status !== 'All') params.append('status', status);
  if (format && format !== 'All') params.append('format', format);

  const res = await fetch(`${API_BASE}/movies?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }
  const json = await res.json();
  return json.data || [];
}

export async function fetchCatalogStatus(): Promise<CatalogMetadata> {
  const res = await fetch(`${API_BASE}/movies/status`);
  if (!res.ok) {
    throw new Error('Failed to fetch catalog status');
  }
  const json = await res.json();
  return json.data;
}

export async function refreshCatalog(): Promise<CatalogMetadata> {
  const res = await fetch(`${API_BASE}/movies/refresh`, {
    method: 'POST',
  });
  if (!res.ok) {
    throw new Error('Failed to refresh catalog');
  }
  const json = await res.json();
  return json.data;
}

export async function fetchMovieDetails(idOrSlug: string, city?: string): Promise<Movie> {
  const params = new URLSearchParams();
  if (city && city !== 'All') params.append('city', city);

  const url = `${API_BASE}/movies/${idOrSlug}${params.toString() ? `?${params.toString()}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch movie details');
  }
  const json = await res.json();
  return json.data;
}

export async function fetchShowtimeSeats(showtimeId: string): Promise<ShowtimeSeatsResponse> {
  const res = await fetch(`${API_BASE}/showtimes/${showtimeId}/seats`);
  if (!res.ok) {
    throw new Error('Failed to load seating chart and showtime details');
  }
  const json = await res.json();
  return json.data;
}

export interface CreateBookingPayload {
  showtimeId: string;
  seatIds: string[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export async function createBooking(payload: CreateBookingPayload): Promise<BookingResponse> {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || 'Booking submission failed');
  }

  return json.data;
}

export async function fetchBookingByReference(reference: string): Promise<BookingResponse> {
  const res = await fetch(`${API_BASE}/bookings/${reference}`);
  if (!res.ok) {
    throw new Error('Failed to fetch booking confirmation');
  }
  const json = await res.json();
  return json.data;
}

export const fetchBookingDetails = fetchBookingByReference;
