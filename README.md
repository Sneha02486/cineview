# CineView — Indian 3D Movie Seat Booking System

> **Tagline:** *"See Your View Before You Book."*  
> **Badge:** *"YOUR PERFECT VIEW STARTS HERE"*

CineView is an advanced movie ticket booking web application customized for the **Indian cinema experience**. Its hallmark feature is an authentic, interactive 3D virtual cinema preview engine powered by **Three.js** and **React Three Fiber**. Rather than guessing screen size and perspective from a flat 2D layout, CineView calculates the camera's true eye-level coordinates, viewing distance, and horizontal field-of-view (FOV) from any selected seat in the virtual auditorium.

---

## 🌟 Indian Cinema Experience & Features

1. **City Selection Across Major Indian Film Hubs:**
   - **Kochi, Thiruvananthapuram, Bengaluru, Chennai, Hyderabad, and Mumbai**.
   - Instant filtering of movie releases and verified multiplex listings.

2. **Real Indian & International Movie Metadata:**
   - Real movie metadata across **Malayalam, Tamil, Hindi, Telugu, Kannada, and English** (e.g. *Aavesham*, *Manjummel Boys*, *Leo*, *Amaran*, *Kalki 2898 AD*, *Jawan*, *Kantara*, *Dune: Part Two*).
   - Real titles, synopses, languages, genres, age classifications (`U/A 13+`, `U/A 16+`), and duration.

3. **Verified Real Cinema Multiplex Listings:**
   - **PVR INOX** (Lulu Mall Kochi, Forum Mall Koramangala Bengaluru, Express Avenue Chennai, Phoenix Palladium Mumbai).
   - **Cinepolis** (Centre Square Mall Kochi, Royal Meenakshi Bengaluru, Viviana Mall Thane).
   - **Iconic Indian Theaters** (Ariesplex SL Cinemas Thiruvananthapuram, Rohini Silver Screens Chennai, Prasads Multiplex & AMB Cinemas Hyderabad).
   - Verified location addresses, available formats (`Dolby Atmos 4K`, `IMAX Curved Laser`, `2D 4K Laser`).
   - Clearly labeled demo schedules for demonstration purposes.

4. **100% Indian Rupee (₹) Pricing Throughout:**
   - Formatted using `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`.
   - Realistic ticket prices:
     - **Regular / Standard:** ₹180
     - **Premium:** ₹240
     - **Recliner / VIP:** ₹350 – ₹420
     - **IMAX:** ₹450 – ₹650
     - **Convenience Fee:** ₹30 per seat.
   - Authoritative backend validation and transaction calculations.

5. **Authentic Interactive 3D Cinema Preview (Core Innovation):**
   - Built with genuine Three.js geometry — no static photos or perspective hacks.
   - Stepped auditorium tiers, acoustic wall slats, ceiling illumination, and realistic curved screen.
   - **Dynamic Seat-Based Camera Positioning:** Physically meaningful coordinates (`posX`, `posY + eyeLevel`, `posZ`) with smooth camera interpolation (`lerp`).
   - **Live HUD Metrics:** Real-time calculation of viewing distance to screen (in meters), SMPTE horizontal field-of-view angle (degrees), and THX acoustic sweet-spot commentary.

6. **Interactive 2D Cinema Seating:**
   - Curved screen indicator at the front.
   - 10-row stadium layout (A to J, 14 seats per row with center aisle).
   - Real-time seat statuses: Available, Selected, and Occupied.
   - Prominent **"Preview View From This Seat"** button and quick-view eye triggers.

7. **Booking Summary & Downloadable Indian E-Ticket:**
   - Contact form validation (Full Name, Email, 10-digit Indian Mobile Number).
   - Simulated Indian payment options (UPI / GPay / PhonePe / Cards).
   - Unique booking reference code (e.g. `CV-IND-XXXXX`).
   - Downloadable demo text/digital e-ticket with reservation details, labeled as simulated demo booking.

8. **Authorized Ticketing Provider Integration Architecture:**
   - Clean provider abstraction (`backend/src/services/ticketingProvider.ts`) ready for future authorized partner API handshakes (such as an authorized BookMyShow Partner API or Vista Cinema protocol).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Framer Motion, canvas-confetti |
| **3D Engine** | Three.js, React Three Fiber (`@react-three/fiber`), `@react-three/drei` |
| **Backend** | Node.js, Express.js, TypeScript, ts-node, CORS |
| **Database** | SQLite, Prisma ORM (relational schema, transactional seat locking) |
| **Testing** | Playwright E2E Test Suite (Chromium) |

---

## 🚀 Quick Start Guide

### 1. Start the Backend API Server
```bash
npm --prefix backend run dev
```
- The backend API runs at `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`

### 2. Start the Frontend Application
```bash
npm --prefix frontend run dev
```
- Open your browser at: **`http://localhost:5173`**

### 3. Database Seeding & Migrations
```bash
# Push Prisma schema to SQLite
npm run db:push

# Seed sample Indian movies, verified multiplexes, showtimes, and seats in INR
npm run seed
```

### 4. Run End-to-End Playwright Tests
```bash
npm run test:e2e
```

---

## 🧪 Automated Test Suite (12 / 12 Passing)

The project includes full end-to-end coverage in `e2e/tests/cineview.spec.ts`:
1. Home page loads successfully with updated Indian tagline & hero heading.
2. Indian city and language filters update movie display.
3. User can select a movie and view verified cinema details.
4. Theater tabs display verified multiplexes with INR pricing.
5. Available seats can be selected with INR price accumulation.
6. Occupied seats cannot be selected.
7. Selected seats can be deselected.
8. Prominent 3D Preview button opens interactive 3D virtual cinema.
9. Changing selected seat updates 3D camera position and metrics.
10. Booking form validation prevents submission with empty fields.
11. Complete Indian demo booking flow with ₹ INR pricing & e-ticket.
12. Transactional locking prevents double booking of claimed seat.
