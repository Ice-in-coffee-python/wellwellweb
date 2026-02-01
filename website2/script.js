const socket = io(); // Connect to the server

socket.on('receiveFromWebsite1', (data) => {
  const messagesDiv = document.getElementById('messages');
  messagesDiv.innerHTML += `<p>Received: ${data}</p>`; // Display transformed message
});