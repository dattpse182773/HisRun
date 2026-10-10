import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import Exam from '../components/Exam.jsx';
export default function Ranked() {
 const [run, setRun] = useState(null), [name, setName] = useState(''), [rows, setRows] = useState([]), [error, setError] = useState(''), [busy, setBusy] = useState(false);
 const load = () => api.examRanking().then(setRows).catch(e => setError(e.message));
 useEffect(() => { void load(); }, []);
 async function start() { setBusy(true); setError(''); try { setRun(await api.startExam({ mode: 'ranked', count: 30 })); } catch(e) { setError(e.message); } finally { setBusy(false); } }
 return <section className="content-page"><div className="page-intro"><span className="eyebrow">KIẾN THỨC TỔNG HỢP</span><h1>30 câu. Một cuộc thi.</h1><p>Không phân cấp hoặc lớp. Xếp hạng theo số câu đúng; cùng điểm ưu tiên thời gian ngắn hơn.</p><p>Phạm vi: tổng hợp kiến thức, đề thi, văn hóa và lịch sử địa phương, gồm cả nâng cao. Hiện đang dùng ngân hàng thử nghiệm; bộ đề nâng cao có kiểm chứng chưa được nhập đầy đủ.</p></div>{run ? <Exam key={run.token} run={run} name={name} onExit={() => setRun(null)} onSubmitted={load}/> : <><label className="exam-name">Tên trên bảng xếp hạng<input value={name} maxLength={40} onChange={e => setName(e.target.value)} placeholder="Nhà thám hiểm"/></label><button className="primary-button" disabled={busy} onClick={start}>{busy ? 'Đang tạo bài…' : 'Bắt đầu 30 câu →'}</button></>}{error && <p role="alert" className="inline-error">{error}</p>}<h2>Bảng xếp hạng bài thi 30 câu</h2><div className="leaderboard-table">{rows.length ? rows.map((row, i) => <div className="leaderboard-row" key={`${i}-${row.createdAt}`}><strong>#{i + 1}</strong><span>{row.name}</span><span>{row.correct}/{row.total} · {row.duration}s</span></div>) : <p className="muted">Chưa có bài thi hoàn thành.</p>}</div></section>;
}
