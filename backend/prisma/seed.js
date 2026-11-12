"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const ROW_NAMES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const SEATS_PER_ROW = 14;
// Precise 3D seat coordinates aligned with cinema model
const SEAT_X_OFFSETS = {
    1: -6.0,
    2: -5.0,
    3: -4.0,
    4: -3.0,
    5: -2.0,
    6: -1.2,
    7: -0.4,
    8: 0.4,
    9: 1.2,
    10: 2.0,
    11: 3.0,
    12: 4.0,
    13: 5.0,
    14: 6.0,
};
function getRowY(rowIndex) {
    return 0.5 + rowIndex * 0.45;
}
function getRowZ(rowIndex) {
    return 6.5 + rowIndex * 1.8;
}
function getSeatType(rowIndex) {
    if (rowIndex < 4) {
        return { type: 'STANDARD', multiplier: 1.0 };
    }
    else if (rowIndex < 6) {
        return { type: 'PREMIUM', multiplier: 1.25 };
    }
    else {
        return { type: 'VIP', multiplier: 1.5 };
    }
}
async function main() {
    console.log('Clearing existing database records...');
    await prisma.bookingSeat.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.showtime.deleteMany();
    await prisma.seat.deleteMany();
    await prisma.screen.deleteMany();
    await prisma.theater.deleteMany();
    await prisma.movie.deleteMany();
    console.log('Seeding Movies...');
    const movies = await Promise.all([
        prisma.movie.create({
            data: {
                title: 'Dune: Part Two',
                slug: 'dune-part-two',
                tagline: 'Long live the fighters.',
                description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
                posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
                backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1920&auto=format&fit=crop',
                genre: 'Sci-Fi / Adventure / Drama',
                durationMinutes: 166,
                rating: 8.8,
                language: 'English (Dolby Atmos)',
                ageRating: 'PG-13',
                releaseDate: '2024-03-01',
                director: 'Denis Villeneuve',
                cast: 'Timothée Chalamet, Zendaya, Rebecca Ferguson, Javier Bardem, Austin Butler',
            },
        }),
        prisma.movie.create({
            data: {
                title: 'Interstellar — 10th Anniversary IMAX',
                slug: 'interstellar',
                tagline: 'Mankind was born on Earth. It was never meant to die here.',
                description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
                posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
                backdropUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1920&auto=format&fit=crop',
                genre: 'Sci-Fi / Adventure',
                durationMinutes: 169,
                rating: 8.9,
                language: 'English (IMAX 70mm)',
                ageRating: 'PG-13',
                releaseDate: '2024-11-07',
                director: 'Christopher Nolan',
                cast: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain, Michael Caine',
            },
        }),
        prisma.movie.create({
            data: {
                title: 'Oppenheimer',
                slug: 'oppenheimer',
                tagline: 'The story of the man who moved the earth.',
                description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, exploring the moral paradoxes of world-altering scientific ambition.',
                posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop',
                backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop',
                genre: 'Biography / Drama / History',
                durationMinutes: 180,
                rating: 8.9,
                language: 'English',
                ageRating: 'R',
                releaseDate: '2023-07-21',
                director: 'Christopher Nolan',
                cast: 'Cillian Murphy, Emily Blunt, Matt Damon, Robert Downey Jr., Florence Pugh',
            },
        }),
        prisma.movie.create({
            data: {
                title: 'Cyberpunk: Neon Horizon',
                slug: 'cyberpunk-neon-horizon',
                tagline: 'In the shadows of neon, memories bleed.',
                description: 'In a sprawling 2088 megacity governed by neural synthetic networks, a rogue memory-runner discovers a classified human consciousness embedded inside the city’s quantum core grid.',
                posterUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
                backdropUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1920&auto=format&fit=crop',
                genre: 'Cyberpunk / Action / Thriller',
                durationMinutes: 142,
                rating: 8.5,
                language: 'English (Surround 7.1)',
                ageRating: 'R',
                releaseDate: '2025-01-15',
                director: 'Guillermo del Toro',
                cast: 'Keanu Reeves, Hiroyuki Sanada, Ana de Armas, Karl Urban',
            },
        }),
        prisma.movie.create({
            data: {
                title: 'Gladiator II',
                slug: 'gladiator-ii',
                tagline: 'What we do in life echoes in eternity.',
                description: 'Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.',
                posterUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop',
                backdropUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1920&auto=format&fit=crop',
                genre: 'Action / Epic / Historical',
                durationMinutes: 148,
                rating: 8.2,
                language: 'English',
                ageRating: 'R',
                releaseDate: '2024-11-22',
                director: 'Ridley Scott',
                cast: 'Paul Mescal, Pedro Pascal, Denzel Washington, Connie Nielsen',
            },
        }),
        prisma.movie.create({
            data: {
                title: 'Blade Runner 2049',
                slug: 'blade-runner-2049',
                tagline: 'The key to the future is finally unearthed.',
                description: 'Young Blade Runner K’s discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who’s been missing for thirty years.',
                posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop',
                backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop',
                genre: 'Sci-Fi / Mystery / Thriller',
                durationMinutes: 164,
                rating: 8.0,
                language: 'English (Dolby Vision)',
                ageRating: 'R',
                releaseDate: '2017-10-06',
                director: 'Denis Villeneuve',
                cast: 'Ryan Gosling, Harrison Ford, Ana de Armas, Sylvia Hoeks',
            },
        }),
    ]);
    console.log('Seeding Theaters...');
    const theaters = await Promise.all([
        prisma.theater.create({
            data: {
                name: 'CineView Grand IMAX — Metropolis Plaza',
                city: 'Metropolis',
                address: '400 Grand Avenue, Sky Tower Level 4',
            },
        }),
        prisma.theater.create({
            data: {
                name: 'CineView Dolby Cinema — Horizon Center',
                city: 'Metropolis',
                address: '888 Boulevard of the Arts, West Pavilion',
            },
        }),
        prisma.theater.create({
            data: {
                name: 'CineView Onyx Luxe — Silicon Bay',
                city: 'San Francisco',
                address: '101 Cyber Way, Tech Quarter',
            },
        }),
    ]);
    console.log('Seeding Screens and 3D Seat Geometry...');
    const screens = [];
    for (const theater of theaters) {
        const screen1 = await prisma.screen.create({
            data: {
                theaterId: theater.id,
                name: `${theater.name.split('—')[0].trim()} - Screen 1 (IMAX)`,
                screenType: 'IMAX Laser 3D',
                totalRows: 10,
                seatsPerRow: 14,
            },
        });
        const screen2 = await prisma.screen.create({
            data: {
                theaterId: theater.id,
                name: `${theater.name.split('—')[0].trim()} - Screen 2 (Dolby)`,
                screenType: 'Dolby Atmos',
                totalRows: 10,
                seatsPerRow: 14,
            },
        });
        screens.push(screen1, screen2);
        // Create 140 seats for screen1
        const seatsData1 = [];
        for (let r = 0; r < ROW_NAMES.length; r++) {
            const rowLetter = ROW_NAMES[r];
            const { type, multiplier } = getSeatType(r);
            const y = getRowY(r);
            const z = getRowZ(r);
            for (let s = 1; s <= SEATS_PER_ROW; s++) {
                const x = SEAT_X_OFFSETS[s] ?? (s - 7.5);
                seatsData1.push({
                    screenId: screen1.id,
                    row: rowLetter,
                    number: s,
                    seatCode: `${rowLetter}${s}`,
                    type,
                    priceMultiplier: multiplier,
                    posX: x,
                    posY: y,
                    posZ: z,
                });
            }
        }
        await prisma.seat.createMany({ data: seatsData1 });
        // Create 140 seats for screen2
        const seatsData2 = seatsData1.map((s) => ({ ...s, screenId: screen2.id }));
        await prisma.seat.createMany({ data: seatsData2 });
    }
    console.log('Seeding Showtimes...');
    const dates = ['2026-11-13', '2026-11-14', '2026-11-15', '2026-11-16'];
    // We have 6 screens total: screens[0..5]
    // Movie 0 (Dune 2) -> screens[0] (Metropolis Grand IMAX Screen 1)
    // Movie 1 (Interstellar) -> screens[1] (Metropolis Grand Dolby Screen 2)
    // Movie 2 (Oppenheimer) -> screens[2] (Horizon Center IMAX Screen 1)
    // Movie 3 (Cyberpunk) -> screens[3] (Horizon Center Dolby Screen 2)
    // Movie 4 (Gladiator II) -> screens[4] (Silicon Bay Onyx Screen 1)
    // Movie 5 (Blade Runner 2049) -> screens[5] (Silicon Bay Onyx Screen 2)
    const scheduleSlots = [
        { time: '11:30 AM', price: 13.5 },
        { time: '02:45 PM', price: 15.0 },
        { time: '06:00 PM', price: 18.0 },
        { time: '09:15 PM', price: 16.5 },
    ];
    const allCreatedShowtimes = [];
    for (let mIdx = 0; mIdx < movies.length; mIdx++) {
        const movie = movies[mIdx];
        const primaryScreenForMovie = screens[mIdx % screens.length];
        const secondaryScreenForMovie = screens[(mIdx + 2) % screens.length];
        for (const date of dates.slice(0, 3)) {
            for (const slot of scheduleSlots) {
                const showtime = await prisma.showtime.create({
                    data: {
                        movieId: movie.id,
                        screenId: primaryScreenForMovie.id,
                        date,
                        startTime: slot.time,
                        basePrice: slot.price,
                        format: primaryScreenForMovie.screenType,
                    },
                });
                allCreatedShowtimes.push(showtime);
            }
        }
        // Also schedule alternate evening shows on secondaryScreen with different times
        const altSlots = [
            { time: '01:15 PM', price: 14.0 },
            { time: '07:30 PM', price: 17.5 },
        ];
        for (const date of dates.slice(0, 2)) {
            for (const slot of altSlots) {
                // Ensure no collision
                const exists = await prisma.showtime.findUnique({
                    where: {
                        screenId_date_startTime: {
                            screenId: secondaryScreenForMovie.id,
                            date,
                            startTime: slot.time,
                        },
                    },
                });
                if (!exists) {
                    const showtime = await prisma.showtime.create({
                        data: {
                            movieId: movie.id,
                            screenId: secondaryScreenForMovie.id,
                            date,
                            startTime: slot.time,
                            basePrice: slot.price,
                            format: secondaryScreenForMovie.screenType,
                        },
                    });
                    allCreatedShowtimes.push(showtime);
                }
            }
        }
    }
    console.log(`Created ${allCreatedShowtimes.length} showtimes across all theaters & screens.`);
    console.log('Seeding Sample Bookings to verify Occupied Seats...');
    // Find a prime evening showtime for Dune: Part Two
    const duneShowtime = allCreatedShowtimes.find((st) => st.movieId === movies[0].id && st.startTime === '06:00 PM');
    if (duneShowtime) {
        const screenSeats = await prisma.seat.findMany({
            where: { screenId: duneShowtime.screenId },
        });
        const occupiedCodes = ['D7', 'D8', 'G7', 'G8', 'E5', 'E6', 'J1', 'B3'];
        const occupiedSeats = screenSeats.filter((s) => occupiedCodes.includes(s.seatCode));
        const booking1 = await prisma.booking.create({
            data: {
                bookingReference: 'CV-PREVIEW-8891',
                showtimeId: duneShowtime.id,
                customerName: 'Marcus Vance',
                customerEmail: 'marcus.vance@example.com',
                customerPhone: '+1 (555) 234-5678',
                subtotal: 54.0,
                convenienceFee: 4.5,
                totalAmount: 58.5,
                status: 'CONFIRMED',
            },
        });
        for (const s of occupiedSeats) {
            await prisma.bookingSeat.create({
                data: {
                    bookingId: booking1.id,
                    showtimeId: duneShowtime.id,
                    seatId: s.id,
                    price: duneShowtime.basePrice * s.priceMultiplier,
                },
            });
        }
        console.log(`Seeded demo booking with ${occupiedSeats.length} occupied seats.`);
    }
    console.log('Database seeding successfully finished!');
}
main()
    .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
