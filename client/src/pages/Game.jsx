import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

/* ── Shape helper ── */
function starPts(cx, cy, ro, ri, n = 5) {
  const a = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? ro : ri;
    const ang = (i * Math.PI / n) - Math.PI / 2;
    a.push(`${(cx + r * Math.cos(ang)).toFixed(2)},${(cy + r * Math.sin(ang)).toFixed(2)}`);
  }
  return a.join(' ');
}

/* ── Constants ── */
const SHAPES = [
  {
    id: 'circle', label: 'Tròn',
    nail: '<circle cx="50" cy="50" r="37" fill="rgba(255,255,255,.72)" stroke="rgba(255,255,255,.45)" stroke-width="3"/>',
    btn:  '<circle cx="50" cy="50" r="37" fill="#c8a96a" stroke="#b8934a" stroke-width="3"/>',
  },
  {
    id: 'square', label: 'Vuông',
    nail: '<rect x="14" y="14" width="72" height="72" rx="7" fill="rgba(255,255,255,.72)" stroke="rgba(255,255,255,.45)" stroke-width="3"/>',
    btn:  '<rect x="14" y="14" width="72" height="72" rx="7" fill="#c8a96a" stroke="#b8934a" stroke-width="3"/>',
  },
  {
    id: 'triangle', label: 'Tam giác',
    nail: '<polygon points="50,12 88,86 12,86" fill="rgba(255,255,255,.72)" stroke="rgba(255,255,255,.45)" stroke-width="3" stroke-linejoin="round"/>',
    btn:  '<polygon points="50,12 88,86 12,86" fill="#c8a96a" stroke="#b8934a" stroke-width="3" stroke-linejoin="round"/>',
  },
];
SHAPES.push({
  id: 'star', label: 'Sao',
  nail: `<polygon points="${starPts(50,50,40,17)}" fill="rgba(255,255,255,.72)" stroke="rgba(255,255,255,.45)" stroke-width="2.5" stroke-linejoin="round"/>`,
  btn:  `<polygon points="${starPts(50,50,40,17)}" fill="#c8a96a" stroke="#b8934a" stroke-width="2.5" stroke-linejoin="round"/>`,
});

const COLORS = [
  { id: 'pink',    hex: '#FFB3C6', name: 'Hồng nhạt' },
  { id: 'hotpink', hex: '#FF6B9D', name: 'Hồng đậm'  },
  { id: 'nude',    hex: '#DDBA9C', name: 'Nude'       },
  { id: 'white',   hex: '#F5F0EC', name: 'Trắng kem'  },
  { id: 'black',   hex: '#2C2320', name: 'Đen'        },
];

const ACCS_L2 = [
  { id: 'diamond', icon: '💎', label: 'Đá kim cương' },
  { id: 'glitter', icon: '✨', label: 'Glitter'       },
];
const ACCS_L3 = [
  { id: 'gel',      icon: '🌟', label: 'Gel shine'  },
  { id: 'french',   icon: '🤍', label: 'French tip' },
  { id: 'gradient', icon: '🌈', label: 'Gradient'   },
];

const LS_KEY  = 'tl_nailgame_lb';
const MEM_SECS = 5;

/* ── Helpers ── */
function rand(n) { return Math.floor(Math.random() * n); }

function lighten(hex, amt) {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgb(${Math.min(255,(n>>16)+amt)},${Math.min(255,((n>>8)&0xff)+amt)},${Math.min(255,(n&0xff)+amt)})`;
}

function loadLB() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
}
function saveLB(a) { localStorage.setItem(LS_KEY, JSON.stringify(a)); }
function recordScore(name, score) {
  let lb = loadLB();
  lb.push({ name, score });
  lb.sort((a, b) => b.score - a.score);
  lb = lb.slice(0, 10);
  saveLB(lb);
  return lb;
}
function getPersonalBest(name) {
  const m = loadLB().filter(e => e.name === name);
  return m.length ? Math.max(...m.map(e => e.score)) : 0;
}

/* ── Nail component ── */
function NailView({ cfg }) {
  if (!cfg || !cfg.colorHex) {
    return (
      <div className="nail" style={{ background: '#ddd5ce' }}>
        <div className="nail-ph">?</div>
      </div>
    );
  }
  const bg = cfg.gradient && cfg.gradHex2
    ? `linear-gradient(to bottom,${cfg.gradHex2},${cfg.colorHex})`
    : cfg.colorHex;
  const cls = ['nail', cfg.glitter && 'has-glitter', cfg.gel && 'has-gel'].filter(Boolean).join(' ');
  const sh = cfg.shapeId ? SHAPES.find(s => s.id === cfg.shapeId) : null;
  return (
    <div className={cls} style={{ background: bg }}>
      {cfg.french  && <div className="nail-french" />}
      {sh && (
        <svg
          className="nail-shape"
          viewBox="0 0 100 100"
          dangerouslySetInnerHTML={{ __html: sh.nail }}
        />
      )}
      {cfg.diamond && <div className="nail-gem">💎</div>}
    </div>
  );
}

/* ── Leaderboard rows ── */
function LbRows({ rows, myName }) {
  if (!rows.length) {
    return (
      <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '1.5rem 0' }}>
        Chưa có ai chơi
      </p>
    );
  }
  return rows.map((r, i) => (
    <div key={i} className={`lb-row${r.name === myName ? ' hi' : ''}`}>
      <div className={`lb-rank${i < 3 ? ' top' : ''}`}>
        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
      </div>
      <div className={`lb-name${r.name === myName ? ' me' : ''}`}>{r.name}</div>
      <div className="lb-pts">{r.score}</div>
    </div>
  ));
}

/* ── Main Game component ── */
export default function Game() {
  const [phase,       setPhase]       = useState('start');
  const [playerName,  setPlayerName]  = useState('');
  const [score,       setScore]       = useState(0);
  const [combo,       setCombo]       = useState(0);
  const [timeLeft,    setTimeLeft]    = useState(12);
  const [timeLimit,   setTimeLimit]   = useState(12);
  const [memCd,       setMemCd]       = useState(MEM_SECS);
  const [target,      setTarget]      = useState(null);
  const [player,      setPlayer]      = useState({
    colorId: null, shapeId: null,
    diamond: false, glitter: false, gel: false, french: false, gradient: false,
  });
  const [flash,       setFlash]       = useState('');
  const [showCombo,   setShowCombo]   = useState(false);
  const [leaderboard, setLeaderboard] = useState(loadLB());

  const scoreRef     = useRef(0);
  const comboRef     = useRef(0);
  const timeLimitRef = useRef(12);
  const timeLeftRef  = useRef(12);
  const memTimerRef  = useRef(null);
  const gameTimerRef = useRef(null);
  const nameRef      = useRef('');

  // Cleanup on unmount
  useEffect(() => () => {
    clearInterval(memTimerRef.current);
    clearInterval(gameTimerRef.current);
  }, []);

  /* ── Level helper ── */
  function getLevel(sc) {
    return sc >= 50 ? 3 : sc >= 20 ? 2 : 1;
  }

  /* ── Build cfg from target ── */
  function targetCfgFrom(t) {
    if (!t) return null;
    const col = COLORS.find(c => c.id === t.colorId);
    const gradCol = t.gradient ? COLORS[rand(COLORS.length)] : null;
    return {
      colorHex: col ? col.hex : '#ddd5ce',
      shapeId:  t.shapeId,
      gradient: t.gradient,
      gradHex2: gradCol ? lighten(gradCol.hex, 60) : null,
      french:   t.french,
      gel:      t.gel,
      glitter:  t.glitter,
      diamond:  t.diamond,
    };
  }

  /* ── Build cfg from player ── */
  function playerCfgFrom(p) {
    const col = COLORS.find(c => c.id === p.colorId);
    const gradCol = p.gradient ? { hex: '#ffffff' } : null;
    return {
      colorHex: col ? col.hex : null,
      shapeId:  p.shapeId,
      gradient: p.gradient,
      gradHex2: gradCol ? 'rgba(255,255,255,.5)' : null,
      french:   p.french,
      gel:      p.gel,
      glitter:  p.glitter,
      diamond:  p.diamond,
    };
  }

  /* ── Generate a random target ── */
  function makeTarget(sc) {
    const lv  = getLevel(sc);
    const col = COLORS[rand(COLORS.length)];
    const sh  = SHAPES[rand(SHAPES.length)];
    return {
      colorId:  col.id,
      shapeId:  sh.id,
      diamond:  lv >= 2 ? Math.random() < 0.5 : false,
      glitter:  lv >= 2 ? Math.random() < 0.5 : false,
      gel:      lv >= 3 ? Math.random() < 0.5 : false,
      french:   lv >= 3 ? Math.random() < 0.5 : false,
      gradient: lv >= 3 ? Math.random() < 0.4 : false,
    };
  }

  /* ── Flash helper ── */
  function doFlash(color) {
    setFlash(color);
    setTimeout(() => setFlash(''), 320);
  }

  /* ── Combo toast ── */
  function showComboToast() {
    setShowCombo(true);
    setTimeout(() => setShowCombo(false), 1000);
  }

  /* ── Trigger game over ── */
  const triggerOver = useCallback((reason) => {
    clearInterval(memTimerRef.current);
    clearInterval(gameTimerRef.current);
    const name = nameRef.current;
    const sc   = scoreRef.current;
    const lb   = recordScore(name, sc);
    setLeaderboard(lb);
    setPhase('over');
  }, []);

  /* ── Start rec phase ── */
  const startRec = useCallback(() => {
    clearInterval(gameTimerRef.current);
    const sc    = scoreRef.current;
    const limit = Math.max(3, +(12 - Math.floor(sc / 5) * 0.5).toFixed(1));
    timeLimitRef.current = limit;
    timeLeftRef.current  = limit;
    setTimeLimit(limit);
    setTimeLeft(limit);
    setPlayer({ colorId: null, shapeId: null, diamond: false, glitter: false, gel: false, french: false, gradient: false });
    setPhase('rec');

    gameTimerRef.current = setInterval(() => {
      timeLeftRef.current = +(timeLeftRef.current - 0.1).toFixed(1);
      setTimeLeft(timeLeftRef.current);
      if (timeLeftRef.current <= 0) {
        clearInterval(gameTimerRef.current);
        doFlash('red');
        triggerOver('time');
      }
    }, 100);
  }, [triggerOver]);

  /* ── Start mem phase / next round ── */
  const nextRound = useCallback(() => {
    clearInterval(memTimerRef.current);
    clearInterval(gameTimerRef.current);
    const t = makeTarget(scoreRef.current);
    setTarget(t);
    setMemCd(MEM_SECS);
    setPhase('mem');
    let cd = MEM_SECS;
    memTimerRef.current = setInterval(() => {
      cd -= 1;
      setMemCd(cd);
      if (cd <= 0) {
        clearInterval(memTimerRef.current);
        startRec();
      }
    }, 1000);
  }, [startRec]);

  /* ── Start game ── */
  function startGame() {
    clearInterval(memTimerRef.current);
    clearInterval(gameTimerRef.current);
    scoreRef.current = 0;
    comboRef.current = 0;
    setScore(0);
    setCombo(0);
    setPhase('start');
    setTimeout(() => nextRound(), 0);
  }

  /* ── Confirm answer ── */
  function confirmAnswer() {
    if (!target) return;
    const lv = getLevel(scoreRef.current);
    const ok =
      player.colorId === target.colorId &&
      player.shapeId === target.shapeId &&
      (lv < 2 || (player.diamond === target.diamond && player.glitter === target.glitter)) &&
      (lv < 3 || (player.gel === target.gel && player.french === target.french && player.gradient === target.gradient));

    if (ok) {
      doFlash('green');
      clearInterval(gameTimerRef.current);
      scoreRef.current += 1;
      comboRef.current += 1;
      setScore(scoreRef.current);
      setCombo(comboRef.current);
      if (comboRef.current > 0 && comboRef.current % 5 === 0) {
        showComboToast();
      }
      nextRound();
    } else {
      doFlash('red');
      comboRef.current = 0;
      setCombo(0);
      triggerOver('wrong');
    }
  }

  /* ── Toggle player accessor ── */
  function toggleAcc(key) {
    setPlayer(prev => ({ ...prev, [key]: !prev[key] }));
  }

  /* ── Render ── */
  const lv       = getLevel(score);
  const pct      = timeLimit > 0 ? (timeLeft / timeLimit) * 100 : 0;
  const fillColor = pct > 55 ? '#c8a96a' : pct > 28 ? '#f0904a' : '#e85d5d';
  const best      = getPersonalBest(nameRef.current || playerName);

  const lvLabels = ['', 'Cơ bản – Màu + Hình', 'Nâng cao – thêm Phụ kiện', 'Chuyên gia – Gel / French / Gradient'];
  const lvIcons  = ['', '🎀', '💎', '🌟'];

  /* Fake difficulty: swap pink/hotpink display at lv3 */
  function displayColors() {
    if (lv < 3 || !target || (target.colorId !== 'pink' && target.colorId !== 'hotpink')) {
      return COLORS;
    }
    return COLORS.map(c => {
      if (c.id === 'pink')    return { ...c, hex: '#FF6B9D' };
      if (c.id === 'hotpink') return { ...c, hex: '#FFB3C6' };
      return c;
    });
  }

  return (
    <>
      {/* Flash overlay */}
      <div
        id="flash"
        className={flash ? `${flash} on` : ''}
      />
      {/* Combo toast */}
      <div id="comboToast" className={showCombo ? 'show' : ''}>
        ✨ COMBO +0.5s
      </div>

      <div className="game-page">
        {/* Brand */}
        <div className="brand">
          <h1>THUY <span>LINH</span></h1>
          <p>Nail Memory Game</p>
        </div>

        {/* ── START SCREEN ── */}
        {phase === 'start' && (
          <div className="card">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '.5rem' }}>💅</div>
              <h2 className="card-title">Nail Memory Game</h2>
              <p className="card-sub">
                Ghi nhớ mẫu nail rồi tái tạo lại<br />
                nhanh nhất có thể để ghi điểm!
              </p>
            </div>
            <div className="field">
              <label>Tên của bạn</label>
              <input
                type="text"
                placeholder="Nhập tên..."
                value={playerName}
                onChange={e => {
                  setPlayerName(e.target.value);
                  nameRef.current = e.target.value;
                }}
              />
            </div>
            <button
              className="btn btn-gold"
              onClick={() => {
                if (!playerName.trim()) return;
                nameRef.current = playerName.trim();
                startGame();
              }}
              disabled={!playerName.trim()}
            >
              🎮 Bắt Đầu Chơi
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => setPhase('lb')}
              style={{ marginTop: '.5rem' }}
            >
              🏆 Bảng Xếp Hạng
            </button>
            <Link to="/" className="back-link">← Trang chủ</Link>

            {leaderboard.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <div className="divider"><span>Top 3</span></div>
                {leaderboard.slice(0, 3).map((r, i) => (
                  <div key={i} className="lb-row">
                    <div className="lb-rank top">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</div>
                    <div className="lb-name">{r.name}</div>
                    <div className="lb-pts">{r.score}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MEM PHASE ── */}
        {phase === 'mem' && (
          <div style={{ width: '100%', maxWidth: '440px' }}>
            <div className="game-meta">
              <div className="meta-box">
                <span className="meta-label">Điểm</span>
                <div className="meta-val g">{score}</div>
              </div>
              <div className="meta-box">
                <span className="meta-label">Kỷ lục</span>
                <div className="meta-val">{best}</div>
              </div>
              <div className="meta-box">
                <span className="meta-label">Cấp độ</span>
                <div className="meta-val">{lv}</div>
              </div>
              <div className="meta-box">
                <span className="meta-label">Combo</span>
                <div className="meta-val g">{combo}</div>
              </div>
            </div>

            <div className="card">
              <p style={{ textAlign: 'center', fontSize: '.62rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1rem' }}>
                GHI NHỚ MẪU NAIL NÀY
              </p>
              <div className="nail-showcase">
                <NailView cfg={targetCfgFrom(target)} />
              </div>
              <div className="mem-cd">{memCd}</div>
              <p style={{ textAlign: 'center', fontSize: '.72rem', color: 'var(--muted)', marginTop: '.25rem' }}>
                giây để ghi nhớ...
              </p>
            </div>
          </div>
        )}

        {/* ── REC PHASE ── */}
        {phase === 'rec' && (
          <div style={{ width: '100%', maxWidth: '440px' }}>
            <div className="game-meta">
              <div className="meta-box">
                <span className="meta-label">Điểm</span>
                <div className="meta-val g">{score}</div>
              </div>
              <div className="meta-box">
                <span className="meta-label">Kỷ lục</span>
                <div className="meta-val">{best}</div>
              </div>
              <div className="meta-box">
                <span className="meta-label">Cấp độ</span>
                <div className="meta-val">{lv}</div>
              </div>
              <div className="meta-box">
                <span className="meta-label">Combo</span>
                <div className="meta-val g">{combo}</div>
              </div>
            </div>

            <div className="card">
              {/* Timer */}
              <div className="timer-track" style={{ marginBottom: '.4rem' }}>
                <div
                  className="timer-fill"
                  style={{ width: `${pct}%`, background: fillColor }}
                />
              </div>
              <p style={{ fontSize: '.65rem', color: 'var(--muted)', textAlign: 'right', marginBottom: '1rem' }}>
                ⏱ {timeLeft.toFixed(1)}s
              </p>

              {/* Level banner */}
              <div className="lv-banner">
                <div className="lv-banner-icon">{lvIcons[lv]}</div>
                <div>
                  <div className="lv-banner-title">Cấp {lv}</div>
                  <div className="lv-banner-desc">{lvLabels[lv]}</div>
                </div>
              </div>

              {/* Player preview */}
              <div className="preview-wrap">
                <NailView cfg={playerCfgFrom(player)} />
                <div className="preview-label">Bản tái tạo của bạn</div>
              </div>

              {/* Color grid */}
              <span className="section-label">Màu sắc</span>
              <div className="color-grid" style={{ marginBottom: '1rem' }}>
                {displayColors().map(c => (
                  <div
                    key={c.id}
                    className={`csw${player.colorId === c.id ? ' active' : ''}`}
                    style={{ background: c.hex }}
                    title={c.name}
                    onClick={() => setPlayer(prev => ({ ...prev, colorId: c.id }))}
                  />
                ))}
              </div>

              {/* Shape grid */}
              <span className="section-label">Hình dạng</span>
              <div className="shape-grid" style={{ marginBottom: '1rem' }}>
                {SHAPES.map(sh => (
                  <button
                    key={sh.id}
                    className={`shbtn${player.shapeId === sh.id ? ' active' : ''}`}
                    onClick={() => setPlayer(prev => ({ ...prev, shapeId: sh.id }))}
                  >
                    <svg viewBox="0 0 100 100" style={{ width: 28, height: 28 }} dangerouslySetInnerHTML={{ __html: sh.btn }} />
                    <span className="shbtn-label">{sh.label}</span>
                  </button>
                ))}
              </div>

              {/* Accessories – Level 2+ */}
              {lv >= 2 && (
                <>
                  <span className="section-label">Phụ kiện</span>
                  <div className="acc-grid" style={{ marginBottom: '1rem' }}>
                    {ACCS_L2.map(a => (
                      <button
                        key={a.id}
                        className={`accbtn${player[a.id] ? ' active' : ''}`}
                        onClick={() => toggleAcc(a.id)}
                      >
                        {a.icon} {a.label}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Extra accessories – Level 3 */}
              {lv >= 3 && (
                <>
                  <span className="section-label">Hiệu ứng nâng cao</span>
                  <div className="acc-grid" style={{ marginBottom: '1rem' }}>
                    {ACCS_L3.map(a => (
                      <button
                        key={a.id}
                        className={`accbtn${player[a.id] ? ' active' : ''}`}
                        onClick={() => toggleAcc(a.id)}
                      >
                        {a.icon} {a.label}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <button
                className="btn btn-gold"
                onClick={confirmAnswer}
                disabled={!player.colorId || !player.shapeId}
              >
                ✅ Xác Nhận
              </button>
            </div>
          </div>
        )}

        {/* ── GAME OVER ── */}
        {phase === 'over' && (
          <div style={{ width: '100%', maxWidth: '440px' }}>
            <div className="card">
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '.5rem' }}>🏆</div>
                <h2 className="card-title">Kết Thúc!</h2>
                <p className="card-sub">Điểm số của bạn</p>
                <div className="over-pts">{score}</div>
                <p style={{ fontSize: '.72rem', color: 'var(--muted)', marginTop: '.5rem' }}>
                  Kỷ lục cá nhân: <strong>{Math.max(score, best)}</strong>
                </p>
              </div>

              <div className="divider"><span>Bảng xếp hạng</span></div>
              <div style={{ marginTop: '.75rem', marginBottom: '1.25rem' }}>
                <LbRows rows={leaderboard} myName={nameRef.current} />
              </div>

              <button className="btn btn-gold" onClick={startGame}>
                🔄 Chơi Lại
              </button>
              <Link to="/" className="btn btn-ghost" style={{ marginTop: '.5rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                ← Trang Chủ
              </Link>
            </div>
          </div>
        )}

        {/* ── LEADERBOARD ── */}
        {phase === 'lb' && (
          <div style={{ width: '100%', maxWidth: '440px' }}>
            <div className="card">
              <h2 className="card-title" style={{ marginBottom: '1.5rem' }}>🏆 Bảng Xếp Hạng</h2>
              <LbRows rows={leaderboard} myName={nameRef.current} />
              <button
                className="btn btn-ghost"
                style={{ marginTop: '1.5rem' }}
                onClick={() => setPhase('start')}
              >
                ← Quay lại
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
