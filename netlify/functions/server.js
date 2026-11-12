const serverless = require('serverless-http');
const app = require('../../backend/dist/server.js');

// Netlify Function handler – adapts the Express app to a Lambda‑style handler.
module.exports.handler = serverless(app);

// Tell Netlify that this function should handle any route under /api/*
module.exports.config = { path: '/api/*' };

