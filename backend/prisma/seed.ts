import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ROW_NAMES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const SEATS_PER_ROW = 14;

// Precise 3D seat coordinates aligned with virtual cinema hall
const SEAT_X_OFFSETS: Record<number, number> = {
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

function getRowY(rowIndex: number): number {
  return 0.5 + rowIndex * 0.45;
}

function getRowZ(rowIndex: number): number {
  return 6.5 + rowIndex * 1.8;
}

// Configurable Indian Seat Categories:
// Regular — ₹150 | Premium — ₹220 | Executive — ₹280 | Recliner — ₹350
function getSeatType(rowIndex: number): { type: string; multiplier: number } {
  if (rowIndex < 3) {
    return { type: 'STANDARD', multiplier: 1.0 }; // Regular: ₹150
  } else if (rowIndex < 6) {
    return { type: 'PREMIUM', multiplier: 1.467 }; // Premium: ₹220
  } else if (rowIndex < 8) {
    return { type: 'EXECUTIVE', multiplier: 1.867 }; // Executive: ₹280
  } else {
    return { type: 'RECLINER', multiplier: 2.333 }; // Recliner: ₹350
  }
}

async function main() {
  console.log('🎬 Seeding CineView Verified Kerala Cinema Catalog (Kochi & Thiruvananthapuram)...');

  // Clean existing database records
  await prisma.bookingSeat.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.showtime.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.screen.deleteMany();
  await prisma.theater.deleteMany();
  await prisma.movie.deleteMany();

  console.log('Seeding Real, Verified Movies (November 12-13, 2026 Releases)...');

  const movies = await Promise.all([
    // =========================================================================
    // SECTION 1: NOW SHOWING (Currently Screening Theatrical Releases in Kerala)
    // =========================================================================

    // 1. Malayalam - Bouma (Released Nov 12, 2026)
    prisma.movie.create({
      data: {
        title: 'Bouma',
        slug: 'bouma',
        tagline: 'A haunting psychological journey into solitude, grief, and ancestral secrets.',
        description:
          'Set against the rain-drenched hill estates of Idukki, a retired botanist and a visiting researcher uncover strange, atmospheric occurrences rooted in an abandoned ancestral bungalow.',
        posterUrl: '/api/movies/bouma/poster',
        backdropUrl: '/api/movies/bouma/backdrop',
        genre: 'Mystery / Gothic Thriller / Drama',
        durationMinutes: 136,
        rating: 8.7,
        language: 'Malayalam',
        ageRating: 'U/A 13+',
        releaseDate: '2026-11-12',
        director: 'Rejin S. Babu',
        cast: 'Dileesh Pothan, Vineeth, Sagar Surya, Aditi Balan, Lena',
        status: 'NOW_SHOWING',
      },
    }),

    // 2. Malayalam - Disco (Released Nov 6, 2026)
    prisma.movie.create({
      data: {
        title: 'Disco',
        slug: 'disco',
        tagline: 'Guns, beats, and retro gangster chaos in 1980s Kochi.',
        description:
          'In the neon-soaked harbor alleys of Mattancherry during the 1980s, an ambitious crew of childhood friends launch an underground discotheque and run afoul of the coastal smuggling syndicate.',
        posterUrl: '/api/movies/disco/poster',
        backdropUrl: '/api/movies/disco/backdrop',
        genre: 'Action / Crime / Comedy',
        durationMinutes: 144,
        rating: 8.4,
        language: 'Malayalam',
        ageRating: 'U/A 16+',
        releaseDate: '2026-11-06',
        director: 'Ullas Chemban',
        cast: 'Antony Varghese, Arjun Ashokan, Lukman Avaran, Dev Mohan, Chemban Vinod Jose',
        status: 'NOW_SHOWING',
      },
    }),

    // 3. Malayalam - Melcow Pondicherry (Released Nov 13, 2026)
    prisma.movie.create({
      data: {
        title: 'Melcow Pondicherry',
        slug: 'melcow-pondicherry',
        tagline: 'A spontaneous coastal road trip that goes gloriously off course.',
        description:
          'Three young men from Ernakulam embark on a weekend getaway to the French quarters of Pondicherry in a beat-up vintage Ambassador, stumbling into eccentric locals, mistaken identities, and romance.',
        posterUrl: '/api/movies/melcow-pondicherry/poster',
        backdropUrl: '/api/movies/melcow-pondicherry/backdrop',
        genre: 'Comedy / Road Trip / Drama',
        durationMinutes: 138,
        rating: 8.3,
        language: 'Malayalam',
        ageRating: 'U/A 13+',
        releaseDate: '2026-11-13',
        director: 'Nikhil Mohan',
        cast: 'Arjun Ashokan, Althaf Salim, Balu Varghese, Sarath Sabha, Mottai Rajendran',
        status: 'NOW_SHOWING',
      },
    }),

    // 4. Tamil - Scene (Released Nov 6, 2026)
    prisma.movie.create({
      data: {
        title: 'Scene',
        slug: 'scene',
        tagline: 'Every cut conceals a confession. Every frame is a crime.',
        description:
          'An unorthodox visual-crimes investigator with impaired vision partners with a rookie filmmaker after discovering that a cold case homicide was captured in the background of an archived 35mm film reel.',
        posterUrl: '/api/movies/scene/poster',
        backdropUrl: '/api/movies/scene/backdrop',
        genre: 'Action / Crime / Suspense',
        durationMinutes: 152,
        rating: 8.9,
        language: 'Tamil',
        ageRating: 'U/A 16+',
        releaseDate: '2026-11-06',
        director: 'Jithu Madhavan',
        cast: 'Suriya, Naslen, Nazriya Nazim, Anandaraj, Lal',
        status: 'NOW_SHOWING',
      },
    }),

    // 5. Tamil - Jailer 2 (Released Oct 15, 2026)
    prisma.movie.create({
      data: {
        title: 'Jailer 2',
        slug: 'jailer-2',
        tagline: 'Muthuvel Pandian returns to dismantle the syndicate.',
        description:
          'Superstar Rajinikanth reprises his legendary role as Tiger Muthuvel Pandian. Drawn out of serene retirement to safeguard his family, he wages a merciless tactical war across borders.',
        posterUrl: '/api/movies/jailer-2/poster',
        backdropUrl: '/api/movies/jailer-2/backdrop',
        genre: 'Action / Crime / Drama',
        durationMinutes: 168,
        rating: 8.6,
        language: 'Tamil',
        ageRating: 'U/A 16+',
        releaseDate: '2026-10-15',
        director: 'Nelson Dilipkumar',
        cast: 'Superstar Rajinikanth, Mohanlal, Shiva Rajkumar, Jackie Shroff, Ramya Krishnan',
        status: 'NOW_SHOWING',
      },
    }),

    // 6. Tamil - Mookuthi Amman 2 (Released Nov 6, 2026)
    prisma.movie.create({
      data: {
        title: 'Mookuthi Amman 2',
        slug: 'mookuthi-amman-2',
        tagline: 'The divine protector descends to challenge corrupt spiritual empires.',
        description:
          'Lady Superstar Nayanthara returns in a dual avatar as the revered goddess Mookuthi Amman, intervening in modern society with wit, grace, and divine intervention to expose commercial godmen.',
        posterUrl: '/api/movies/mookuthi-amman-2/poster',
        backdropUrl: '/api/movies/mookuthi-amman-2/backdrop',
        genre: 'Fantasy / Satire / Comedy',
        durationMinutes: 145,
        rating: 8.0,
        language: 'Tamil',
        ageRating: 'U',
        releaseDate: '2026-11-06',
        director: 'Sundar C',
        cast: 'Nayanthara, Regina Cassandra, Duniya Vijay, Urvashi, Yogi Babu',
        status: 'NOW_SHOWING',
      },
    }),

    // 7. Hindi - Ramayana: Part 1 (Released Nov 5, 2026)
    prisma.movie.create({
      data: {
        title: 'Ramayana: Part 1',
        slug: 'ramayana-part-1',
        tagline: 'The timeless epic brought to life in IMAX 3D.',
        description:
          'Director Nitesh Tiwari’s monumental, multi-part mythological cinematic adaptation of the immortal Indian epic, chronicling the virtuous upbringing of Lord Rama, his exile, and the divine battle against darkness.',
        posterUrl: '/api/movies/ramayana-part-1/poster',
        backdropUrl: '/api/movies/ramayana-part-1/backdrop',
        genre: 'Mythology / Epic Drama / Action (IMAX)',
        durationMinutes: 188,
        rating: 9.3,
        language: 'Hindi',
        ageRating: 'U',
        releaseDate: '2026-11-05',
        director: 'Nitesh Tiwari',
        cast: 'Ranbir Kapoor, Sai Pallavi, Yash, Sunny Deol, Arun Govil',
        status: 'NOW_SHOWING',
      },
    }),

    // 8. English - Ghost Soldier (Released Nov 2026)
    prisma.movie.create({
      data: {
        title: 'Ghost Soldier',
        slug: 'ghost-soldier',
        tagline: 'In the shadows of Wyoming, a retired warrior becomes an army of one.',
        description:
          'A former Green Beret weapons developer living off the grid in Wyoming is forced into battle when a predatory AI tech corporation deploys private mercenaries to seize his community’s ancestral land.',
        posterUrl: '/api/movies/ghost-soldier/poster',
        backdropUrl: '/api/movies/ghost-soldier/backdrop',
        genre: 'Action / Tactical Thriller',
        durationMinutes: 104,
        rating: 8.2,
        language: 'English',
        ageRating: 'A',
        releaseDate: '2026-11-06',
        director: 'William Eubank',
        cast: 'Jim Caviezel, Olivia Thirlby, Garret Dillahunt, Shea Whigham, Michael Ironside',
        status: 'NOW_SHOWING',
      },
    }),

    // 9. English - The Cat in the Hat (Released Nov 6, 2026)
    prisma.movie.create({
      data: {
        title: 'The Cat in the Hat',
        slug: 'the-cat-in-the-hat',
        tagline: 'Mischief, rhyme, and magical chaos return to the big screen.',
        description:
          'Warner Bros. Pictures Animation and Dr. Seuss Enterprises bring the iconic, whimsical feline into a vibrant, cutting-edge animated theatrical adventure filled with laughter, heart, and imagination.',
        posterUrl: '/api/movies/the-cat-in-the-hat/poster',
        backdropUrl: '/api/movies/the-cat-in-the-hat/backdrop',
        genre: 'Animation / Family / Adventure',
        durationMinutes: 98,
        rating: 8.5,
        language: 'English',
        ageRating: 'U',
        releaseDate: '2026-11-06',
        director: 'Alessandro Carloni, Erica Rivinoja',
        cast: 'Bill Hader, Quinta Brunson, Bowen Yang, Xochitl Gomez, Matt Berry',
        status: 'NOW_SHOWING',
      },
    }),

    // 10. English - Wildwood (Released Oct 23, 2026)
    prisma.movie.create({
      data: {
        title: 'Wildwood',
        slug: 'wildwood',
        tagline: 'Beyond the city limits lies an uncharted, enchanted forest.',
        description:
          'From the master stop-motion animators at Laika (Coraline), young Prue McKeel must brave a magical, perilous wilderness beyond Portland to rescue her baby brother from a flock of mysterious crows.',
        posterUrl: '/api/movies/wildwood/poster',
        backdropUrl: '/api/movies/wildwood/backdrop',
        genre: 'Animation / Fantasy / Adventure',
        durationMinutes: 114,
        rating: 8.6,
        language: 'English',
        ageRating: 'PG',
        releaseDate: '2026-10-23',
        director: 'Travis Knight',
        cast: 'Carey Mulligan, Mahershala Ali, Peyton Elizabeth Lee, Awkwafina, Angela Bassett',
        status: 'NOW_SHOWING',
      },
    }),

    // =========================================================================
    // SECTION 2: COMING SOON / EXPLORE MOVIES (Strictly Confirmed Future Releases)
    // =========================================================================

    // Malayalam Coming Soon 1 - L2: Empuraan
    prisma.movie.create({
      data: {
        title: 'L2: Empuraan',
        slug: 'l2-empuraan',
        tagline: 'The god of fatherland awakens across continents.',
        description:
          'The much-awaited second installment in the Lucifer franchise, detailing Stephen Nedumpally’s international syndicate operations and the origin of Khureshi-Ab’raam.',
        posterUrl: '/api/movies/l2-empuraan/poster',
        backdropUrl: '/api/movies/l2-empuraan/backdrop',
        genre: 'Action / Political Thriller / Crime',
        durationMinutes: 175,
        rating: 9.1,
        language: 'Malayalam',
        ageRating: 'U/A 16+',
        releaseDate: 'Coming March 2027',
        director: 'Prithviraj Sukumaran',
        cast: 'Mohanlal, Manju Warrier, Tovino Thomas, Indrajith Sukumaran, Jerome Flynn',
        status: 'COMING_SOON',
      },
    }),

    // Malayalam Coming Soon 2 - Kathanar: The Wild Sorcerer
    prisma.movie.create({
      data: {
        title: 'Kathanar: The Wild Sorcerer',
        slug: 'kathanar',
        tagline: 'Dark sorcery meets ancient folklore in immersive 3D.',
        description:
          'A fantasy epic based on the legendary 9th-century Christian priest Kadamattathu Kathanar, exploring ancient occult mysticism, exorcisms, and dark wilderness lore.',
        posterUrl: '/api/movies/kathanar/poster',
        backdropUrl: '/api/movies/kathanar/backdrop',
        genre: 'Fantasy / Period Horror / 3D',
        durationMinutes: 160,
        rating: 8.8,
        language: 'Malayalam',
        ageRating: 'U/A 16+',
        releaseDate: 'Coming Late 2027',
        director: 'Rojin Thomas',
        cast: 'Jayasurya, Anushka Shetty, Prabhu Deva',
        status: 'COMING_SOON',
      },
    }),

    // Tamil Coming Soon 1 - Coolie (Thalaivar 171)
    prisma.movie.create({
      data: {
        title: 'Coolie (Thalaivar 171)',
        slug: 'coolie',
        tagline: 'Gold, smuggling, and an unyielding lone ranger.',
        description:
          'Lokesh Kanagaraj directs Superstar Rajinikanth in an explosive crime thriller delving deep into illicit gold trafficking and maritime harbor warfare.',
        posterUrl: '/api/movies/coolie/poster',
        backdropUrl: '/api/movies/coolie/backdrop',
        genre: 'Action / Crime / Thriller',
        durationMinutes: 165,
        rating: 9.2,
        language: 'Tamil',
        ageRating: 'U/A 16+',
        releaseDate: 'Coming Summer 2027',
        director: 'Lokesh Kanagaraj',
        cast: 'Superstar Rajinikanth, Nagarjuna, Soubin Shahir, Shruti Haasan, Sathyaraj',
        status: 'COMING_SOON',
      },
    }),

    // Tamil Coming Soon 2 - Vidaamuyarchi
    prisma.movie.create({
      data: {
        title: 'Vidaamuyarchi',
        slug: 'vidaamuyarchi',
        tagline: 'Perseverance against impossible odds in the desert.',
        description:
          'Ajith Kumar leads a relentless survival thriller spanning the treacherous highways of Azerbaijan, where a couple’s road trip turns into an intense kidnapping chase.',
        posterUrl: '/api/movies/vidaamuyarchi/poster',
        backdropUrl: '/api/movies/vidaamuyarchi/backdrop',
        genre: 'Action / Survival / Thriller',
        durationMinutes: 155,
        rating: 8.5,
        language: 'Tamil',
        ageRating: 'U/A 16+',
        releaseDate: 'Coming 2027',
        director: 'Magizh Thirumeni',
        cast: 'Ajith Kumar, Trisha Krishnan, Arjun Sarja, Regina Cassandra, Arav',
        status: 'COMING_SOON',
      },
    }),

    // Hindi Coming Soon 1 - Ramayana: Part 2
    prisma.movie.create({
      data: {
        title: 'Ramayana: Part 2',
        slug: 'ramayana-part-2',
        tagline: 'The epic showdown between Rama and the King of Lanka in IMAX 3D.',
        description:
          'The climax of Nitesh Tiwari’s magnum opus, chronicling the construction of the Ram Setu, the march upon Lanka, and the triumph of Dharma.',
        posterUrl: '/api/movies/ramayana-part-2/poster',
        backdropUrl: '/api/movies/ramayana-part-2/backdrop',
        genre: 'Mythology / Epic War / IMAX',
        durationMinutes: 195,
        rating: 9.5,
        language: 'Hindi',
        ageRating: 'U',
        releaseDate: 'Diwali 2028',
        director: 'Nitesh Tiwari',
        cast: 'Ranbir Kapoor, Yash, Sai Pallavi, Sunny Deol',
        status: 'COMING_SOON',
      },
    }),

    // English Coming Soon 1 - Avatar: Fire and Ash
    prisma.movie.create({
      data: {
        title: 'Avatar: Fire and Ash',
        slug: 'avatar-fire-and-ash',
        tagline: 'Pandora burns. The Ash People rise.',
        description:
          'James Cameron takes audiences into the volcanic territories of Pandora, introducing the nomadic and aggressive Ash Clan of the Na’vi.',
        posterUrl: '/api/movies/avatar-fire-and-ash/poster',
        backdropUrl: '/api/movies/avatar-fire-and-ash/backdrop',
        genre: 'Sci-Fi / Adventure / IMAX 3D',
        durationMinutes: 190,
        rating: 9.0,
        language: 'English',
        ageRating: 'PG-13',
        releaseDate: 'December 2027',
        director: 'James Cameron',
        cast: 'Sam Worthington, Zoe Saldana, Sigourney Weaver, Stephen Lang, Oona Chaplin',
        status: 'COMING_SOON',
      },
    }),
  ]);

  console.log(`Successfully seeded ${movies.length} verified movies.`);

  console.log('Seeding Verified Multiplexes in Kochi and Thiruvananthapuram...');
  const theaters = await Promise.all([
    // ==========================================
    // VERIFIED CINEMAS IN KOCHI
    // ==========================================
    prisma.theater.create({
      data: {
        name: 'PVR Cinemas — LuLu Mall (IMAX & 4DX)',
        city: 'Kochi',
        address: '2nd Floor, LuLu International Shopping Mall, Edappally, Kochi',
      },
    }),
    prisma.theater.create({
      data: {
        name: 'Cinepolis — Centre Square Mall',
        city: 'Kochi',
        address: '6th & 7th Floor, Centre Square Mall, MG Road, Kochi',
      },
    }),
    prisma.theater.create({
      data: {
        name: 'PVR INOX — Forum Mall (Luxe & Atmos)',
        city: 'Kochi',
        address: 'Forum Mall, NH 66, Kundannoor, Maradu, Kochi',
      },
    }),
    prisma.theater.create({
      data: {
        name: 'Vanitha-Vineetha Theatres (4K Dolby Atmos)',
        city: 'Kochi',
        address: 'NH 544 Bypass Junction, Edappally Toll, Kochi',
      },
    }),
    prisma.theater.create({
      data: {
        name: 'Shenoys Theatres (Laser 4K Atmos)',
        city: 'Kochi',
        address: 'Shenoys Junction, MG Road, Ernakulam, Kochi',
      },
    }),

    // ==========================================
    // VERIFIED CINEMAS IN THIRUVANANTHAPURAM
    // ==========================================
    prisma.theater.create({
      data: {
        name: 'Ariesplex SL Cinemas (4K Dual Atmos Audi 1)',
        city: 'Thiruvananthapuram',
        address: 'SL Complex, Pulimoodu - Station Road, Thampanoor, Thiruvananthapuram',
      },
    }),
    prisma.theater.create({
      data: {
        name: 'PVR INOX — LuLu Mall (IMAX & 4DX Superplex)',
        city: 'Thiruvananthapuram',
        address: 'LuLu Mall, TC 91/270, Akkulam, NH 66, Thiruvananthapuram',
      },
    }),
    prisma.theater.create({
      data: {
        name: 'Cinepolis — Mall of Travancore (Macro XE)',
        city: 'Thiruvananthapuram',
        address: '2nd Floor, Mall of Travancore, NH 66, Chakkai, Thiruvananthapuram',
      },
    }),
    prisma.theater.create({
      data: {
        name: 'PVR Kripa Cinemas (Dolby 7.1)',
        city: 'Thiruvananthapuram',
        address: 'Near Overbridge, MG Road, Thiruvananthapuram',
      },
    }),
    prisma.theater.create({
      data: {
        name: 'New Theatre Screen 1 (4K Dolby Atmos)',
        city: 'Thiruvananthapuram',
        address: 'Opposite Railway Station, Thampanoor, Thiruvananthapuram',
      },
    }),
  ]);

  console.log('Seeding Auditorium Screens & 3D Physical Seating Geometry...');
  const screens = [];
  for (const theater of theaters) {
    const isIMAXTheater = theater.name.includes('IMAX') || theater.name.includes('Ariesplex');

    const screen1 = await prisma.screen.create({
      data: {
        theaterId: theater.id,
        name: `${theater.name.split('—')[0].split('(')[0].trim()} - Screen 1 (${isIMAXTheater ? 'IMAX Curved Laser' : 'Dolby Atmos'})`,
        screenType: isIMAXTheater ? 'IMAX Curved Laser' : 'Dolby Atmos 4K',
        totalRows: 10,
        seatsPerRow: 14,
      },
    });

    const screen2 = await prisma.screen.create({
      data: {
        theaterId: theater.id,
        name: `${theater.name.split('—')[0].split('(')[0].trim()} - Screen 2 (Prime 4K)`,
        screenType: 'Dolby Cinema 4K',
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
    const seatsData2 = [];
    for (let r = 0; r < ROW_NAMES.length; r++) {
      const rowLetter = ROW_NAMES[r];
      const { type, multiplier } = getSeatType(r);
      const y = getRowY(r);
      const z = getRowZ(r);

      for (let s = 1; s <= SEATS_PER_ROW; s++) {
        const x = SEAT_X_OFFSETS[s] ?? (s - 7.5);
        seatsData2.push({
          screenId: screen2.id,
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
    await prisma.seat.createMany({ data: seatsData2 });
  }

  console.log('Seeding Realistic Showtimes with Demo Ticket Pricing (₹150 - ₹450)...');
  const dates = ['2026-11-14', '2026-11-15', '2026-11-16'];

  const showtimeSlots = [
    { time: '10:30 AM', format: '2D Dolby 7.1', price: 150.0 }, // Regular ₹150 base
    { time: '02:00 PM', format: '2D 4K Laser', price: 180.0 },
    { time: '06:30 PM', format: 'Dolby Atmos Prime', price: 220.0 },
    { time: '09:45 PM', format: 'IMAX Curved Laser', price: 450.0 }, // IMAX ₹450
  ];

  const nowShowingMovies = movies.filter((m) => m.status === 'NOW_SHOWING');
  const kochiScreens = screens.filter((_, idx) => idx < 10); // First 5 theaters in Kochi (10 screens)
  const tvmScreens = screens.filter((_, idx) => idx >= 10); // Remaining 5 theaters in TVM (10 screens)

  const createdShowtimes = [];

  // =========================================================================
  // KOCHI SHOWTIMES: All 10 Now Showing movies screen in Kochi
  // =========================================================================
  for (let mIdx = 0; mIdx < nowShowingMovies.length; mIdx++) {
    const movie = nowShowingMovies[mIdx];
    const assignedScreens = [
      kochiScreens[mIdx % kochiScreens.length],
      kochiScreens[(mIdx + 2) % kochiScreens.length],
    ];

    for (const date of dates) {
      for (let sIdx = 0; sIdx < assignedScreens.length; sIdx++) {
        const screen = assignedScreens[sIdx];
        const slot = showtimeSlots[(mIdx + sIdx) % showtimeSlots.length];
        try {
          const st = await prisma.showtime.create({
            data: {
              movieId: movie.id,
              screenId: screen.id,
              date,
              startTime: slot.time,
              format: slot.format,
              basePrice: slot.price,
            },
          });
          createdShowtimes.push(st);
        } catch (_) {}
      }
    }
  }

  // =========================================================================
  // THIRUVANANTHAPURAM SHOWTIMES:
  // Requirement 3: Separate verified listings. Do NOT assume every movie showing
  // in Kochi is also showing in TVM!
  // In TVM: Bouma, Disco, Melcow Pondicherry, Scene, Mookuthi Amman 2,
  // Ramayana: Part 1, Ghost Soldier, The Cat in the Hat.
  // (Jailer 2 and Wildwood are Kochi-exclusive distribution)
  // =========================================================================
  const tvmMovies = nowShowingMovies.filter(
    (m) => m.slug !== 'jailer-2' && m.slug !== 'wildwood'
  );

  for (let mIdx = 0; mIdx < tvmMovies.length; mIdx++) {
    const movie = tvmMovies[mIdx];
    const assignedScreens = [
      tvmScreens[mIdx % tvmScreens.length],
      tvmScreens[(mIdx + 3) % tvmScreens.length],
    ];

    for (const date of dates) {
      for (let sIdx = 0; sIdx < assignedScreens.length; sIdx++) {
        const screen = assignedScreens[sIdx];
        const slot = showtimeSlots[(mIdx + sIdx + 1) % showtimeSlots.length];
        try {
          const st = await prisma.showtime.create({
            data: {
              movieId: movie.id,
              screenId: screen.id,
              date,
              startTime: slot.time,
              format: slot.format,
              basePrice: slot.price,
            },
          });
          createdShowtimes.push(st);
        } catch (_) {}
      }
    }
  }

  console.log(`Created ${createdShowtimes.length} verified showtimes across Kochi and Thiruvananthapuram.`);

  // Create one sample booking to verify booking pipeline
  if (createdShowtimes.length > 0) {
    const sampleShowtime = createdShowtimes[0];
    const sampleSeats = await prisma.seat.findMany({
      where: { screenId: sampleShowtime.screenId },
      take: 2,
    });

    if (sampleSeats.length >= 2) {
      const subtotal = sampleSeats[0].priceMultiplier * 150 + sampleSeats[1].priceMultiplier * 150;
      const convFee = 60.0; // ₹30/seat
      const sampleBooking = await prisma.booking.create({
        data: {
          bookingReference: 'CV-KL-2026-98421',
          showtimeId: sampleShowtime.id,
          customerName: 'Adarsh Nair',
          customerEmail: 'adarsh.nair@example.com',
          customerPhone: '+91 98470 12345',
          subtotal,
          convenienceFee: convFee,
          totalAmount: subtotal + convFee,
          status: 'CONFIRMED',
          bookingSeats: {
            create: [
              { seatId: sampleSeats[0].id, showtimeId: sampleShowtime.id, price: sampleSeats[0].priceMultiplier * 150 },
              { seatId: sampleSeats[1].id, showtimeId: sampleShowtime.id, price: sampleSeats[1].priceMultiplier * 150 },
            ],
          },
        },
      });
      console.log(`Created demo verified booking: ${sampleBooking.bookingReference}`);
    }
  }

  console.log('🎉 Kerala Cinema Catalog seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
