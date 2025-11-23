const Database = require("better-sqlite3");
const db = new Database("bar.db");

const DEFAULT_USERNAME = "Admin123";
const DEFAULT_PASSWORD = "Password123";

const DEFAULT_LAT = 41.9981;
const DEFAULT_LON = 21.4254;
const DEFAULT_RADIUS = 10000;

const resetUsers = db.transaction(() => {
  db.prepare(
    "INSERT INTO user (username, password, lat, lon, radius) VALUES (?, ?, ?, ?, ?)"
  ).run(
    DEFAULT_USERNAME,
    DEFAULT_PASSWORD,
    DEFAULT_LAT,
    DEFAULT_LON,
    DEFAULT_RADIUS
  );
});

const initUserTable = () => {
  db.prepare(`DROP TABLE IF EXISTS user`).run();

  db.prepare(
    `
    CREATE TABLE user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      lat REAL DEFAULT ${DEFAULT_LAT},
      lon REAL DEFAULT ${DEFAULT_LON},
      radius REAL DEFAULT ${DEFAULT_RADIUS}
    )
  `
  ).run();

  resetUsers();
  console.log(
    "👍 User table initialized with default admin and location columns."
  );
};

const DEFAULT_TABLES = Array.from({ length: 10 }, (_, i) => ({
  name: `Table ${i + 1}`,
}));

const resetTables = db.transaction(() => {
  const insert = db.prepare("INSERT INTO tables (name) VALUES (?)");
  DEFAULT_TABLES.forEach((t) => insert.run(t.name));
});

const initTablesTable = () => {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS tables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
  )`
  ).run();

  const existing = db.prepare("SELECT COUNT(*) AS count FROM tables").get();
  if (existing.count === 0) {
    resetTables();
    console.log("👍 Tables table initialized with 10 default tables.");
  } else {
    console.log("ℹ️ Tables table already has entries.");
  }
};

const DEFAULT_MENU = [
  { name: "Mojito", price: 8, img_path: "/images/mojito.jpg" },
  { name: "Margarita", price: 9, img_path: "/images/margarita.jpg" },
  { name: "Cosmopolitan", price: 10, img_path: "/images/cosmopolitan.jpg" },
  { name: "Old Fashioned", price: 12, img_path: "/images/old_fashioned.jpg" },
  { name: "Martini", price: 11, img_path: "/images/martini.jpg" },
  { name: "Daiquiri", price: 8, img_path: "/images/daiquiri.jpg" },
  { name: "Negroni", price: 10, img_path: "/images/negroni.jpg" },
  { name: "Whiskey Sour", price: 9, img_path: "/images/whiskey_sour.jpg" },
  { name: "Pina Colada", price: 9, img_path: "/images/pina_colada.jpg" },
  { name: "Mai Tai", price: 10, img_path: "/images/mai_tai.jpg" },
  { name: "Tom Collins", price: 8, img_path: "/images/tom_collins.jpg" },
  { name: "Caipirinha", price: 9, img_path: "/images/caipirinha.jpg" },
  {
    name: "Long Island Iced Tea",
    price: 12,
    img_path: "/images/long_island.jpg",
  },
  { name: "Bloody Mary", price: 8, img_path: "/images/bloody_mary.jpg" },
  {
    name: "Sex on the Beach",
    price: 10,
    img_path: "/images/sex_on_the_beach.jpg",
  },
];

const resetMenu = db.transaction(() => {
  const insert = db.prepare(
    "INSERT INTO menu (name, price, img_path) VALUES (?, ?, ?)"
  );
  DEFAULT_MENU.forEach((item) =>
    insert.run(item.name, item.price, item.img_path)
  );
});

const initMenuTable = () => {
  db.prepare(`DROP TABLE IF EXISTS menu`).run();

  db.prepare(
    `CREATE TABLE menu (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price REAL,
    img_path TEXT
  )`
  ).run();

  resetMenu();
  console.log("🍹 Menu table initialized with 15 default cocktails.");
};


// const resetOrders = db.transaction(() => {
// });

const initOrdersTable = () => {
  db.prepare(`DROP TABLE IF EXISTS orders`).run();

  db.prepare(
    `
    CREATE TABLE orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      table_id INTEGER,
      drink_id INTEGER,
      drink_name TEXT,
      drink_price REAL
    )
  `
  ).run();

  resetOrders();
  console.log("🧾 Orders table initialized and reset.");
};

initUserTable();
initTablesTable();
initMenuTable();
initOrdersTable();

module.exports = db;
