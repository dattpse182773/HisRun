import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { readStorage } from '../services/storage.js';
import { syncResults } from '../services/player.js';
import { getMap } from '../../../shared/journey.js';
const n = value => Math.floor(value || 0).toLocaleString('vi-VN');
function localProfile() {
  const runs = readStorage('runs', []);
  return { username: readStorage('username', 'Nhà thám hiểm'), recent: runs.slice(0, 10), stats: { highScore: readStorage('highScore', 0), totalGames: runs.length, totalDistance: runs.reduce((sum, row) => sum + row.distance, 0), coins: runs.reduce((sum, row) => sum + row.coins, 0), correctAnswers: runs.reduce((sum, row) => sum + row.correctAnswers, 0), wrongAnswers: runs.reduce((sum, row) => sum + row.wrongAnswers, 0), bestCombo: Math.max(0, ...runs.map(row => row.bestCombo)) } };
}
export default function Profile() {
  const [profile, setProfile] = useState(localProfile), [status, setStatus] = useState('Đang kiểm tra hồ sơ…'), [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true; const controller = new AbortController();
    (async () => {
      try {
        await syncResults(); const player = readStorage('player', null);
        if (!player) { if (active) setStatus('Hồ sơ trên thiết bị · bắt đầu chơi để lưu hành trình'); return; }
        const data = await api.player(player._id, controller.signal); if (active) { setProfile(data); setStatus('✓ Đã đồng bộ với máy chủ'); }
      } catch { if (active) { setProfile(localProfile()); setStatus('Đang xem tối đa 30 lượt lưu trên máy. Máy chủ chưa sẵn sàng.'); } }
    })();
    return () => { active = false; controller.abort(); };
  }, [retry]);
  const stats = profile.stats; const total = stats.correctAnswers + stats.wrongAnswers;
  return <section className="content-page"><div className="profile-heading"><span className="profile-avatar">{profile.username[0].toUpperCase()}</span><div><div className="eyebrow">HỘ CHIẾU NHÀ THÁM HIỂM</div><h1>{profile.username}</h1><p role="status">{status}</p></div></div><div className="profile-stats">{[['Kỷ lục', n(stats.highScore)], ['Tổng quãng đường', n(stats.totalDistance) + ' m'], ['Xu thu thập', n(stats.coins)], ['Lượt chạy', n(stats.totalGames)], ['Câu đúng', n(stats.correctAnswers)], ['Chính xác', (total ? Math.round(stats.correctAnswers / total * 100) : 0) + '%']].map(([label, value]) => <article key={label}><small>{label}</small><strong>{value}</strong></article>)}</div><div className="button-row"><Link className="primary-button" to="/maps">Tiếp tục khám phá ↗</Link><Link className="outline-button" to="/review">Ôn tập kiến thức</Link><button className="outline-button" onClick={() => { setStatus('Đang đồng bộ…'); setRetry(retry + 1); }}>Đồng bộ kết quả ({readStorage('pending', []).length})</button></div><h2 className="recent-title">Những hành trình gần đây</h2>{profile.recent.length ? <div className="leaderboard-table">{profile.recent.map(row => <div className="leaderboard-row" key={row.runId}><span>{row.mode === 'journey' ? `Map ${getMap(row.mapId).number}${row.completed ? ' ✓' : ''}` : ({ endless: 'Bất tận', history: 'Lịch sử', geography: 'Địa lý', mixed: 'Tổng hợp', grade: 'Theo lớp' })[row.mode]}</span><span>{n(row.distance)} m · {row.correctAnswers} câu đúng</span><strong>{n(row.score)} điểm</strong></div>)}</div> : <p className="empty-state">Chưa có lượt chạy nào. Hành trình đầu tiên đang chờ bạn.</p>}</section>;
}
