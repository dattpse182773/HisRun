import { useEffect, useRef, useState } from 'react';
import PhaserGame from './PhaserGame.jsx';
import Modal from './Modal.jsx';
import RunLives from './RunLives.jsx';
import { api } from '../services/api.js';
import { EventBus, GAME_EVENTS as E } from '../game/EventBus.js';
export default function ProvinceRun({ run, map, characterId, username, onFinish }) {
  const [ready, setReady] = useState(false), [hud, setHud] = useState(null), [gate, setGate] = useState(null), [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false), [feedback,setFeedback] = useState(null), [error,setError] = useState('');
  const answers = useRef(Array(10).fill(null)); const finish = useRef(onFinish); finish.current = onFinish;
  useEffect(() => {
    const onReady = () => setReady(true), onHud = data => setHud(data), onGate = data => { if (data.exam) { setGate(data); setSelected(null); setFeedback(null); setError(''); } }, onOver = () => finish.current(answers.current);
    const pairs = [[E.READY, onReady],[E.HUD,onHud],[E.QUESTION,onGate],[E.OVER,onOver]];
    pairs.forEach(([e, fn]) => EventBus.on(e, fn)); return () => pairs.forEach(([e, fn]) => EventBus.off(e, fn));
  }, []);
  useEffect(() => { if (ready) EventBus.emit(E.START, { provinceExam: true, provinceId: map.id, mapId: map.sceneryMapId, schoolLevel: 'primary', characterId }); }, [ready, map.id, map.sceneryMapId, characterId]);
  const q = gate && run.questions[gate.index];
  async function next() {
    if (busy) return;
    if (feedback) { const id = gate.runId; setGate(null); EventBus.emit(E.ANSWER, { runId: id, correct: feedback.correct }); return; }
    setBusy(true); setError('');
    try { const data = await api.answerExam(run.token, gate.index, selected); answers.current[gate.index] = data.selected; setFeedback(data); }
    catch(e) { setError(e.message); } finally { setBusy(false); }
  }
  return <><div className="runner-hud"><strong>{map.name}</strong><span>{Math.floor(hud?.distance || 0)} m</span><span>{answers.current.filter(a => a !== null).length}/10 câu</span><button className="pause-button" aria-label="Tạm dừng" onClick={() => EventBus.emit(E.PAUSE)}>Ⅱ</button></div><div className="game-frame life-frame"><PhaserGame/><RunLives health={hud?.health ?? 3} name={username}/></div><p className="scope-note">Cảnh chạy lấy cảm hứng từ danh thắng địa phương; kiến thức thuộc {map.name}. 3 mạng tối đa. Nhặt token ? hoặc va chạm sau ít nhất 20 giây và 180 m để gặp câu hỏi. Đúng: hồi 1 mạng, +20 m. Sai: −1 mạng, −50 m. Hoàn thành 10 câu hoặc hết mạng thì kết thúc.</p><div className="touch-controls">{[['left','←','Trái'],['jump','↑','Nhảy'],['slide','↓','Trượt'],['right','→','Phải']].map(([action, icon, label]) => <button key={action} onClick={() => EventBus.emit(E.INPUT, action)}><strong>{icon}</strong><span>{label}</span></button>)}</div>{hud?.gameStatus === 'paused' && <Modal title="Tạm nghỉ"><button className="primary-button" onClick={() => EventBus.emit(E.PAUSE)}>Tiếp tục chạy →</button></Modal>}{q && <Modal title={`${map.name} · Câu ${gate.index + 1}/10`} wide><p>{q.topic}</p><h2>{q.question}</h2><div className="answer-grid">{q.answers.map((text, i) => <button className={`answer-button ${selected === i ? 'selected' : ''}`} aria-pressed={selected === i} key={i} disabled={busy || !!feedback} onClick={() => setSelected(i)}><span>{'ABCD'[i]}</span>{text}</button>)}</div><button className="primary-button full-button" disabled={selected === null || busy} onClick={next}>{busy ? 'Đang kiểm tra…' : feedback ? 'Chạy tiếp →' : 'Trả lời'}</button>{feedback && <div role="status"><strong>{feedback.correct ? 'Chính xác! Hồi 1 mạng (tối đa 3), +20 m' : 'Chưa đúng: −1 mạng, lùi 50 m'}</strong><p>{feedback.explanation}</p></div>}{error && <p role="alert">{error} — hãy thử lại.</p>}</Modal>}</>;
}
