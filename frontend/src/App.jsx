import { lazy, Suspense } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import BackendStatus from './components/BackendStatus.jsx';

const Game = lazy(() => import('./pages/Game.jsx'));
const Review = lazy(() => import('./pages/Review.jsx'));
const Leaderboard = lazy(() => import('./pages/Leaderboard.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Maps = lazy(() => import('./pages/Maps.jsx'));
export default function App() {
  const location = useLocation();
  return <div className={`app-shell ${location.pathname === '/game' ? 'in-game' : ''}`}>
    <header className="header"><Link to="/" className="brand" aria-label="HisRun — Trang chủ"><span className="brand-mark">H<span>↗</span></span><span>HIS<span className="brand-run">RUN</span><small>CHẠY ĐỂ KHÁM PHÁ</small></span></Link><nav aria-label="Điều hướng chính"><NavLink to="/maps">Hành trình</NavLink><NavLink to="/leaderboard">Xếp hạng</NavLink><NavLink to="/review">Ôn tập</NavLink><NavLink className="nav-profile" to="/profile">Hồ sơ</NavLink></nav></header>
    <main><Suspense fallback={<div className="loading" role="status">Đang chuẩn bị hành trình…</div>}><Routes><Route path="/" element={<Home />} /><Route path="/game" element={<Game />} /><Route path="/maps" element={<Maps />} /><Route path="/review" element={<Review />} /><Route path="/leaderboard" element={<Leaderboard />} /><Route path="/profile" element={<Profile />} /><Route path="*" element={<div className="not-found"><h1>Bạn đã đi lạc một chút.</h1><Link className="primary-button" to="/">Về trang chủ ↗</Link></div>} /></Routes></Suspense></main>
    <footer><span>© {new Date().getFullYear()} HISRUN <i>•</i> Mỗi bước chạy, một điều mới.</span>{import.meta.env.DEV && <BackendStatus />}<span>Được tạo nên cho những tâm hồn khám phá <span className="footer-star">✦</span></span></footer>
  </div>;
}

