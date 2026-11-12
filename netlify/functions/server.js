import { createServer } from '@netlify/server';
import app from '../../backend/dist/server.js';

export default createServer(app);

// Netlify function configuration for API routing
export const config = { path: '/api/*' };

