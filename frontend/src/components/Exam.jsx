import { useState } from 'react';
import { api } from '../services/api.js';
import { studyAssessment } from '../../../shared/playModes.js';
import { readStorage, writeStorage } from '../services/storage.js';

export function ExamResult({ result, title, onRestart }) {
  const assessment = studyAssessment(result.correct, result.total - result.correct);
  return <section className="exam-result" aria-label="Kết quả bài làm"><div className="study-result" role="status"><span>{title}</span><h2>{result.mark}/10</h2><strong>{assessment.label}</strong><p>{result.correct}/{result.total} câu đúng · {result.skipped} câu bỏ trống</p></div>{result.summary?.length > 0 && <section className="exam-summary"><h2>Khái quát chương trình</h2><ul>{result.summary.map(line => <li key={line}>{line}</li>)}</ul><p>Bản ghi nhớ theo chương trình trước 2018, không thay thế toàn bộ bài học.</p></section>}<h2>Giáo viên trả bài</h2><p>Ưu tiên ôn các chủ đề: {[...new Set(result.review.filter(q => !q.correct).map(q => q.topic))].join(', ') || 'Bạn đã trả lời đúng toàn bộ lượt này.'}</p><div className="review-list">{result.review.map((q, i) => <details className="review-card" key={q.id}><summary>{q.correct ? '✓' : '○'} Câu {i + 1}: {q.question}</summary><p>Bạn chọn: {q.selected === null ? 'Bỏ trống' : q.answers[q.selected]}</p><strong>Đáp án: {q.answers[q.correctAnswer]}</strong><p>{q.explanation}</p><a href={q.sourceUrl} target="_blank" rel="noreferrer">{q.sourceTitle} ↗</a></details>)}</div><button className="primary-button" onClick={onRestart}>Làm bài mới →</button></section>;
}
export default function Exam({ run, onExit, name = '', onSubmitted }) {
  const [answers, setAnswers] = useState(() => run.questions.map(() => null));
  const [index, setIndex] = useState(0), [busy, setBusy] = useState(false), [error, setError] = useState(''), [result, setResult] = useState(null), [confirm, setConfirm] = useState(false);
  const q = run.questions[index];
  async function submit() {
    if (busy) return; setBusy(true); setError('');
    try {
      const data = await api.submitExam(run.token, { answers, name }); setResult(data);
      const history = readStorage('examHistory', []); writeStorage('examHistory', [{ title: run.title, mode: run.mode, subject: run.subject, grade: run.grade, date: Date.now(), correct: data.correct, total: data.total, mark: data.mark }, ...history].slice(0, 30));
      onSubmitted?.(data);
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  if (result) return <ExamResult result={result} title={run.title} onRestart={onExit}/>;
  return <section className="exam-paper" aria-label={run.title}><div className="exam-progress"><strong>{run.title} · Câu {index + 1}/{run.questions.length}</strong><span>{answers.filter(a => a !== null).length} đã trả lời</span></div><progress max={run.questions.length} value={answers.filter(a => a !== null).length} aria-label="Tiến độ bài làm"/><p className="eyebrow">{q.topic}</p><h2>{q.question}</h2><div className="answer-grid">{q.answers.map((text, choice) => <button key={choice} disabled={busy} aria-pressed={answers[index] === choice} className={`answer-button ${answers[index] === choice ? 'selected' : ''}`} onClick={() => { setConfirm(false); setAnswers(old => old.map((v, i) => i === index ? choice : v)); }}><span>{'ABCD'[choice]}</span>{text}</button>)}</div><div className="exam-navigation" aria-label="Chọn câu hỏi">{run.questions.map((question, i) => <button key={question.id} aria-label={`Câu ${i + 1}${answers[i] !== null ? ', đã trả lời' : ', chưa trả lời'}`} aria-current={index === i ? 'step' : undefined} className={answers[i] !== null ? 'answered' : ''} onClick={() => setIndex(i)}>{i + 1}</button>)}</div><div className="button-row"><button className="outline-button" disabled={index === 0 || busy} onClick={() => setIndex(index - 1)}>← Câu trước</button>{index < run.questions.length - 1 && <button className="outline-button" disabled={busy} onClick={() => setIndex(index + 1)}>Câu tiếp →</button>}<button className="primary-button" disabled={busy} onClick={() => answers.some(a => a === null) && !confirm ? setConfirm(true) : submit()}>{busy ? 'Đang chấm…' : confirm ? 'Xác nhận nộp cả câu bỏ trống' : 'Nộp bài & chấm điểm'}</button></div>{confirm && <p role="status">Còn {answers.filter(a => a === null).length} câu chưa trả lời; những câu này được 0 điểm.</p>}{error && <p className="inline-error" role="alert">{error} Bạn có thể bấm nộp lại; đáp án đang được giữ.</p>}</section>;
}
