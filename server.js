const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios'); // For geolocation API

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files for Website 1
app.use('/website1', express.static('website1'));

// Serve static files for Website 2
app.use('/website2', express.static('website2'));

// Function to get location from IP
async function getLocation(ip) {
  try {
    const response = await axios.get(`http://ipapi.co/${ip}/json/`);
    return `${response.data.city}, ${response.data.country_name}`; // e.g., "New York, United States"
  } catch (error) {
    console.error('Geolocation error:', error.message);
    return 'Location unavailable'; // Fallback if API fails
  }
}

// Handle WebSocket connections
io.on('connection', async (socket) => {
  console.log('A user connected');

  // Get the client's IP address
  let clientIP = socket.handshake.address;
  if (socket.handshake.headers['x-forwarded-for']) {
    clientIP = socket.handshake.headers['x-forwarded-for'].split(',')[0]; // Handle proxies
  }

  // Get approximate location
  const location = await getLocation(clientIP);

  // Send IP and location to Website 2
  const dataToSend = `IP: ${clientIP}, Location: ${location}`;
  io.emit('receiveFromWebsite1', dataToSend);

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});