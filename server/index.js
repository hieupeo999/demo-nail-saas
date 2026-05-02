const express = require('express');
const cors    = require('cors');
const Database = require('better-sqlite3');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 10000;

/* ── Middleware ── */
app.use(cors());
app.use(express.json());

/* ── Database ── */
const db = new Database(path.join(__dirname, 'data.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS stats (
    id         INTEGER PRIMARY KEY,
    totalPlays INTEGER DEFAULT 0,
    bestScore  INTEGER DEFAULT 0
  )
`);

// Seed initial row
const seeded = db.prepare('SELECT id FROM stats WHERE id = 1').get();
if (!seeded) {
  db.prepare('INSERT INTO stats (id, totalPlays, bestScore) VALUES (1, 0, 0)').run();
}

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
  const row = db.prepare('SELECT totalPlays, bestScore FROM stats WHERE id = 1').get();
  res.json(row);
});

// POST /play  — record a game score
app.post('/play', (req, res) => {
  const score = Number(req.body?.score);
  if (isNaN(score) || score < 0) {
    return res.status(400).json({ ok: false, error: 'Invalid score' });
  }
  db.prepare(`
    UPDATE stats
    SET totalPlays = totalPlays + 1,
        bestScore  = CASE WHEN ? > bestScore THEN ? ELSE bestScore END
    WHERE id = 1
  `).run(score, score);
  res.json({ ok: true });
});

// POST /reset  — clear all stats
app.post('/reset', (_req, res) => {
  db.prepare('UPDATE stats SET totalPlays = 0, bestScore = 0 WHERE id = 1').run();
  res.json({ ok: true });
});

/* ── Start ── */
app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
