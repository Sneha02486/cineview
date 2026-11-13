import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import moviesRouter from './routes/movies';
import showtimesRouter from './routes/showtimes';
import bookingsRouter from './routes/bookings';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// API Routes
app.use('/api/movies', moviesRouter);
app.use('/api/showtimes', showtimesRouter);
app.use('/api/bookings', bookingsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CineView Backend API',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/env-check', (req, res) => {
  res.json({
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    startsWithPostgres: (process.env.DATABASE_URL || '').startsWith('postgresql://'),
    databaseLikeKeys: Object.keys(process.env).filter((k) => k.toUpperCase().includes('DATABASE')),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
});

// In Netlify Functions the server is invoked as a handler, so we should not start a listening
// server when this module is imported. The listen call is moved to a separate dev script.
// If you run the backend locally (e.g., npm run dev), a separate script will start the server.


if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🎬 CineView API Server running on http://localhost:${PORT}`);
  });
}

export default app;
