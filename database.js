const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dbDir = path.join(__dirname, "database");

if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, "chat.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database Error:", err.message);
    } else {
        console.log("Connected to SQLite database");
    }
});

module.exports = db;
