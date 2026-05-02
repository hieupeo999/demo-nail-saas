import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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

  return (
    <div className="page">
      <div className="brand">
        <h1>NAIL <span>ADMIN</span></h1>
        <p>Beauty Studio · Dashboard</p>
      </div>

      <div className="card">
        <h2 className="card-title">Đăng nhập</h2>
        <p className="card-sub">Dành cho quản trị viên</p>

        {error && <div className="alert alert-red">{error}</div>}

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
          <button type="submit" className="btn btn-gold" style={{ marginTop: '.5rem' }}>
            🔑 Đăng nhập
          </button>
        </form>

        <Link to="/" className="back-link">← Trang chủ</Link>
      </div>
    </div>
  );
}
