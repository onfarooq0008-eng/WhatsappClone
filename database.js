const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dbDir = path.join(__dirname, "database");
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(path.join(dbDir, "chat.db"));

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            profile TEXT DEFAULT ''
        )
    `);

    db.run(`
CREATE TABLE IF NOT EXISTS messages (

id INTEGER PRIMARY KEY AUTOINCREMENT,

sender TEXT NOT NULL,

receiver TEXT NOT NULL,

message TEXT NOT NULL,

created_at DATETIME DEFAULT CURRENT_TIMESTAMP

)
`);
    
});

module.exports = db;
