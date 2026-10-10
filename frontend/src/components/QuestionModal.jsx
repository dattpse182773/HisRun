import { mapProvinceNote } from '../../../shared/provinces.js';
import { audioManager } from '../game/systems/AudioManager.js';
import { useEffect, useRef, useState } from 'react';
import Modal from './Modal.jsx';
import { api } from '../services/api.js';
import { readStorage, writeStorage } from '../services/storage.js';
import { getMap, getSchool } from '../../../shared/journey.js';

export default function QuestionModal({ gate, recent, onComplete, onExit }) {
  const [question, setQuestion] = useState(null); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null); const [selected, setSelected] = useState(null); const [seconds, setSeconds] = useState(20); const [retry, setRetry] = useState(0);
  const controller = useRef(null); const locked = useRef(false); const deadline = useRef(0);
  const contextMapId = gate.mapId || question?.mapId;
  useEffect(() => {
    const abort = new AbortController(); controller.current = abort; setQuestion(null); setError(''); setResult(null); setSelected(null); setSeconds(20); locked.current = false;
    const review = readStorage('review', []).filter(row => Date.now() - row.lastSeen > 60000).map(row => row._id).slice(-20);
    api.randomQuestion({ scope: gate.scope, excludedMapId: gate.excludedMapId, subject: gate.subject, grade: gate.grade, difficulty: gate.difficulty, mapId: gate.mapId, landmarkId: gate.landmarkId, schoolLevel: gate.schoolLevel, curriculum: gate.curriculum, exclude: recent.current.slice(-20), review }, abort.signal).then(data => {
      if (abort.signal.aborted) return;
      setQuestion(data); recent.current = [...recent.current, data._id].slice(-20); deadline.current = Date.now() + 20000;
    }).catch(error => { if (!abort.signal.aborted) setError(error.status === 404 ? 'Chưa có câu hỏi phù hợp hoặc bạn đã xem hết các câu gần đây. Bạn có thể tiếp tục chạy.' : 'Chưa kết nối được kho câu hỏi. Thử lại hoặc tiếp tục chạy; lượt chơi vẫn được giữ.'); });
    return () => abort.abort();
  }, [gate, retry, recent]);
  useEffect(() => {
    if (!question || result || !gate.timed) return;
    const timer = setInterval(() => {
      if (locked.current) return;
      const left = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)); setSeconds(left);
      if (left === 0) { locked.current = true; setResult({ correct: false, timeout: true }); }
    }, 200);
    return () => clearInterval(timer);
  }, [question, result, gate.timed]);
  async function choose(index) {
    if (locked.current) return;
    locked.current = true; setSelected(index); setBusy(true); setError('');
    try { const data = await api.answer(question._id, index, controller.current.signal); if (!controller.current.signal.aborted) { setResult(data); if (gate.practice) audioManager.play(data.correct ? 'correct' : 'wrong'); } }
    catch { if (!controller.current.signal.aborted) { setError('Chưa gửi được đáp án. Bấm gửi lại để thử cùng đáp án đã chọn.'); } }
    finally { if (!controller.current.signal.aborted) setBusy(false); }
  }
  function finish(skipped = false) {
    if (result?.correct) writeStorage('review', readStorage('review', []).filter(row => row._id !== question._id));
    const review = !skipped && !result?.correct && question ? { ...question, selectedAnswer: selected, correctAnswer: result?.correctAnswer, explanation: result?.explanation || 'Hết thời gian. Hãy trả lời lại câu này trong lượt ôn tập để xem lời giải.', lastSeen: Date.now() } : null;
    if (review) writeStorage('review', [...readStorage('review', []).filter(row => row._id !== review._id), review].slice(-100));
    onComplete({ ...result, runId: gate.runId, challenge: !!gate.challenge, skipped, subject: gate.subject, review });
  }
  return <Modal title={gate.landmarkName || 'Cổng tri thức'} wide>{contextMapId && <p className="landmark-context">Map {getMap(contextMapId).number} · {getMap(contextMapId).name} · Chương trình trước 2018</p>}{contextMapId && <p className="province-context">{mapProvinceNote(contextMapId)}</p>}{gate.challenge && <p className="challenge-rules">Câu hỏi khó ngoài địa danh hiện tại · 20 giây. Đúng +200 điểm và 5 xu; sai hoặc hết giờ −50 điểm (không âm). Bỏ qua không bị trừ điểm.</p>}<div className="question-meta"><span>{gate.subject === 'history' ? '▤ Lịch sử' : '◎ Địa lý'}</span><span>{gate.schoolLevel ? getSchool(gate.schoolLevel).name : gate.scope === 'world' ? 'Thế giới' : 'Tổng hợp'}</span>{gate.timed && <span className={seconds <= 5 ? 'timer urgent' : 'timer'}>◷ {seconds}s</span>}</div>
    {!question && !error && <p role="status">Đang tải câu hỏi…</p>}
    {question && <><p className="question-topic">{question.topic}</p><h3 className="question-text">{question.question}</h3><div className="answer-grid">{question.answers.map((answer, index) => <button key={index} disabled={locked.current || busy || !!result} className={`answer-button ${selected === index ? 'selected' : ''} ${result?.correctAnswer === index ? 'correct' : ''} ${result && selected === index && !result.correct ? 'incorrect' : ''}`} onClick={() => choose(index)}><span>{'ABCD'[index]}</span>{answer}</button>)}</div><p className="sample-label">{question.curriculum === 'pre-2018' ? 'Câu tự biên soạn theo chủ đề chương trình cũ · nguồn tham khảo ở phần lời giải.' : 'Ngân hàng mẫu hiện có · chưa đối chiếu SGK chính thức'}</p></>}
    {busy && <p role="status">Đang kiểm tra đáp án…</p>}
    {error && <div className="inline-error" role="alert">{error}<div className="button-row"><button className="outline-button" disabled={busy} onClick={() => { if (question && selected !== null) { locked.current = false; void choose(selected); } else setRetry(retry + 1); }}>Thử lại</button><button className="outline-button" disabled={busy} onClick={() => finish(true)}>Tiếp tục chạy</button></div></div>}
    {result && <div className={`answer-result ${result.correct ? 'success' : ''}`} role="status"><strong>{result.timeout ? 'Hết thời gian — lần sau thử lại nhé!' : result.correct ? 'Chính xác! Kiến thức tiếp sức cho bạn.' : 'Một điều mới để ghi nhớ.'}</strong>{result.explanation && <p>{result.explanation}</p>}{result.sourceUrl && <a className="source-link" href={result.sourceUrl} target="_blank" rel="noreferrer">Nguồn: {result.sourceTitle} ↗</a>}<button className="primary-button full-button" onClick={() => finish()}>{gate.practice ? 'CÂU TIẾP THEO →' : 'TIẾP TỤC HÀNH TRÌNH →'}</button></div>}
    <p className="question-footnote">{gate.practice ? 'Đọc lời giải để ghi nhớ. Điểm tổng kết hiện sau câu 10.' : gate.challenge ? 'Lượt chạy và thời gian token đang dừng. Thử thách không làm mất tim.' : 'Lượt chạy đang tạm dừng. Trả lời sai không mất tim.'}</p>{gate.challenge && !result && !busy && <button className="outline-button" onClick={() => finish(true)}>Bỏ qua thử thách</button>}{onExit && <button className="outline-button" onClick={onExit}>Dừng bài luyện</button>}
  </Modal>;
}
