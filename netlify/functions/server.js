import serverless from 'serverless-http';
import app from '../../backend/dist/server.js';

// Netlify Function handler – adapts the Express app to a Lambda‑style handler.
export const handler = serverless(app);

// Tell Netlify that this function should handle any route under /api/*
export const config = { path: '/api/*' };


