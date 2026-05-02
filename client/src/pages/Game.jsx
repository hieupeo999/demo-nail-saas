import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:10000';

/* ── Timer logic ──────────────────────────────────────
   - timeLimit starts at 5s
   - Every 5 points → timeLimit -= 0.5s (min 3.5s), timer resets
   - When timeLeft hits 0 → game over
──────────────────────────────────────────────────── */

export default function Game() {
  const [phase,     setPhase]     = useState('idle');  // idle | playing | over
  const [score,     setScore]     = useState(0);
  const [timeLeft,  setTimeLeft]  = useState(5.0);
  const [timeLimit, setTimeLimit] = useState(5.0);

  // Refs hold live values inside the interval callback
  const scoreRef     = useRef(0);
  const timeLeftRef  = useRef(5.0);
  const timeLimitRef = useRef(5.0);
  const timerRef     = useRef(null);
  const submittedRef = useRef(false);

  // Cleanup on unmount
  useEffect(() => () => clearInterval(timerRef.current), []);

  /* ── Start / Restart ── */
  function startGame() {
    clearInterval(timerRef.current);
    scoreRef.current     = 0;
    timeLeftRef.current  = 5.0;
    timeLimitRef.current = 5.0;
    submittedRef.current = false;

    setScore(0);
    setTimeLeft(5.0);
    setTimeLimit(5.0);
    setPhase('playing');

    timerRef.current = setInterval(() => {
      timeLeftRef.current = +(timeLeftRef.current - 0.1).toFixed(2);
      setTimeLeft(timeLeftRef.current);

      if (timeLeftRef.current <= 0) {
        clearInterval(timerRef.current);
        setPhase('over');
        submitScore(scoreRef.current);
      }
    }, 100);
  }

  /* ── Tap handler ── */
  function handleTap() {
    if (phase !== 'playing') return;

    scoreRef.current += 1;
    setScore(scoreRef.current);

    // Every 5 points → shrink time limit and reset countdown
    if (scoreRef.current % 5 === 0) {
      const next = Math.max(3.5, +(timeLimitRef.current - 0.5).toFixed(1));
      timeLimitRef.current = next;
      timeLeftRef.current  = next;
      setTimeLimit(next);
      setTimeLeft(next);
    }
  }

  /* ── Submit score to backend ── */
  async function submitScore(finalScore) {
    if (submittedRef.current) return;
    submittedRef.current = true;
    try {
      await fetch(`${API}/play`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ score: finalScore }),
      });
    } catch (err) {
      console.error('Failed to submit score:', err);
    }
  }

  /* ── Timer bar ── */
  const pct       = (timeLeft / timeLimit) * 100;
  const fillColor = pct > 55 ? '#c8a96a' : pct > 28 ? '#f0904a' : '#e85d5d';

  /* ── Render ── */
  return (
    <div className="page">
      <div className="brand" style={{ marginBottom: '1.5rem' }}>
        <h1>NAIL <span>GAME</span></h1>
        <p>Tap as fast as you can!</p>
      </div>

      <div className="card">

        {/* ── IDLE ── */}
        {phase === 'idle' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.8rem', marginBottom: '.75rem' }}>🎮</div>
            <h2 className="card-title">Tap Game</h2>
            <p className="card-sub">
              Bấm vào móng nail nhanh nhất có thể!<br />
              Mỗi 5 điểm → thời gian giảm 0.5s · Tối thiểu 3.5s
            </p>
            <button className="btn btn-gold" onClick={startGame}>▶ Bắt đầu</button>
          </div>
        )}

        {/* ── PLAYING ── */}
        {phase === 'playing' && (
          <div style={{ textAlign: 'center' }}>
            <span className="level-pill">
              Giới hạn: {timeLimit.toFixed(1)}s
            </span>
            <div className="game-score">{score}</div>

            <div className="game-timer-track">
              <div
                className="game-timer-fill"
                style={{ width: `${pct}%`, background: fillColor }}
              />
            </div>
            <p style={{ fontSize: '.7rem', color: 'var(--muted)', marginBottom: '.25rem' }}>
              ⏱ {timeLeft.toFixed(1)}s còn lại
            </p>

            <button className="game-tap-btn" onClick={handleTap} aria-label="Tap">
              💅
            </button>
            <p style={{ fontSize: '.68rem', color: 'var(--muted)' }}>Bấm vào móng nail!</p>
          </div>
        )}

        {/* ── GAME OVER ── */}
        {phase === 'over' && (
          <div className="game-over-wrap">
            <div style={{ fontSize: '2.5rem', marginBottom: '.5rem' }}>🏆</div>
            <h2>Kết quả</h2>
            <div className="game-score">{score}</div>
            <p>điểm của bạn</p>
            <button className="btn btn-gold" style={{ marginTop: '1.5rem' }} onClick={startGame}>
              🔄 Chơi lại
            </button>
          </div>
        )}

        <Link to="/" className="back-link">← Trang chủ</Link>
      </div>
    </div>
  );
}
