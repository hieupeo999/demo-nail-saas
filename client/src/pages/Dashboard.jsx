import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:10000';

export default function Dashboard() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg,     setMsg]     = useState({ text: '', type: '' });
  const navigate = useNavigate();

  /* ── Auth guard ── */
  useEffect(() => {
    if (!localStorage.getItem('nail_admin')) {
      navigate('/login');
      return;
    }
    fetchStats();
  }, []);

  /* ── Fetch stats ── */
  async function fetchStats() {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/stats`);
      const data = await res.json();
      setStats(data);
    } catch {
      setMsg({ text: 'Không thể kết nối server.', type: 'red' });
    } finally {
      setLoading(false);
    }
  }

  /* ── Reset ── */
  async function handleReset() {
    if (!window.confirm('Reset toàn bộ dữ liệu thống kê?')) return;
    try {
      await fetch(`${API}/reset`, { method: 'POST' });
      setMsg({ text: 'Đã reset dữ liệu thành công!', type: 'green' });
      fetchStats();
    } catch {
      setMsg({ text: 'Reset thất bại. Kiểm tra server.', type: 'red' });
    }
  }

  /* ── Logout ── */
  function logout() {
    localStorage.removeItem('nail_admin');
    navigate('/login');
  }

  return (
    <div className="page">
      <div className="brand">
        <h1>NAIL <span>ADMIN</span></h1>
        <p>Beauty Studio · Dashboard</p>
      </div>

      <div className="card">
        <h2 className="card-title">Thống kê</h2>

        {msg.text && (
          <div className={`alert alert-${msg.text.includes('thành công') ? 'green' : 'red'}`}>
            {msg.text}
          </div>
        )}

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem 0', fontSize: '.85rem' }}>
            Đang tải...
          </p>
        ) : stats ? (
          <div style={{ margin: '1.25rem 0' }}>
            <div className="stat-row">
              <span className="stat-label">Tổng lượt chơi</span>
              <span className="stat-value">{stats.totalPlays}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Điểm cao nhất</span>
              <span className="stat-value">{stats.bestScore}</span>
            </div>
          </div>
        ) : null}

        <button className="btn btn-dark" onClick={fetchStats}>
          🔄 Làm mới
        </button>
        <button className="btn btn-red" onClick={handleReset}>
          🗑 Reset dữ liệu
        </button>
        <button className="btn btn-ghost" onClick={logout}>
          🚪 Đăng xuất
        </button>

        <Link to="/" className="back-link">← Trang chủ</Link>
      </div>
    </div>
  );
}
