const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "/src")));

// Database
const dbPath = path.join(__dirname, "/db/votes.db");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database:", err);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Create the table if it doesn't exist
db.run(
    `CREATE TABLE IF NOT EXISTS ms_form_votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        choice TEXT
    )`
);

// Handle voting
app.post("/vote", (req, res) => {
    const { choice } = req.body;

    if (!choice || (choice !== "yes" && choice !== "no")) {
        return res.status(400).json({ error: "Invalid vote choice." });
    }

    db.get("SELECT COUNT(*) as count FROM ms_form_votes", (err, row) => {
        if (err) {
            return res.status(500).json({ error: "Database error." });
        }

        if (row.count > 0) {
            return res.json({ success: false, message: "Vote already recorded." });
        } else {
            db.run(
                "INSERT INTO ms_form_votes (choice) VALUES (?)",
                [choice],
                (err) => {
                    if (err) {
                        return res.status(500).json({ error: "Database error." });
                    }
                    res.json({ success: true, message: "Vote recorded." });
                }
            );
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
