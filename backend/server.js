// const express = require("express");
// const mysql = require("mysql2");
// const bcrypt = require("bcryptjs");
// const cors = require("cors");
// const bodyParser = require("body-parser");

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // ✅ MySQL connection
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "optimus", // your MySQL password
//   database: "offers_app",
// });

// db.connect((err) => {
//   if (err) throw err;
//   console.log("✅ MySQL Connected!");
// });

// // 📝 Register API
// app.post("/register", async (req, res) => {
//   console.log('Register request body:', req.body);
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password are required" });
//   }

//   db.query("SELECT * FROM users WHERE username = ?", [email], async (err, result) => {
//     if (err) {
//       console.log('Select error:', err);
//       return res.status(500).json({ error: err.message });
//     }
//     if (result.length > 0) {
//       console.log('User already exists');
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     console.log('Inserting:', email, hashedPassword);
//     db.query(
//       "INSERT INTO users (username, password) VALUES (?, ?)",
//       [email, hashedPassword],
//       (err) => {
//         if (err) {
//           console.log('Insert error:', err);
//           return res.status(500).json({ error: err.message });
//         }
//         console.log('User registered successfully');
//         res.json({ message: "User registered successfully" });
//       }
//     );
//   });
// });

// // 🔐 Login API
// app.post("/login", (req, res) => {
//   console.log('Login request body:', req.body);
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password are required" });
//   }

//   db.query("SELECT * FROM users WHERE username = ?", [email], async (err, result) => {
//     if (err) {
//       console.log('Login select error:', err);
//       return res.status(500).json({ error: err.message });
//     }
//     if (result.length === 0) {
//       console.log('User not found');
//       return res.status(400).json({ message: "User not found" });
//     }

//     const validPass = await bcrypt.compare(password, result[0].password);
//     if (!validPass) {
//       console.log('Invalid password');
//       return res.status(401).json({ message: "Incorrect password" });
//     }

//     console.log('Login successful');
//     res.json({ message: "Login successful" });
//   });
// });

// app.listen(5000, () => console.log("🚀 Backend running at http://localhost:5000"));












require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2');
const cron = require('node-cron');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const { fetchFakeStoreOffers } = require('./scrapers/fakestorescraper');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'optimus',
  database: process.env.DB_NAME || 'offers_app'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ MySQL connected!');
});

// 📝 Register API
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE username = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length > 0)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [email, hashedPassword],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "User registered successfully" });
      }
    );
  });
});

// 🔐 Login API
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE username = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0)
      return res.status(400).json({ message: "User not found" });

    const validPass = await bcrypt.compare(password, result[0].password);
    if (!validPass) return res.status(401).json({ message: "Incorrect password" });

    res.json({ message: "Login successful" });
  });
});

// GET all offers (for initial load)
app.get('/offers', (req, res) => {
  db.query('SELECT * FROM offers ORDER BY created_at DESC LIMIT 50', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Manual trigger (for testing)
app.post('/admin/fetch-now', async (req, res) => {
  try {
    const inserted = await fetchFakeStoreOffers(db, io);
    res.json({ success: true, inserted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cron job: fetch every 5 mins
const cronExpr = process.env.CRON_EXPRESSION || '*/5 * * * *';
cron.schedule(cronExpr, async () => {
  console.log('⏰ Fetching FakeStoreAPI offers...');
  try {
    await fetchFakeStoreOffers(db, io);
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
});

// Socket.IO connection
io.on('connection', socket => {
  console.log('🟢 User connected:', socket.id);
  socket.on('disconnect', () => console.log('🔴 User disconnected:', socket.id));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
