import { Router, Request, Response } from 'express';
import prisma from '../db';
import { movieDataService } from '../services/movieDataService';

const router = Router();

// GET /api/movies/status - Service health, last updated timestamp & provider info
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const totalCount = await prisma.movie.count();
    const status = movieDataService.getStatus(totalCount);
    res.json({
      success: true,
      data: status,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve service status', error: error.message });
  }
});

// POST /api/movies/refresh - Force refresh catalog cache and timestamp
router.post('/refresh', async (_req: Request, res: Response) => {
  try {
    movieDataService.clearCache();
    const totalCount = await prisma.movie.count();
    const status = movieDataService.getStatus(totalCount);
    res.json({
      success: true,
      message: 'Movie catalog cache refreshed successfully',
      data: status,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to refresh movie catalog', error: error.message });
  }
});

// GET /api/movies/:slug/poster - Serves tailored official-grade SVG movie poster
router.get('/:slug/poster', async (req: Request, res: Response) => {
  try {
    const slugParam = req.params.slug;
    const slug = (Array.isArray(slugParam) ? slugParam[0] : slugParam) as string;
    const movie = await prisma.movie.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
    });

    if (!movie) {
      return res.status(404).send('Movie poster not found');
    }

    const svg = movieDataService.generatePosterSvg(movie);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache 24 hours
    return res.send(svg);
  } catch (error: any) {
    res.status(500).send('Error generating movie poster');
  }
});

// GET /api/movies/:slug/backdrop - Serves tailored official-grade SVG movie backdrop
router.get('/:slug/backdrop', async (req: Request, res: Response) => {
  try {
    const slugParam = req.params.slug;
    const slug = (Array.isArray(slugParam) ? slugParam[0] : slugParam) as string;
    const movie = await prisma.movie.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
    });

    if (!movie) {
      return res.status(404).send('Movie backdrop not found');
    }

    const svg = movieDataService.generateBackdropSvg(movie);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(svg);
  } catch (error: any) {
    res.status(500).send('Error generating movie backdrop');
  }
});

// GET /api/movies - List all movies with search, genre, language, city & status filter
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, genre, language, city, status, format } = req.query;

    const cacheKey = `movies_${search || ''}_${genre || ''}_${language || ''}_${city || ''}_${status || ''}_${format || ''}`;
    const cached = movieDataService.getCache<any[]>(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        count: cached.length,
        data: cached,
        cached: true,
        metadata: movieDataService.getStatus(cached.length),
      });
    }

    const whereClause: any = {};
    if (search && typeof search === 'string') {
      whereClause.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { cast: { contains: search } },
        { director: { contains: search } },
      ];
    }
    if (genre && typeof genre === 'string' && genre !== 'All') {
      whereClause.genre = { contains: genre };
    }
    if (language && typeof language === 'string' && language !== 'All') {
      whereClause.language = { contains: language };
    }
    if (status && typeof status === 'string' && status !== 'All') {
      whereClause.status = status;
    }
    if (city && typeof city === 'string' && city !== 'All') {
      // For Now Showing, only include movies that have showtimes in screens belonging to theaters in that city
      whereClause.showtimes = {
        some: {
          screen: {
            theater: {
              city: { contains: city },
            },
          },
        },
      };
    }
    if (format && typeof format === 'string' && format !== 'All') {
      whereClause.showtimes = {
        some: {
          format: { contains: format },
        },
      };
    }

    const movies = await prisma.movie.findMany({
      where: whereClause,
      include: {
        showtimes: {
          select: {
            id: true,
            date: true,
            startTime: true,
            format: true,
          },
          take: 6,
        },
      },
      orderBy: { rating: 'desc' },
    });

    // Deduplicate movies by slug just in case
    const seenSlugs = new Set<string>();
    const deduplicatedMovies = movies.filter((m) => {
      if (seenSlugs.has(m.slug)) return false;
      seenSlugs.add(m.slug);
      return true;
    });

    // Cache the query result
    movieDataService.setCache(cacheKey, deduplicatedMovies);

    res.json({
      success: true,
      count: deduplicatedMovies.length,
      data: deduplicatedMovies,
      cached: false,
      metadata: movieDataService.getStatus(deduplicatedMovies.length),
    });
  } catch (error: any) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch movies', error: error.message });
  }
});

// GET /api/movies/:idOrSlug - Detailed movie info with showtimes and theaters (city-filtered)
router.get('/:idOrSlug', async (req: Request, res: Response) => {
  try {
    const idOrSlugParam = req.params.idOrSlug;
    const target = (Array.isArray(idOrSlugParam) ? idOrSlugParam[0] : idOrSlugParam) as string;
    const cityFilter = typeof req.query.city === 'string' ? req.query.city.trim() : null;

    if (!target) {
      return res.status(400).json({ success: false, message: 'Movie identifier is required' });
    }

    const movie = await prisma.movie.findFirst({
      where: {
        OR: [{ id: target }, { slug: target }],
      },
      include: {
        showtimes: {
          include: {
            screen: {
              include: {
                theater: true,
              },
            },
          },
          orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
        },
      },
    });

    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    // Group showtimes by theater and date for easy frontend consumption
    const theatersMap = new Map<string, any>();

    for (const st of movie.showtimes) {
      const theater = st.screen.theater;

      // When a city filter is specified (e.g. Kochi or Thiruvananthapuram), enforce strict city isolation
      if (cityFilter && cityFilter !== 'All' && !theater.city.toLowerCase().includes(cityFilter.toLowerCase())) {
        continue;
      }

      if (!theatersMap.has(theater.id)) {
        theatersMap.set(theater.id, {
          id: theater.id,
          name: theater.name,
          city: theater.city,
          address: theater.address,
          dates: {},
        });
      }

      const theaterObj = theatersMap.get(theater.id);
      if (!theaterObj.dates[st.date]) {
        theaterObj.dates[st.date] = [];
      }

      theaterObj.dates[st.date].push({
        id: st.id,
        screenId: st.screenId,
        screenName: st.screen.name,
        screenType: st.screen.screenType,
        startTime: st.startTime,
        basePrice: st.basePrice,
        format: st.format,
      });
    }

    const theatersList = Array.from(theatersMap.values()).map((t) => ({
      ...t,
      dates: Object.entries(t.dates).map(([date, showtimes]) => ({
        date,
        showtimes,
      })),
    }));

    res.json({
      success: true,
      data: {
        ...movie,
        theaters: theatersList,
      },
    });
  } catch (error: any) {
    console.error('Error fetching movie details:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch movie details', error: error.message });
  }
});

export default router;
