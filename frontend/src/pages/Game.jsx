import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PhaserGame from '../components/PhaserGame.jsx';
import Modal from '../components/Modal.jsx';
import QuestionModal from '../components/QuestionModal.jsx';
import Settings from '../components/Settings.jsx';
import { EventBus, GAME_EVENTS as E } from '../game/EventBus.js';
import { comboMultiplier } from '../game/systems/rules.js';
import { audioManager } from '../game/systems/AudioManager.js';
import { readStorage, writeStorage, rememberRun } from '../services/storage.js';
import { saveRun, syncResults } from '../services/player.js';

import MapArt from '../components/MapArt.jsx';
import { getMap, getSchool, nextMap, SCHOOL_LEVELS } from '../../../shared/journey.js';

const format = value => Math.floor(value || 0).toLocaleString('vi-VN');
export default function Game() {
  const [ready, setReady] = useState(false), [started, setStarted] = useState(false), [hud, setHud] = useState(null);
  const [params, setParams] = useSearchParams();
  const map = getMap(params.get('map'));
  const [school, setSchool] = useState(() => getSchool(params.get('school') || readStorage('schoolLevel', 'primary')).id);
  const [username, setUsername] = useState(() => readStorage('username', 'Nhà thám hiểm'));
  const [gate, setGate] = useState(null), [result, setResult] = useState(null), [settings, setSettings] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ runId: '', message: '' });
  const recent = useRef([]);
  useEffect(() => {
    let active = true;
    const handlers = [
      [E.READY, () => setReady(true)], [E.HUD, state => setHud(state)], [E.QUESTION, question => setGate(question)],
      [E.OVER, data => {
        rememberRun(data); setResult(data); setSaveStatus({ runId: data.runId, message: 'Đã lưu trên máy · đang đồng bộ…' });
        saveRun(data).then(() => { if (active) setSaveStatus({ runId: data.runId, message: '✓ Đã lưu kết quả lên hồ sơ' }); }).catch(() => { if (active) setSaveStatus({ runId: data.runId, message: 'Đã lưu trên máy. Kết nối lại để đồng bộ lên bảng xếp hạng.' }); });
      }],
    ];
    handlers.forEach(([event, handler]) => EventBus.on(event, handler));
    return () => { active = false; handlers.forEach(([event, handler]) => EventBus.off(event, handler)); };
  }, []);
  function start(mapId = map.id) {
    if (!ready) return;
    audioManager.unlock(); writeStorage('username', username.trim() || 'Nhà thám hiểm');
    writeStorage('schoolLevel', school); setParams({ map: mapId, school }, { replace: true });
    recent.current = []; setResult(null); setGate(null); setStarted(true); EventBus.emit(E.START, { mapId, schoolLevel: school });
    document.activeElement?.blur();
  }
  function completeQuestion(answer) { setGate(null); EventBus.emit(E.ANSWER, answer); }
  function openSettings() { if (hud?.gameStatus === 'playing') EventBus.emit(E.PAUSE); setSettings(true); }
  const paused = hud?.gameStatus === 'paused';
  const accuracy = result && result.correctAnswers + result.wrongAnswers > 0 ? Math.round(result.correctAnswers / (result.correctAnswers + result.wrongAnswers) * 100) : 0;
  return <section className="game-page">
    <div className="game-heading"><div><Link className="back-link" to="/maps">← Hành trình Bắc → Nam</Link><h1>Map {map.number} · {map.name}<span>.</span></h1></div><button className="outline-button" onClick={openSettings}>⚙ Cài đặt</button></div>
    <div className="runner-hud"><div className="hearts" aria-label={`Còn ${hud?.health ?? 3} tim`}>{'♥'.repeat(hud?.health ?? 3)}<span>{'♡'.repeat(3 - (hud?.health ?? 3))}</span></div><div><small>ĐIỂM</small><strong>{format(hud?.score)}</strong></div><div><small>QUÃNG ĐƯỜNG</small><strong>{format(hud?.distance)}<em> m</em></strong></div><div><small>XU</small><strong className="gold-text">◉ {format(hud?.coins)}</strong></div><div className="level-stat"><small>KIẾN THỨC</small><strong>{getSchool(school).name}</strong></div><button className="pause-button" disabled={!started || !['playing', 'paused'].includes(hud?.gameStatus)} onClick={() => EventBus.emit(E.PAUSE)} aria-label={paused ? 'Tiếp tục' : 'Tạm dừng'}>{paused ? '▶' : 'Ⅱ'}</button></div>
    <div className="map-run-progress"><progress aria-label="Tiến độ map" value={hud?.distance || 0} max={map.distance}/><span>{format(hud?.distance)} / {map.distance} m · {map.landmarks.map(place => place.name).join(" → ")}</span></div><div className="game-frame"><PhaserGame /></div>
    <div className="run-status"><span>✦ Combo kiến thức <strong>×{comboMultiplier(hud?.combo || 0)}</strong></span><span>{hud?.map || 'Làng quê Việt Nam'}</span><div className="active-powers">{Object.entries(hud?.powers || {}).filter(([, value]) => value > 0).map(([key, value]) => <span key={key}>{({ shield: '◇ Khiên', magnet: 'U Nam châm', clock: '◷ Chậm', book: '▤ Sách ×2' })[key]} {key === 'shield' ? '' : `${Math.ceil(value)}s`}</span>)}</div></div>
    <div className="touch-controls" aria-label="Điều khiển cảm ứng">{[['left', '←', 'Trái'], ['jump', '↑', 'Nhảy'], ['slide', '↓', 'Trượt'], ['right', '→', 'Phải']].map(([action, icon, label]) => <button key={action} disabled={hud?.gameStatus !== 'playing'} onPointerDown={event => event.preventDefault()} onClick={() => EventBus.emit(E.INPUT, action)} aria-label={label}><strong>{icon}</strong><span>{label}</span></button>)}</div>
    <div className="controls-guide"><span><kbd>A</kbd><kbd>D</kbd> / <kbd>←</kbd><kbd>→</kbd> Đổi làn</span><span><kbd>Space</kbd> Nhảy qua gỗ / hố</span><span><kbd>↓</kbd> Trượt dưới cành cây</span><span><kbd>Esc</kbd> Tạm dừng</span></div>
    {!started && !settings && <Modal title={`Map ${map.number} · ${map.name}`} wide><div className="map-brief"><MapArt map={map}/><div><strong>{map.title}</strong>{map.landmarks.map(place => <p key={place.id}><b>{place.name}</b> — {place.story}</p>)}</div></div><div className="school-options school-inline">{SCHOOL_LEVELS.map(level => <button key={level.id} className={school === level.id ? 'selected' : ''} aria-pressed={school === level.id} onClick={() => setSchool(level.id)}><strong>{level.name}</strong><span>{level.detail}</span></button>)}</div><div className="setup-fields"><label>Tên nhà thám hiểm<input value={username} minLength={2} maxLength={24} disabled={!!readStorage('player', null)} onChange={event => setUsername(event.target.value)}/></label></div><p className="muted">Né đá, nhảy qua gỗ và trượt dưới cành cây. Dừng tại di tích để trả lời câu hỏi sử – địa; về đích ở {map.distance} m.</p><button className="primary-button full-button" disabled={!ready || username.trim().length < 2} onClick={() => start()}>{ready ? 'BẮT ĐẦU MAP →' : 'Đang chuẩn bị khung cảnh…'}</button><p className="question-footnote">Chương trình trước 2018 · Câu hỏi tự biên soạn có nguồn tham khảo</p></Modal>}
    {paused && !settings && <Modal title="Nghỉ chân một chút"><p className="muted">Quãng đường và vật phẩm đã tạm dừng. Sẵn sàng cho những bước chạy tiếp theo?</p><button className="primary-button full-button" onClick={() => { EventBus.emit(E.PAUSE); document.activeElement?.blur(); }}>TIẾP TỤC →</button><div className="button-row"><button className="outline-button" onClick={() => start()}>Chạy lại từ đầu</button><Link className="outline-button" to="/">Về trang chủ</Link></div></Modal>}
    {gate && <QuestionModal key={gate.runId} gate={gate} recent={recent} onComplete={completeQuestion} />}
    {result && !settings && <Modal title={result.completed ? `Hoàn thành Map ${getMap(result.mapId).number}!` : "Nghỉ chân, rồi thử lại!"} wide><div className="result-score"><span>TỔNG ĐIỂM</span><strong>{format(result.score)}</strong><small>Kỷ lục trên máy: {format(readStorage('highScore', 0))}</small></div><div className="result-grid">{[['Quãng đường', `${format(result.distance)} m`], ['Xu thu thập', format(result.coins)], ['Câu đúng', result.correctAnswers], ['Câu sai', result.wrongAnswers], ['Lịch sử đúng', result.historyCorrect], ['Địa lý đúng', result.geographyCorrect], ['Chính xác', `${accuracy}%`], ['Chuỗi đúng tốt nhất', result.bestCombo]].map(([label, value]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div><p className="save-status" role="status">{saveStatus.runId === result.runId ? saveStatus.message : ''}</p>{result.completed && nextMap(result.mapId) ? <button className="primary-button full-button" onClick={() => start(nextMap(result.mapId).id)}>TIẾP TỤC MAP {nextMap(result.mapId).number} · {nextMap(result.mapId).name} →</button> : <button className="primary-button full-button" onClick={() => start()}>CHẠY LẠI MAP ↗</button>}{result.completed && !nextMap(result.mapId) && <p className="muted">Bạn đã đến điểm cuối phía Nam! Khám phá lại hành trình ở cấp học khác nhé.</p>}<Link className="map-play" to="/maps">Chọn địa điểm khác →</Link><div className="button-row"><Link className="outline-button" to="/review">Ôn câu trả lời sai</Link><Link className="outline-button" to="/profile">Hồ sơ</Link><button className="outline-button" onClick={() => { setSaveStatus({ runId: result.runId, message: 'Đang đồng bộ…' }); syncResults().then(() => setSaveStatus({ runId: result.runId, message: '✓ Đồng bộ thành công' })).catch(() => setSaveStatus({ runId: result.runId, message: 'Chưa kết nối được máy chủ. Kết quả vẫn còn trên máy.' })); }}>Đồng bộ lại</button></div></Modal>}
    {settings && <Settings onClose={() => setSettings(false)} />}
  </section>;
}

