import { Router, Request, Response } from 'express';
import prisma from '../db';

const router = Router();

function generateReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'CV-';
  for (let i = 0; i < 5; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  ref += `-${Date.now().toString().slice(-4)}`;
  return ref;
}

// POST /api/bookings - Create a new booking
router.post('/', async (req: Request, res: Response) => {
  try {
    const { showtimeId, seatIds, customerName, customerEmail, customerPhone } = req.body;

    // Field validations
    if (!showtimeId || typeof showtimeId !== 'string') {
      return res.status(400).json({ success: false, message: 'Valid showtime ID is required' });
    }

    if (!Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one seat must be selected' });
    }

    if (!customerName || customerName.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Customer full name is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerEmail || !emailRegex.test(customerEmail.trim())) {
      return res.status(400).json({ success: false, message: 'Valid email address is required' });
    }

    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/;
    if (!customerPhone || !phoneRegex.test(customerPhone.trim())) {
      return res.status(400).json({ success: false, message: 'Valid phone number is required' });
    }

    // Fetch showtime
    const showtime = await prisma.showtime.findUnique({
      where: { id: showtimeId },
      include: {
        screen: true,
        movie: true,
      },
    });

    if (!showtime) {
      return res.status(404).json({ success: false, message: 'Showtime not found' });
    }

    // Fetch physical seats requested
    const seats = await prisma.seat.findMany({
      where: {
        id: { in: seatIds },
        screenId: showtime.screenId,
      },
    });

    if (seats.length !== seatIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more selected seats do not belong to this auditorium layout',
      });
    }

    // Execute booking atomically inside a database transaction to prevent race conditions
    const result = await prisma.$transaction(async (tx) => {
      // Check if any seat is already booked for this showtime
      const conflictSeats = await tx.bookingSeat.findMany({
        where: {
          showtimeId: showtime.id,
          seatId: { in: seatIds },
        },
        include: {
          seat: true,
        },
      });

      if (conflictSeats.length > 0) {
        const conflictCodes = conflictSeats.map((cs) => cs.seat.seatCode).join(', ');
        const error: any = new Error(
          `The following seat(s) are already booked: ${conflictCodes}. Please choose other seats.`
        );
        error.code = 'SEAT_ALREADY_BOOKED';
        throw error;
      }

      // Calculate authoritative backend prices
      let subtotal = 0;
      const seatPriceDetails = seats.map((s) => {
        const price = Number((showtime.basePrice * s.priceMultiplier).toFixed(2));
        subtotal += price;
        return {
          seatId: s.id,
          seatCode: s.seatCode,
          type: s.type,
          price,
        };
      });

      const convenienceFee = Number((seatIds.length * 30.0).toFixed(2));
      const totalAmount = Number((subtotal + convenienceFee).toFixed(2));

      // Generate booking reference
      let bookingReference = generateReference();
      let existingRef = await tx.booking.findUnique({ where: { bookingReference } });
      while (existingRef) {
        bookingReference = generateReference();
        existingRef = await tx.booking.findUnique({ where: { bookingReference } });
      }

      // Create Booking
      const booking = await tx.booking.create({
        data: {
          bookingReference,
          showtimeId: showtime.id,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim().toLowerCase(),
          customerPhone: customerPhone.trim(),
          subtotal,
          convenienceFee,
          totalAmount,
          status: 'CONFIRMED',
          bookingSeats: {
            create: seatPriceDetails.map((item) => ({
              showtimeId: showtime.id,
              seatId: item.seatId,
              price: item.price,
            })),
          },
        },
        include: {
          bookingSeats: {
            include: {
              seat: true,
            },
          },
          showtime: {
            include: {
              movie: true,
              screen: {
                include: {
                  theater: true,
                },
              },
            },
          },
        },
      });

      return booking;
    });

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('Booking creation error:', error);
    if (error.code === 'SEAT_ALREADY_BOOKED' || error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: error.message || 'One or more selected seats were just claimed by another user. Please choose another seat.',
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to complete booking. Please try again.',
    });
  }
});

// GET /api/bookings/:referenceOrId - Get booking details by reference or id
router.get('/:referenceOrId', async (req: Request, res: Response) => {
  try {
    const rawParam = req.params.referenceOrId;
    const target = (Array.isArray(rawParam) ? rawParam[0] : rawParam) as string;

    if (!target) {
      return res.status(400).json({ success: false, message: 'Booking reference or ID is required' });
    }

    const booking = await prisma.booking.findFirst({
      where: {
        OR: [{ id: target }, { bookingReference: target }],
      },
      include: {
        bookingSeats: {
          include: {
            seat: true,
          },
        },
        showtime: {
          include: {
            movie: true,
            screen: {
              include: {
                theater: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (error: any) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch booking', error: error.message });
  }
});

export default router;
