# 🎬 CineView — Interactive 3D Movie Seat Booking System

**See Your View Before You Book.**

CineView is a modern, full-stack movie ticket booking web application designed for the Indian cinema experience. Its standout feature is an **interactive 3D cinema seat preview** that allows users to visualize the movie screen from their selected seat before confirming a booking.

Unlike traditional movie booking platforms that rely on a flat 2D seating layout, CineView uses **Three.js and React Three Fiber** to simulate a realistic cinema environment, calculate seat-based viewing perspectives, and help users make more informed seating decisions.

> **YOUR PERFECT VIEW STARTS HERE**

## ✨ Key Features

### 🎥 1. Interactive 3D Cinema Seat Preview

The core innovation of CineView is its immersive seat-viewing experience.

- Realistic virtual cinema hall built using Three.js geometry.
- Dynamic camera positioning based on selected seat coordinates.
- Eye-level perspective from individual seats.
- Smooth camera transitions using interpolation.
- Realistic screen distance and viewing-angle calculations.
- Stadium-style seating, auditorium lighting, acoustic wall details, and cinema screen.
- Live viewing metrics displayed through an interactive HUD.

Users can select different seats and immediately compare how the cinema screen appears from each location.

**Example:** Selecting a front-row seat provides a closer viewing perspective, while a middle-row seat provides a more balanced screen view.

*The 3D preview is a simulation based on virtual auditorium geometry, not a verified representation of a particular real cinema hall.*

### 🎟️ 2. Interactive Movie Seat Selection

- Interactive 2D seating arrangement.
- 10 rows (A–J) with 14 seats per row.
- Clearly identified available, selected, and occupied seats.
- Center aisle and organized seat categories.
- Individual seat pricing.
- Automatic ticket price calculation.
- Quick-access 3D preview.
- Seat selection and deselection.
- Prevention of duplicate bookings through backend validation.

### 🇮🇳 3. Indian Cinema Experience

CineView is customized for Indian audiences.

**Supported cities:**
- Kochi
- Thiruvananthapuram
- Bengaluru
- Chennai
- Hyderabad
- Mumbai

**Supported languages:**
- Malayalam
- Tamil
- Hindi
- Telugu
- Kannada
- English

Users can browse movies and filter listings by location and language.

### 🍿 4. Movie Discovery and Details

The application supports Indian and international movie metadata, including:

- Movie titles and descriptions
- Posters and visual assets
- Language and genre
- Duration and release information
- Age classifications
- Cinema formats
- Theater selection
- Show dates and times

The movie catalog can include Malayalam, Tamil, Hindi, Telugu, Kannada, and Hollywood titles.

Movie metadata and cinema information are separate from live ticketing availability. Demo showtimes are clearly distinguished from verified real-time screenings.

### 🏢 5. Indian Cinema Listings

CineView includes cinema information for major Indian multiplex operators and selected local theaters.

Examples include:

- PVR INOX
- Cinepolis
- Ariesplex SL Cinemas
- Rohini Silver Screens
- Prasads Multiplex
- AMB Cinemas

The application supports city-based cinema filtering and theater-specific showtime selection.

**Note:** Cinema information is intended for demonstration. Actual screenings, ticket inventory, and seat availability require an authorized live booking provider.

### 💰 6. Indian Rupee Pricing

All ticket prices and booking totals are displayed in Indian rupees (₹).

Currency formatting uses:

`Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`

**Sample ticket pricing**

| Seat category | Demo price |
|---|---:|
| Regular / Standard | ₹180 |
| Premium | ₹240 |
| Recliner / VIP | ₹350–₹420 |
| IMAX | ₹450–₹650 |
| Convenience fee | ₹30 per seat |

The system calculates ticket subtotals, applicable demo fees, and final booking totals.

Prices are illustrative and do not represent verified live cinema rates.

### 💳 7. Booking and E-Ticket Generation

CineView provides a complete simulated booking experience.

**Booking features:**
- Movie and showtime selection
- Seat selection
- Passenger details form
- Email validation
- Indian mobile number validation
- Booking summary
- Simulated payment options
- Unique booking reference generation
- Downloadable demo e-ticket
- Booking confirmation screen

Supported simulated payment methods include UPI, Google Pay, PhonePe, and cards.

No real payments are processed.

### 🔐 8. Booking Validation and Seat Protection

The backend provides booking validation to reduce booking conflicts.

- Showtime-specific seat availability
- Server-side price calculation
- Booking input validation
- Transaction-based seat booking
- Duplicate seat booking prevention
- Persistent booking records

### 🔌 9. Future Ticketing Integration

CineView includes a ticketing provider abstraction designed for future integration with authorized cinema booking services.

Relevant service:

`backend/src/services/ticketingProvider.ts`

The architecture can be extended to support authorized third-party ticketing providers.

CineView does not claim an active BookMyShow integration or access to live BookMyShow inventory.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS |
| 3D Engine | Three.js, React Three Fiber, Drei |
| Animations | Framer Motion, canvas-confetti |
| Icons | Lucide React |
| Backend | Node.js, Express.js, TypeScript |
| Database | SQLite, Prisma ORM |
| Testing | Playwright |
| Version Control | Git, GitHub |

---

## 📁 Project Structure

```text
CineView/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── routes/
│   │   │   ├── bookings.ts
│   │   │   ├── movies.ts
│   │   │   └── showtimes.ts
│   │   ├── services/
│   │   │   ├── movieDataService.ts
│   │   │   └── ticketingProvider.ts
│   │   ├── db.ts
│   │   └── server.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Cinema3D/
│   │   │       ├── AllSeats.tsx
│   │   │       ├── CameraRig.tsx
│   │   │       ├── CinemaHall.tsx
│   │   │       ├── CinemaScreen.tsx
│   │   │       └── cinemaGeometry.ts
│   │   ├── context/
│   │   │   └── BookingContext.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── MovieDetails.tsx
│   │   │   ├── SeatSelection.tsx
│   │   │   ├── Preview3D.tsx
│   │   │   ├── BookingSummary.tsx
│   │   │   └── Confirmation.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   └── App.tsx
│   └── package.json
├── e2e/
│   └── tests/
│       └── cineview.spec.ts
├── playwright.config.ts
├── netlify.toml
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure the following are installed:

- Node.js
- npm
- Git
- A modern browser

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd CineView
```

Replace the placeholder with your actual GitHub repository URL.

### 2. Install Dependencies

From the project root:

```bash
npm install
npm --prefix frontend install
npm --prefix backend install
```

### 3. Configure the Database

Run the project's Prisma database setup and seed scripts:

```bash
npm run db:push
npm run seed
```

These commands assume the corresponding scripts are defined in the root `package.json`.

### 4. Start the Backend

```bash
npm --prefix backend run dev
```

Backend URL:

`http://localhost:5000`

Health check:

`http://localhost:5000/api/health`

### 5. Start the Frontend

Open another terminal:

```bash
npm --prefix frontend run dev
```

Frontend URL:

`http://localhost:5173`

### 6. Run Automated Tests

```bash
npm run test:e2e
```

If required, install Playwright's browser binaries:

```bash
npx playwright install chromium
```

---

## 🧪 Playwright Automation Testing

CineView includes an end-to-end test suite located at:

`e2e/tests/cineview.spec.ts`

The test scenarios cover:

1. Homepage loading and branding.
2. Indian city and language filtering.
3. Movie selection and cinema information.
4. Theater selection and INR pricing.
5. Available seat selection and price calculation.
6. Prevention of occupied-seat selection.
7. Seat deselection.
8. Opening the interactive 3D preview.
9. Dynamic camera positioning and viewing metrics.
10. Booking form validation.
11. Complete demo booking and e-ticket generation.
12. Prevention of duplicate seat bookings.

**Test status:** 12 documented scenarios. Execute the Playwright suite to confirm the current passing count.

---

## 🔄 Application Workflow

```text
Launch CineView
       |
       v
Select City
       |
       v
Browse Movies
       |
       v
Select Movie & Showtime
       |
       v
View 2D Seating Layout
       |
       v
Select Available Seat
       |
       v
Preview 3D Screen Perspective
       |
       v
Compare Seats
       |
       v
Confirm Seat Selection
       |
       v
Enter Booking Details
       |
       v
Simulated Payment
       |
       v
Booking Confirmation
       |
       v
Download Demo E-Ticket
```

---

## 🔮 Future Enhancements

### 1. 360° Immersive Cinema Preview

Allow users to explore the auditorium from their selected seat using a fully interactive 360° viewing experience.

### 2. AI-Based Seat Recommendations

Recommend seats based on:
- Viewing angle
- Screen distance
- Comfort preferences
- Ticket budget
- Group seating requirements

### 3. Smart Group Seat Allocation

Automatically identify the best available seating arrangements for families and groups.

### 4. Real-Time Cinema Integration

Integrate authorized ticketing provider APIs for:
- Live movie showtimes
- Real-time seat availability
- Actual ticket pricing
- Genuine ticket reservations

### 5. Enhanced 3D Theater Models

Introduce theater-specific auditorium configurations, more realistic materials, and additional cinema formats.

### 6. Mobile Application

Extend CineView to Android and iOS for a more accessible movie booking experience.

---

## 🎯 Project Objective

The primary objective of CineView is to improve the movie ticket booking experience by enabling users to visualize their screen perspective before choosing a seat.

By combining interactive 2D seating, 3D cinema visualization, and a simulated Indian movie booking workflow, CineView demonstrates how immersive technology can make seat selection more informative and engaging.

**CineView — See Your View Before You Book.**

---

## ⚠️ Disclaimer

CineView is an educational and demonstration project.

- Ticket bookings are simulated.
- Ticket prices are illustrative.
- Demo tickets are not valid for cinema entry.
- Real cinema names do not imply official partnerships.
- Live seat inventory and actual ticketing require authorized integrations.
- 3D viewing perspectives are simulations based on virtual auditorium dimensions.

This project is not affiliated with BookMyShow, PVR INOX, Cinepolis, or any other cinema booking provider.