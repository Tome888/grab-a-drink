const Database = require("better-sqlite3");
const db = new Database("bar.db");

const initUserTable = () => {
    //THE USER CREDS SHOULD BE ECRYPTED BUT FOR SIMPLICITY REASONS I WILL KEEP THEM AS PLAIN TEXT
  db.prepare(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `).run();

  const admin = db.prepare("SELECT * FROM user WHERE username = ?").get("Admin123");

  if (!admin) {
    db.prepare("INSERT INTO user (username, password) VALUES (?, ?)").run(
      "Admin123",
      "Password123"
    );
    console.log("✅ Default admin user created: Admin123 / Password123");
  }
};

initUserTable();

module.exports = db;
