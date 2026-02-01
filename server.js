const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// ✅ Serve Website folders properly
app.use('/website1', express.static(path.join(__dirname, 'website1')));
app.use('/website2', express.static(path.join(__dirname, 'website2')));

// 🌍 Get location from IP
async function getLocation(ip) {
  try {
    const response = await axios.get(`http://ipapi.co/${ip}/json/`);
    return `${response.data.city}, ${response.data.country_name}`;
  } catch (error) {
    console.error('Geolocation error:', error.message);
    return 'Location unavailable';
  }
}

// 🔌 WebSocket connection
io.on('connection', async (socket) => {
  console.log('A user connected');

  let clientIP = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
  clientIP = clientIP.split(',')[0];

  const location = await getLocation(clientIP);

  const dataToSend = `IP: ${clientIP}, Location: ${location}`;
  io.emit('receiveFromWebsite1', dataToSend);

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// 🚀 IMPORTANT FOR RAILWAY
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
