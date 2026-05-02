import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="page">
      <div className="brand">
        <h1>NAIL <span>SERVICE</span></h1>
        <p>Beauty Studio · Demo</p>
      </div>

      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💅</div>
        <h2 className="card-title">Nail Service Demo</h2>
        <p className="card-sub">
          Mini game đặc sắc và bảng quản trị điểm số.<br />
          Khám phá ngay!
        </p>

        <Link to="/game" className="btn btn-gold">
          🎮 Play Game
        </Link>

        <div className="divider"><span>hoặc</span></div>

        <Link to="/login" className="btn btn-ghost">
          🔑 Admin Login
        </Link>
      </div>

      <p style={{ marginTop: '1.5rem', fontSize: '.62rem', color: 'var(--muted)', letterSpacing: '.1em' }}>
        52 Lê Văn Thịnh · Bắc Ninh · 0839 056 090
      </p>
    </div>
  );
}
