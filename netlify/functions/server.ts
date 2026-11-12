import { createServer } from '@netlify/server';
import app from '../../backend/src/server';

export default createServer(app);

// Netlify function configuration for API routing
export const config = { path: '/api/*' };

