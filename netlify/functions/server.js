const serverless = require('serverless-http');

// Works whether server.ts uses `export default app` or `module.exports = app`
const mod = require('../../backend/dist/server.js');
const app = mod.default || mod;

// Strips the Netlify function prefix if it is present in the path
module.exports.handler = serverless(app, {
    basePath: '/.netlify/functions/server',
});