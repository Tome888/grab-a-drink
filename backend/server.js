const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const routes = require("./routes");
const Database = require("better-sqlite3");
const db = new Database("bar.db");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

app.use("/api", routes);
app.use("/api/menu", require("./routes/getMenu"));
app.use("/images", express.static(path.join(__dirname, "images")));

io.on("connection", (socket) => {

  socket.on("orders", (data) => {
    if (!Array.isArray(data)) return;

    const insertOrder = db.prepare(`
      INSERT INTO orders (table_id, table_name, drink_id, drink_name, drink_price, quantity)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const saveOrders = db.transaction((orders) => {
      return orders.map((item) => {
        insertOrder.run(
          item.tableId,
          item.tableName,
          item.id,
          item.name,
          item.price,
          item.quantity
        );

        const savedOrder = db
          .prepare(
            `
          SELECT * FROM orders WHERE rowid = last_insert_rowid()
        `
          )
          .get();

        return {
          id: savedOrder.id,
          table_id: savedOrder.table_id,
          table_name: savedOrder.table_name,
          drink_id: savedOrder.drink_id,
          drink_name: savedOrder.drink_name,
          drink_price: savedOrder.drink_price,
          quantity: savedOrder.quantity,
          seen: !!savedOrder.seen,
        };
      });
    });

    const savedOrders = saveOrders(data);

    io.emit("orders", savedOrders);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
