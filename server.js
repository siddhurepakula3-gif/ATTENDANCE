const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json()); 
app.use(express.static('public')); 

// Define our "database" file
const DB_FILE = path.join(__dirname, 'database.json');

// Create the file if it doesn't exist yet
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

// ROUTE 1: Save daily attendance to JSON file
app.post('/api/submit', (req, res) => {
    try {
        const { date, records } = req.body;
        const formattedRecords = records.map(record => ({ ...record, date }));
        
        // Read existing data, add new data, and save it back
        const existingData = JSON.parse(fs.readFileSync(DB_FILE));
        existingData.push(...formattedRecords);
        fs.writeFileSync(DB_FILE, JSON.stringify(existingData, null, 2));

        res.status(200).json({ message: "Attendance saved locally!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to save data." });
    }
});

// ROUTE 2: Calculate percentage from JSON file
app.get('/api/stats/:id', (req, res) => {
    try {
        const existingData = JSON.parse(fs.readFileSync(DB_FILE));
        const studentRecords = existingData.filter(r => r.studentId === req.params.id);

        if (studentRecords.length === 0) return res.status(404).json({ message: "No records found" });

        const presentDays = studentRecords.filter(r => r.status === 'Present').length;
        const totalDays = studentRecords.length;
        const percentage = ((presentDays / totalDays) * 100).toFixed(2);
        
        res.json({ percentage: percentage + "%", totalDays, presentDays });
    } catch (err) {
        res.status(500).json({ error: "Error calculating stats." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT} (No Database Required!)`));