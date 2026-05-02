const express = require('express');
const cors    = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 10000;

/* ── Middleware ── */
app.use(cors());
app.use(express.json());

/* ── Database ── */
const db = new sqlite3.Database(path.join(__dirname, 'data.db'));

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS stats (
      id         INTEGER PRIMARY KEY,
      totalPlays INTEGER DEFAULT 0,
      bestScore  INTEGER DEFAULT 0
    )
  `);
  db.run(`
    INSERT OR IGNORE INTO stats (id, totalPlays, bestScore) VALUES (1, 0, 0)
  `);
});

/* ── Routes ── */

// Health check
app.get('/', (_req, res) => {
  res.json({ ok: true, message: 'Nail SaaS API running' });
});

// POST /login
app.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === 'admin' && password === '123456') {
    return res.json({ ok: true });
  }
  res.status(401).json({ ok: false, error: 'Invalid credentials' });
});

// GET /stats
app.get('/stats', (_req, res) => {
  db.get('SELECT totalPlays, bestScore FROM stats WHERE id = 1', (err, row) => {
    if (err) return res.status(500).json({ ok: false, error: err.message });
    res.json(row);
  });
});

// POST /play — record a game score
app.post('/play', (req, res) => {
  const score = Number(req.body?.score);
  if (isNaN(score) || score < 0) {
    return res.status(400).json({ ok: false, error: 'Invalid score' });
  }
  db.run(`
    UPDATE stats
    SET totalPlays = totalPlays + 1,
        bestScore  = CASE WHEN ? > bestScore THEN ? ELSE bestScore END
    WHERE id = 1
  `, [score, score], (err) => {
    if (err) return res.status(500).json({ ok: false, error: err.message });
    res.json({ ok: true });
  });
});

// POST /reset — clear all stats
app.post('/reset', (_req, res) => {
  db.run('UPDATE stats SET totalPlays = 0, bestScore = 0 WHERE id = 1', (err) => {
    if (err) return res.status(500).json({ ok: false, error: err.message });
    res.json({ ok: true });
  });
});

/* ── Start ── */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
