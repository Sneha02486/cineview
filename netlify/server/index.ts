import { createServer } from '@netlify/server';
import app from '../../backend/src/server';

export default createServer(app);
export const config = { path: '/api/*' };
