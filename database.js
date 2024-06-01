const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("DROP TABLE IF EXISTS flavors");
  db.run(`CREATE TABLE flavors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    is_favorite BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  const stmt = db.prepare("INSERT INTO flavors (name, is_favorite) VALUES (?, ?)");
  stmt.run("Vanilla", false);
  stmt.run("Chocolate", true);
  stmt.finalize();
});

module.exports = db;
