import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Settings from './components/Settings.jsx';
import BackendStatus from './components/BackendStatus.jsx';

import { audioManager } from './game/systems/AudioManager.js';
const Study = lazy(() => import('./pages/Study.jsx'));
const Game = lazy(() => import('./pages/Game.jsx'));
const Review = lazy(() => import('./pages/Review.jsx'));
const Leaderboard = lazy(() => import('./pages/Leaderboard.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Explore = lazy(() => import('./pages/Explore.jsx'));
const Ranked = lazy(() => import('./pages/Ranked.jsx'));
const World = lazy(() => import('./pages/World.jsx'));
const LegacyMaps = lazy(() => import('./pages/LegacyMaps.jsx'));
function GameRoute() { const location = useLocation(); const mode = new URLSearchParams(location.search).get('mode'); return mode === 'world' ? <Navigate to="/world" replace/> : mode === 'ranked' ? <Navigate to="/ranked" replace/> : <Game/>; }
const Maps = lazy(() => import('./pages/Maps.jsx'));
export default function App() {
  const location = useLocation();
  const [soundSettings, setSoundSettings] = useState(false);
  useEffect(() => {
    const interact = event => { if (!event.target.closest('button, a, input')) return; audioManager.unlock(); if (!event.target.closest('.character-picker')) audioManager.play('select'); if (location.pathname !== '/game') audioManager.music('menu'); };
    document.addEventListener('click', interact);
    if (location.pathname !== '/game') audioManager.music('menu');
    return () => document.removeEventListener('click', interact);
  }, [location.pathname]);
  return <div className={`app-shell ${location.pathname === '/game' ? 'in-game' : ''}`}>
    <header className="header"><Link to="/" className="brand" aria-label="HisRun — Trang chủ"><svg className="brand-poster-logo" viewBox="500 0 375 195" aria-hidden="true"><image href="/assets/posters/hisrun-poster.png" width="1376" height="768" /></svg></Link><nav aria-label="Điều hướng chính"><NavLink to="/study">Học tập</NavLink><NavLink to="/maps">Hành trình</NavLink><NavLink to="/ranked">Xếp hạng</NavLink><NavLink to="/review">Ôn tập</NavLink><NavLink className="nav-profile" to="/profile">Hồ sơ</NavLink></nav>{location.pathname !== '/game' && <button className="outline-button sound-menu" aria-label="Cài đặt âm thanh" onClick={() => setSoundSettings(true)}>♫</button>}</header>{soundSettings && <Settings onClose={() => setSoundSettings(false)}/>}
    <main><Suspense fallback={<div className="loading" role="status">Đang chuẩn bị hành trình…</div>}><Routes><Route path="/" element={<Home />} /><Route path="/study" element={<Study />} /><Route path="/game" element={<GameRoute />} /><Route path="/maps" element={<Maps />} /><Route path="/explore" element={<Explore />} /><Route path="/ranked" element={<Ranked />} /><Route path="/world" element={<World />} /><Route path="/legacy-maps" element={<LegacyMaps />} /><Route path="/review" element={<Review />} /><Route path="/leaderboard" element={<Leaderboard />} /><Route path="/profile" element={<Profile />} /><Route path="*" element={<div className="not-found"><h1>Bạn đã đi lạc một chút.</h1><Link className="primary-button" to="/">Về trang chủ ↗</Link></div>} /></Routes></Suspense></main>
    <footer><span>© {new Date().getFullYear()} HISRUN <i>•</i> Mỗi bước chạy, một điều mới.</span>{import.meta.env.DEV && <BackendStatus />}<span>Được tạo nên cho những tâm hồn khám phá <span className="footer-star">✦</span></span></footer>
  </div>;
}
