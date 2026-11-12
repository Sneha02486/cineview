import { Router, Request, Response } from 'express';
import prisma from '../db';

const router = Router();

// GET /api/showtimes/:id - Get showtime details
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = (Array.isArray(rawId) ? rawId[0] : rawId) as string;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Showtime ID is required' });
    }

    const showtime = await prisma.showtime.findUnique({
      where: { id },
      include: {
        movie: true,
        screen: {
          include: {
            theater: true,
          },
        },
      },
    });

    if (!showtime) {
      return res.status(404).json({ success: false, message: 'Showtime not found' });
    }

    res.json({ success: true, data: showtime });
  } catch (error: any) {
    console.error('Error fetching showtime:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch showtime', error: error.message });
  }
});

// GET /api/showtimes/:id/seats - Get seating layout with availability for this specific showtime
router.get('/:id/seats', async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = (Array.isArray(rawId) ? rawId[0] : rawId) as string;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Showtime ID is required' });
    }

    const showtime = await prisma.showtime.findUnique({
      where: { id },
      include: {
        movie: true,
        screen: {
          include: {
            theater: true,
            seats: {
              orderBy: [{ row: 'asc' }, { number: 'asc' }],
            },
          },
        },
        bookingSeats: {
          select: {
            seatId: true,
          },
        },
      },
    });

    if (!showtime) {
      return res.status(404).json({ success: false, message: 'Showtime not found' });
    }

    // Set of booked seat IDs for THIS showtime
    const bookedSeatIds = new Set(showtime.bookingSeats.map((bs: { seatId: string }) => bs.seatId));

    const seatsWithStatus = showtime.screen.seats.map((seat: any) => {
      const isOccupied = bookedSeatIds.has(seat.id);
      const computedPrice = Number((showtime.basePrice * seat.priceMultiplier).toFixed(2));

      return {
        id: seat.id,
        seatCode: seat.seatCode,
        row: seat.row,
        number: seat.number,
        type: seat.type,
        priceMultiplier: seat.priceMultiplier,
        price: computedPrice,
        isOccupied,
        // 3D coordinates
        posX: seat.posX,
        posY: seat.posY,
        posZ: seat.posZ,
      };
    });

    // Group seats by row for 2D seat map grid
    const rowsMap = new Map<string, typeof seatsWithStatus>();
    for (const seat of seatsWithStatus) {
      if (!rowsMap.has(seat.row)) {
        rowsMap.set(seat.row, []);
      }
      rowsMap.get(seat.row)!.push(seat);
    }

    const rows = Array.from(rowsMap.entries()).map(([rowLetter, seats]) => ({
      row: rowLetter,
      seats,
    }));

    const totalSeats = seatsWithStatus.length;
    const occupiedSeatsCount = seatsWithStatus.filter((s: any) => s.isOccupied).length;
    const availableSeatsCount = totalSeats - occupiedSeatsCount;

    res.json({
      success: true,
      data: {
        showtime: {
          id: showtime.id,
          date: showtime.date,
          startTime: showtime.startTime,
          format: showtime.format,
          basePrice: showtime.basePrice,
        },
        movie: {
          id: showtime.movie.id,
          title: showtime.movie.title,
          genre: showtime.movie.genre,
          durationMinutes: showtime.movie.durationMinutes,
          rating: showtime.movie.rating,
          ageRating: showtime.movie.ageRating,
          posterUrl: showtime.movie.posterUrl,
          backdropUrl: showtime.movie.backdropUrl,
        },
        theater: {
          id: showtime.screen.theater.id,
          name: showtime.screen.theater.name,
          city: showtime.screen.theater.city,
          address: showtime.screen.theater.address,
        },
        screen: {
          id: showtime.screen.id,
          name: showtime.screen.name,
          screenType: showtime.screen.screenType,
          totalRows: showtime.screen.totalRows,
          seatsPerRow: showtime.screen.seatsPerRow,
        },
        summary: {
          totalSeats,
          occupiedSeatsCount,
          availableSeatsCount,
        },
        seats: seatsWithStatus,
        rows,
      },
    });
  } catch (error: any) {
    console.error('Error fetching showtime seats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch seats', error: error.message });
  }
});

export default router;
