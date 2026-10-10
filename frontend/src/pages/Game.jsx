import RunLives from '../components/RunLives.jsx';
import { getPlayMode, studyAssessment } from '../../../shared/playModes.js';
import { TOKENS } from '../../../shared/tokens.js';
import TokenGuide from '../components/TokenGuide.jsx';
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

import CharacterPicker, { CharacterPortrait } from '../components/CharacterPicker.jsx';
import { getCharacter } from '../game/characters.js';
import StoryRecap from '../components/StoryRecap.jsx';
import MapArt from '../components/MapArt.jsx';
import { getMap, getSchool, nextMap, SCHOOL_LEVELS } from '../../../shared/journey.js';

const format = value => Math.floor(value || 0).toLocaleString('vi-VN');
export default function Game() {
  const [ready, setReady] = useState(false), [started, setStarted] = useState(false), [hud, setHud] = useState(null);
  const [params, setParams] = useSearchParams();
  const playMode = getPlayMode(params.get('mode')); const isJourney = playMode.id === 'study';
  const map = getMap(params.get('map'));
  const [school, setSchool] = useState(() => getSchool(params.get('school') || readStorage('schoolLevel', 'primary')).id);
  const [characterId, setCharacterId] = useState(() => getCharacter(readStorage('characterId', 'ty-nam')).id);
  const [username, setUsername] = useState(() => readStorage('username', 'Nhà thám hiểm'));
  const [gate, setGate] = useState(null), [result, setResult] = useState(null), [settings, setSettings] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ runId: '', message: '' });
  const recent = useRef([]);
  useEffect(() => {
    if (ready && !started) EventBus.emit(E.PREVIEW, { mapId: map.id, schoolLevel: school, characterId });
  }, [ready, started, map.id, school, characterId]);
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
    writeStorage('schoolLevel', school); writeStorage('characterId', characterId); setParams({ map: mapId, school, mode: playMode.id }, { replace: true });
    recent.current = []; setResult(null); setGate(null); setStarted(true); EventBus.emit(E.START, { playMode: playMode.id, mapId, schoolLevel: school, characterId });
    document.activeElement?.blur();
  }
  function completeQuestion(answer) { setGate(null); EventBus.emit(E.ANSWER, answer); }
  function openSettings() { if (hud?.gameStatus === 'playing') EventBus.emit(E.PAUSE); setSettings(true); }
  const paused = hud?.gameStatus === 'paused';
  const accuracy = result && result.correctAnswers + result.wrongAnswers > 0 ? Math.round(result.correctAnswers / (result.correctAnswers + result.wrongAnswers) * 100) : 0;
  return <section className="game-page">
    <div className="game-heading"><div><Link className="back-link" to="/maps">← Hành trình Bắc → Nam</Link><h1>{isJourney ? `Map ${map.number} · ${map.name}` : playMode.name}<span>.</span></h1></div><button className="outline-button" onClick={openSettings}>⚙ Cài đặt</button></div>
    <div className="runner-hud"><div><small>ĐIỂM</small><strong>{format(hud?.score)}</strong></div><div><small>QUÃNG ĐƯỜNG</small><strong>{format(hud?.distance)}<em> m</em></strong></div><div><small>XU</small><strong className="gold-text">◉ {format(hud?.coins)}</strong></div><div className="level-stat"><small>KIẾN THỨC</small><strong>{isJourney ? getSchool(school).name : playMode.id === 'world' ? 'Thế giới' : '20 giây'}</strong></div><button className="pause-button" disabled={!started || !['playing', 'paused'].includes(hud?.gameStatus)} onClick={() => EventBus.emit(E.PAUSE)} aria-label={paused ? 'Tiếp tục' : 'Tạm dừng'}>{paused ? '▶' : 'Ⅱ'}</button></div>
    <div className="map-run-progress"><progress aria-label="Tiến độ map" value={hud?.distance || 0} max={isJourney ? map.distance : playMode.id === 'world' ? 1000 : Math.max(1000, hud?.distance || 0)}/><span>{format(hud?.distance)} {isJourney ? `/ ${map.distance} m · ${map.landmarks.map(place => place.name).join(' → ')}` : playMode.id === 'world' ? '/ 1000 m · Khám phá tri thức thế giới' : 'm · Thi tổng hợp · chạy đến khi hết mạng'}</span></div><div className="game-frame life-frame"><PhaserGame /><RunLives health={hud?.health ?? 3} name={username}/></div>
    <div className="run-status"><span className="runner-identity"><CharacterPortrait id={characterId}/>{getCharacter(characterId).name}</span><span>✦ Combo kiến thức <strong>×{comboMultiplier(hud?.combo || 0)}</strong></span><span>{hud?.map || 'Làng quê Việt Nam'}</span><div className="active-powers">{Object.entries(hud?.powers || {}).filter(([, value]) => value > 0).map(([key, value]) => <span key={key}>{TOKENS[key]?.icon} {TOKENS[key]?.name} {key === 'shield' ? '' : `${Math.ceil(value)}s`}</span>)}</div></div>
    <div className="touch-controls" aria-label="Điều khiển cảm ứng">{[['left', '←', 'Trái'], ['jump', '↑', 'Nhảy'], ['slide', '↓', 'Lăn'], ['right', '→', 'Phải']].map(([action, icon, label]) => <button key={action} disabled={hud?.gameStatus !== 'playing'} onPointerDown={event => event.preventDefault()} onClick={() => EventBus.emit(E.INPUT, action)} aria-label={label}><strong>{icon}</strong><span>{label}</span></button>)}</div>
    <TokenGuide/><div className="controls-guide"><span><kbd>A</kbd><kbd>D</kbd> / <kbd>←</kbd><kbd>→</kbd> Đổi làn</span><span><kbd>Space</kbd> Nhảy qua gỗ / hố</span><span><kbd>↓</kbd> Lăn dưới cành cây</span><span><kbd>Esc</kbd> Tạm dừng</span></div>
    {!started && !settings && <Modal title={isJourney ? `Map ${map.number} · ${map.name}` : playMode.name} wide><p className="mode-description">{isJourney ? "Chạy qua địa danh, trả lời sử–địa và khám phá bài học sau khi về đích." : playMode.detail}</p>{!isJourney && <p className="scope-note">Xuất phát trên đường chạy Việt Nam. {playMode.id === 'world' ? 'Khám phá kiến thức thế giới qua câu hỏi; phong cảnh hiện dùng bộ map Việt Nam.' : 'Cùng bộ câu hỏi tổng hợp, tốc độ và giới hạn 20 giây cho mọi người.'}</p>}<div className="map-brief"><MapArt map={map}/><div><strong>{map.title}</strong>{map.landmarks.map(place => <p key={place.id}><b>{place.name}</b> — {place.story}</p>)}</div></div><CharacterPicker value={characterId} onChange={id => { setCharacterId(id); writeStorage('characterId', id); }}/>{isJourney && <div className="school-options school-inline">{SCHOOL_LEVELS.map(level => <button key={level.id} className={school === level.id ? 'selected' : ''} aria-pressed={school === level.id} onClick={() => setSchool(level.id)}><strong>{level.name}</strong><span>{level.detail}</span></button>)}</div>}{isJourney && school === 'high' && <p className="scope-note">Luyện nền tảng cấp 3; chưa phải bộ đề thi tốt nghiệp THPT hoặc tuyển sinh đại học.</p>}<div className="setup-fields"><label>Tên nhà thám hiểm<input value={username} minLength={2} maxLength={24} disabled={!!readStorage('player', null)} onChange={event => setUsername(event.target.value)}/></label></div><p className="muted">Né đá, nhảy qua gỗ và lăn dưới cành cây. {isJourney ? `Dừng tại di tích để trả lời câu hỏi sử – địa; về đích ở ${map.distance} m.` : playMode.id === 'world' ? 'Trả lời câu hỏi thế giới trên hành trình 1.000 m.' : 'Trả lời sử–địa trong 20 giây mỗi câu. Điểm được lưu vào bảng thi tổng hợp.'}</p><TokenGuide/><button className="primary-button full-button" disabled={!ready || username.trim().length < 2} onClick={() => start()}>{ready ? 'BẮT ĐẦU MAP →' : 'Đang chuẩn bị khung cảnh…'}</button><p className="question-footnote">{playMode.id === 'world' ? 'Ngân hàng mẫu hiện có · chưa đối chiếu SGK chính thức' : 'Chương trình trước 2018 · Câu hỏi tự biên soạn có nguồn tham khảo'}</p></Modal>}
    {started && paused && !settings && <Modal title="Nghỉ chân một chút"><p className="muted">Quãng đường và vật phẩm đã tạm dừng. Sẵn sàng cho những bước chạy tiếp theo?</p><button className="primary-button full-button" onClick={() => { EventBus.emit(E.PAUSE); document.activeElement?.blur(); }}>TIẾP TỤC →</button><div className="button-row"><button className="outline-button" onClick={() => { setStarted(false); setReady(true); }}>Đổi nhân vật</button><button className="outline-button" onClick={() => start()}>Chạy lại từ đầu</button><Link className="outline-button" to="/">Về trang chủ</Link></div></Modal>}
    {gate && <QuestionModal key={gate.runId} gate={gate} recent={recent} onComplete={completeQuestion} />}
    {result && !settings && <Modal title={result.completed ? isJourney ? `Hoàn thành Map ${getMap(result.mapId).number}!` : 'Hoàn thành chuyến khám phá!' : "Nghỉ chân, rồi thử lại!"} wide><div className="result-score"><span>TỔNG ĐIỂM</span><strong>{format(result.score)}</strong><small>Kỷ lục trên máy: {format(readStorage('highScore', 0))}</small></div><div className="result-grid">{[['Quãng đường', `${format(result.distance)} m`], ['Xu thu thập', format(result.coins)], ['Điểm bị trừ', format(result.penalties)], ['Token đã nhặt', format(result.tokensCollected)], ['Câu đúng', result.correctAnswers], ['Câu sai', result.wrongAnswers], ['Lịch sử đúng', result.historyCorrect], ['Địa lý đúng', result.geographyCorrect], ['Chính xác', `${accuracy}%`], ['Chuỗi đúng tốt nhất', result.bestCombo]].map(([label, value]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>{isJourney && result.completed && <StoryRecap map={getMap(result.mapId)}/>}<div className="study-result"><strong>{studyAssessment(result.correctAnswers, result.wrongAnswers).mark ?? '—'}/10 · Kiến thức</strong><p>{studyAssessment(result.correctAnswers, result.wrongAnswers).label} · dựa trên {result.correctAnswers + result.wrongAnswers} câu đã trả lời.</p></div>{playMode.id === 'ranked' && <Link className="map-play" to="/leaderboard?mode=mixed">Xem bảng thi tổng hợp →</Link>}<p className="save-status" role="status">{saveStatus.runId === result.runId ? saveStatus.message : ''}</p>{isJourney && result.completed && nextMap(result.mapId) ? <button className="primary-button full-button" onClick={() => start(nextMap(result.mapId).id)}>TIẾP TỤC MAP {nextMap(result.mapId).number} · {nextMap(result.mapId).name} →</button> : <button className="primary-button full-button" onClick={() => start()}>CHẠY LẠI MAP ↗</button>}{isJourney && result.completed && !nextMap(result.mapId) && <p className="muted">Bạn đã đến điểm cuối phía Nam! Khám phá lại hành trình ở cấp học khác nhé.</p>}<button className="outline-button full-button" onClick={() => { setResult(null); setStarted(false); }}>Đổi nhân vật / cấp học</button><Link className="map-play" to="/maps">Chọn địa điểm khác →</Link><div className="button-row"><Link className="outline-button" to="/review">Ôn câu trả lời sai</Link><Link className="outline-button" to="/profile">Hồ sơ</Link><button className="outline-button" onClick={() => { setSaveStatus({ runId: result.runId, message: 'Đang đồng bộ…' }); syncResults().then(() => setSaveStatus({ runId: result.runId, message: '✓ Đồng bộ thành công' })).catch(() => setSaveStatus({ runId: result.runId, message: 'Chưa kết nối được máy chủ. Kết quả vẫn còn trên máy.' })); }}>Đồng bộ lại</button></div></Modal>}
    {settings && <Settings onClose={() => setSettings(false)} />}
  </section>;
}
