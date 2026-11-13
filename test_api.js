const { handler } = require('./netlify/functions/server.js');

async function invoke(path) {
  const event = {
    httpMethod: 'GET',
    path,
    headers: {},
    queryStringParameters: null,
    body: null,
    isBase64Encoded: false,
  };
  const context = {};
  const response = await handler(event, context);
  console.log('Response for', path);
  console.log('Status:', response.statusCode);
  console.log('Body:', response.body);
}

(async () => {
  await invoke('/api/health');
  await invoke('/api/movies');
})();

