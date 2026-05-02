import { Routes, Route } from 'react-router-dom';
import Home      from './pages/Home';
import Game      from './pages/Game';
import Login     from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/"          element={<Home />} />
      <Route path="/game"      element={<Game />} />
      <Route path="/login"     element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
