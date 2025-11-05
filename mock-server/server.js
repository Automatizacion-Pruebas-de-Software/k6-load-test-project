// mock-server/server.js
const express = require('express');
const app = express();
const port = 3001; // Puerto diferente

// Middleware básico
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
});

// Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Endpoints
app.get('/', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Mock Server OK',
    timestamp: Date.now() 
  });
});

app.post('/login', (req, res) => {
  console.log('Login request:', req.body);
  res.json({
    status: 'success',
    session_id: req.body.session_id,
    user_id: req.body.user_id,
    timestamp: Date.now()
  });
});

app.get('/get', (req, res) => {
  res.json({ status: 'success', endpoint: 'get' });
});

app.get('/headers', (req, res) => {
  res.json({ status: 'success', endpoint: 'headers' });
});

app.get('/status/200', (req, res) => {
  res.json({ status: 'success', endpoint: 'status/200' });
});

app.post('/logout', (req, res) => {
  res.json({ status: 'success', message: 'logged out' });
});

app.listen(port, () => {
  console.log(`🚀 Mock Server running on http://localhost:${port}`);
  console.log('✅ Ready for k6 tests!');
});