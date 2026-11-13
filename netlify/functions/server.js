const serverless = require('serverless-http');

const mod = require('../../backend/dist/server.js');
const app = typeof mod === 'function' ? mod : mod.default || mod.app;

if (typeof app !== 'function') {
    throw new Error('Express app not exported from backend/dist/server.js. Exports found: ' + Object.keys(mod).join(', '));
}

module.exports.handler = serverless(app, { basePath: '/.netlify/functions/server' });
