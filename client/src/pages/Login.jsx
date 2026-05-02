import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const NAIL_PATCHES = [
  { bg: 'linear-gradient(135deg,#FFB3C6,#FF6B9D)' },
  { bg: 'linear-gradient(135deg,#DDBA9C,#F5F0EC)' },
  { bg: 'linear-gradient(135deg,#c8a96a,#b8934a)' },
  { bg: 'linear-gradient(135deg,#9B59B6,#6C3483)' },
];

export default function Login() {
  const [form,  setForm]  = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function update(key, val) {
    setForm(prev => ({ ...prev, [key]: val }));
    setError('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (form.username === 'admin' && form.password === '123456') {
      localStorage.setItem('nail_admin', '1');
      navigate('/dashboard');
    } else {
      setError('Sai tên đăng nhập hoặc mật khẩu.');
    }
  }

  function quickLogin() {
    localStorage.setItem('nail_admin', '1');
    navigate('/dashboard');
  }

  return (
    <div className="ln-page">
      {/* Left panel */}
      <div className="ln-left">
        <div className="ln-left-top">
          <div className="ln-left-bar" />
          <div className="ln-left-brand">THUY <span>LINH</span></div>
          <div className="ln-left-sub">Nail Studio · Bắc Ninh</div>
          <p className="ln-left-welcome">
            Chào mừng trở lại.<br />
            Đăng nhập để quản lý studio nail của bạn.
          </p>
        </div>

        <div className="ln-left-bottom">
          <div className="ln-left-addr">
            📍 52 Lê Văn Thịnh · Bắc Ninh<br />
            📞 0839 056 090<br />
            🕐 8:00 – 20:00 hàng ngày
          </div>
          <div className="ln-left-nails">
            {NAIL_PATCHES.map((p, i) => (
              <div key={i} className="ln-left-nail" style={{ background: p.bg }} />
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="ln-right">
        {/* Top bar */}
        <div className="ln-right-top">
          <div className="ln-right-logo">THUY <span>LINH</span></div>
          <Link to="/" className="ln-right-home">← Trang chủ</Link>
        </div>

        {/* Form */}
        <div className="ln-form-box">
          <div className="ln-form-inner">
            <h1 className="ln-form-title">Đăng nhập</h1>
            <p className="ln-form-sub">Dành cho quản trị viên studio</p>
            <div className="ln-form-bar" />

            {error && (
              <div className="alert alert-red">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="username">Tên đăng nhập</label>
                <input
                  id="username"
                  type="text"
                  placeholder="admin"
                  value={form.username}
                  onChange={e => update('username', e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="password">Mật khẩu</label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••"
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
              <button type="submit" className="btn-submit">
                🔑 Đăng Nhập
              </button>
            </form>

            <div className="divider" style={{ margin: '1.5rem 0 1rem' }}>
              <span>ĐĂNG NHẬP NHANH</span>
            </div>

            <div className="ln-quick-btns">
              <button className="ln-quick-btn" onClick={quickLogin}>
                <div className="ln-quick-icon" style={{ background: 'rgba(200,169,106,.12)' }}>👑</div>
                <div className="ln-quick-info">
                  <div className="ln-quick-name">Admin</div>
                  <div className="ln-quick-role">Quản trị viên · Toàn quyền</div>
                </div>
              </button>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <Link to="/" className="back-link">← Về trang chủ</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
