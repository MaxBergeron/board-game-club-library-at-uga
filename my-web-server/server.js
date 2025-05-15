// Import required modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// Create an express application
const app = express();
const PORT = 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set up a route to serve the bgc-gui.html page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'my-web-server', 'public', 'bgc-gui.html'));
});

// Start the server and listen for incoming requests
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});