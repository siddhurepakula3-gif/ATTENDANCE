const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json()); 

// 1. Tell Express exactly where the public folder is
app.use(express.static(path.join(__dirname, 'public')));

// 2. Add a direct route for the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Define our "database" file
const DB_FILE = path.join(__dirname, 'database.json');

// ... (KEEP ALL THE ROUTE 1 AND ROUTE 2 CODE BELOW EXACTLY THE SAME)