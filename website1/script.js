const socket = io(); // Connect to the server

document.getElementById('sendButton').addEventListener('click', () => {
  const message = document.getElementById('messageInput').value;
  socket.emit('sendToWebsite2', message); // Send to server
  document.getElementById('messageInput').value = ''; // Clear input
});