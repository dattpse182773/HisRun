import { useEffect, useState } from 'react';
import { GRADE_GROUPS, LEARNING_NOTICE } from '../../../shared/learning.js';
import Exam from '../components/Exam.jsx';
import { api } from '../services/api.js';
import { readStorage } from '../services/storage.js';
const SUBJECTS = [{ id: 'history', name: 'Lịch sử', description: 'Nhân vật, sự kiện và các thời kỳ lịch sử.' }, { id: 'geography', name: 'Địa lý', description: 'Tự nhiên, dân cư và kinh tế theo chương trình từng lớp.' }];
export default function Study() {
  const [grade, setGrade] = useState(4), [subject, setSubject] = useState('history'), [count, setCount] = useState(10), [run, setRun] = useState(null), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const selected = SUBJECTS.find(s => s.id === subject);
  const [catalog, setCatalog] = useState(null);
  useEffect(() => { let active = true; api.examCatalog().then(data => { if(active) setCatalog(data); }).catch(e => { if(active) setError(e.message); }); return () => { active = false; }; }, []);
  const approvedCount = catalog?.grades.find(g => g.grade === grade)?.subjects.find(s => s.subject === subject)?.count || 0;
  const available = approvedCount >= count;
  async function start() { if (!available) return; setBusy(true); setError(''); try { setRun(await api.startExam({ mode: 'study', grade, subject, count })); } catch (e) { setError(e.message); } finally { setBusy(false); } }
  const history = readStorage('examHistory', []).filter(r => r.mode === 'study' && (r.subject || 'history') === subject && (r.grade === grade || (!r.grade && r.title === `${selected.name} lớp ${grade}`)));
  return <section className="content-page study-page">
    <div className="page-intro"><span className="eyebrow">HỌC TẬP THEO CẤP · TRẢ BÀI HẰNG NGÀY</span><h1>Chọn lớp, chọn môn.<br/>Ôn đúng kiến thức.</h1><p>Lịch sử và Địa lý có bài học, bài kiểm tra và kết quả riêng. Mỗi bài 10 hoặc 15 câu ngẫu nhiên theo đúng lớp và môn đã chọn.</p></div>
    {!run ? <>
      <div className="grade-groups">{GRADE_GROUPS.map(group => <section key={group.name}><h2>{group.name}</h2><div className="tab-row">{group.grades.map(g => <button key={g} className={grade === g ? 'active' : ''} aria-pressed={grade === g} onClick={() => { setGrade(g); setError(''); }}>Lớp {g}</button>)}</div></section>)}</div>
      <section aria-label={`Chọn môn lớp ${grade}`}><h2>Môn học · Lớp {grade}</h2><div className="subject-picker">{SUBJECTS.map(s => <button key={s.id} className={`subject-card ${subject === s.id ? 'active' : ''}`} aria-pressed={subject === s.id} onClick={() => { setSubject(s.id); setError(''); }}><strong>{s.name}</strong><span>{s.description}</span></button>)}</div></section>
      <h2>{selected.name} lớp {grade}</h2>
      <div className="tab-row" aria-label="Độ dài bài">{[10, 15].map(n => <button key={n} aria-pressed={count === n} className={count === n ? 'active' : ''} onClick={() => setCount(n)}>{n} câu</button>)}</div>{available ? <><p className="scope-note">{LEARNING_NOTICE}</p><div className="button-row"><button className="primary-button" disabled={busy} onClick={start}>{busy ? 'Đang chuẩn bị…' : `Trả bài ${selected.name} lớp ${grade} · ${count} câu →`}</button></div></> : <p className="scope-note" role="status">{catalog ? `Hiện có ${approvedCount} câu ${selected.name} lớp ${grade} đã đối chiếu nguồn chính thức. Cần tối thiểu ${count} câu để mở bài.` : 'Đang kiểm tra ngân hàng câu hỏi…'} Chỉ sử dụng SGK chương trình trước 2018 và đề kiểm tra chính thức của trường, Sở hoặc Bộ. Câu từ tài liệu tóm tắt và đề tham khảo chưa xác minh không được đưa vào bài.</p>}
      {error && <p role="alert" className="inline-error">{error}</p>}
      <section className="study-history"><h2>Kết quả {selected.name} lớp {grade}</h2><p>Kết quả cũ được giữ lại; chúng có thể thuộc ngân hàng thử nghiệm trước khi áp dụng quy định nguồn chính thức.</p>{history.length ? history.slice(0, 5).map((r, i) => <p key={i}>{r.title} · {new Date(r.date).toLocaleDateString('vi-VN')} · <strong>{r.mark}/10</strong> ({r.correct}/{r.total} câu)</p>) : <p>Chưa có bài làm cho lớp và môn này.</p>}</section>
    </> : <Exam key={run.token} run={run} onExit={() => setRun(null)}/>}
  </section>;
}
