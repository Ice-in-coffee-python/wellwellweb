const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve sites
app.use('/website1', express.static(path.join(__dirname, 'website1')));
app.use('/website2', express.static(path.join(__dirname, 'website2')));

// Root test
app.get('/', (req, res) => {
  res.send('Server alive');
});

// Location lookup
async function getLocation(ip) {
  try {
    const response = await axios.get(`http://ipapi.co/${ip}/json/`);
    return `${response.data.city}, ${response.data.country_name}`;
  } catch {
    return 'Location unavailable';
  }
}

// WebSocket
io.on('connection', async (socket) => {
  let clientIP = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
  clientIP = clientIP.split(',')[0];

  const location = await getLocation(clientIP);
  io.emit('receiveFromWebsite1', `IP: ${clientIP}, Location: ${location}`);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Running on ${PORT}`));
