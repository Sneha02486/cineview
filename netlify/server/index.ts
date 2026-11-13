// Netlify Server entrypoint: exporting the Express app lets Netlify host it
// in an HTTP server automatically. It only receives /api/* requests.
import app from '../../backend/src/server';

export default app;

export const config = { path: '/api/*' };
