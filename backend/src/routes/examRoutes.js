import { eligibleForStudy, CONTENT_POLICY } from '../../../shared/contentPolicy.js';
import { Router } from 'express';
import { randomUUID, randomInt } from 'node:crypto';
import ExamRun from '../models/ExamRun.js';
import ExamScore from '../models/ExamScore.js';
import { STUDY_BANK } from '../data/studyBank.js';
import { provinceBank } from '../data/provinceBank.js';
import { PROVINCES } from '../../../shared/provinces.js';
import { GRADE_SUMMARIES } from '../../../shared/learning.js';
import { HttpError } from '../middleware/errorHandler.js';

export function shuffle(rows) { const copy = [...rows]; for (let i = copy.length - 1; i > 0; i--) { const j = randomInt(i + 1); [copy[i], copy[j]] = [copy[j], copy[i]]; } return copy; }
export function examPool({ mode, grade, provinceId, count, subject = 'history' }) {
  if (mode === 'study') {
    if (!Number.isInteger(grade) || grade < 4 || grade > 12 || ![10, 15].includes(count)) throw new HttpError(400, 'Chọn lớp 4–12 và bài 10 hoặc 15 câu.');
    if (!['history', 'geography'].includes(subject)) throw new HttpError(400, 'Chọn môn Lịch sử hoặc Địa lý.');
    return STUDY_BANK.filter(q => q.grade === grade && q.subject === subject && eligibleForStudy(q));
  }
  if (mode === 'explore') {
    if (count !== 10 || !PROVINCES.some(p => p.id === provinceId)) throw new HttpError(400, 'Chọn tỉnh/thành và bài 10 câu.');
    return provinceBank(provinceId);
  }
  if (mode === 'ranked' && count === 30) return [...new Map([...STUDY_BANK, ...PROVINCES.flatMap(p => provinceBank(p.id))].map(q => [q.question, q])).values()];
  throw new HttpError(400, 'Chế độ hoặc số câu không hợp lệ.');
}
export function gradeExam(questions, answers) {
  if (!Array.isArray(answers) || answers.length !== questions.length || answers.some(a => a !== null && (!Number.isInteger(a) || a < 0 || a > 3))) throw new HttpError(400, 'Danh sách đáp án không hợp lệ.');
  const review = questions.map((q, i) => ({ ...q, selected: answers[i], correct: answers[i] === q.correctAnswer }));
  const correct = review.filter(q => q.correct).length;
  return { correct, total: questions.length, mark: Math.round(correct / questions.length * 100) / 10, skipped: answers.filter(a => a === null).length, review };
}
const router = Router();
router.get('/catalog', (req, res) => res.json({ grades: Array.from({ length: 9 }, (_, i) => ({ grade: i + 4, count: STUDY_BANK.filter(q => q.grade === i + 4 && eligibleForStudy(q)).length, subjects: ['history', 'geography'].map(subject => ({ subject, count: STUDY_BANK.filter(q => q.grade === i + 4 && q.subject === subject && eligibleForStudy(q)).length })) })), provinces: PROVINCES.map(p => ({ id: p.id, count: provinceBank(p.id).length })), sourceStatus: 'pending-official-sources', policy: CONTENT_POLICY, rankedBank: 'provisional' }));
router.get('/ranking', async (req, res) => res.json(await ExamScore.find().sort({ correct: -1, duration: 1, createdAt: 1 }).limit(50).select('name correct total duration createdAt -_id').lean()));
router.post('/', async (req, res) => {
  const { mode, grade, provinceId, count, subject = 'history' } = req.body;
  const pool = examPool({ mode, grade, provinceId, count, subject });
  if (pool.length < count) throw new HttpError(409, mode === 'study' ? 'Chưa đủ câu đã đối chiếu SGK hoặc đề kiểm tra chính thức cho lớp và môn này.' : 'Chưa đủ câu khác nhau cho bài này.');
  const questions = shuffle(pool).slice(0, count).map(q => {
    const order = shuffle([0, 1, 2, 3]);
    return { ...q, answers: order.map(i => q.answers[i]), correctAnswer: order.indexOf(q.correctAnswer) };
  });
  const title = mode === 'study' ? `${subject === 'geography' ? 'Địa lý' : 'Lịch sử'} lớp ${grade}` : mode === 'explore' ? PROVINCES.find(p => p.id === provinceId).name : 'Kiến thức tổng hợp';
  const run = await ExamRun.create({ token: randomUUID(), mode, subject: mode === 'study' ? subject : undefined, grade: mode === 'study' ? grade : undefined, provinceId: mode === 'explore' ? provinceId : undefined, title, questions, expiresAt: new Date(Date.now() + 86400000) });
  res.status(201).json({ token: run.token, title, mode, subject: run.subject, grade: run.grade, questions: questions.map(({ id, topic, question, answers }) => ({ id, topic, question, answers })) });
});
router.post('/:token/answer', async (req, res) => {
  const { index, answer } = req.body;
  if (!/^[a-f\d-]{36}$/i.test(req.params.token) || !Number.isInteger(index) || index < 0 || index > 9 || !Number.isInteger(answer) || answer < 0 || answer > 3) throw new HttpError(400, 'Đáp án không hợp lệ.');
  const run = await ExamRun.findOne({ token: req.params.token, mode: 'explore', expiresAt: { $gt: new Date() }, result: { $exists: false } }).lean();
  if (!run) throw new HttpError(404, 'Lượt chơi đã kết thúc hoặc hết hạn.');
  if (index > 0 && run.liveAnswers?.[index - 1] === undefined) throw new HttpError(400, 'Hãy hoàn thành câu trước.');
  const updated = await ExamRun.findOneAndUpdate({ _id: run._id, [`liveAnswers.${index}`]: { $exists: false } }, { $set: { [`liveAnswers.${index}`]: answer } }, { new: true }).lean();
  const saved = updated || await ExamRun.findById(run._id).lean();
  const selected = saved.liveAnswers[index], q = run.questions[index];
  res.json({ selected, correct: selected === q.correctAnswer, correctAnswer: q.correctAnswer, explanation: q.explanation });
});
router.post('/:token/submit', async (req, res) => {
  if (!/^[a-f\d-]{36}$/i.test(req.params.token)) throw new HttpError(400, 'Mã bài không hợp lệ.');
  const run = await ExamRun.findOne({ token: req.params.token, expiresAt: { $gt: new Date() } }).lean();
  if (!run) throw new HttpError(404, 'Bài đã hết hạn. Vui lòng bắt đầu bài mới.');
  if (run.result) return res.json(run.result);
  const result = { ...gradeExam(run.questions, req.body.answers), summary: run.mode === 'study' && (run.subject || 'history') === 'history' ? GRADE_SUMMARIES[run.grade] : [], duration: Math.max(1, Math.round((Date.now() - run.createdAt.getTime()) / 1000)) };
  const updated = await ExamRun.findOneAndUpdate({ _id: run._id, result: { $exists: false } }, { $set: { result } }, { new: true }).lean();
  const final = updated?.result || (await ExamRun.findById(run._id).lean()).result;
  if (run.mode === 'ranked') {
    const name = typeof req.body.name === 'string' ? req.body.name.trim().slice(0, 40) : '';
    await ExamScore.updateOne({ runId: run.token }, { $setOnInsert: { name: name || 'Nhà thám hiểm', correct: final.correct, total: final.total, duration: final.duration } }, { upsert: true });
  }
  res.json(final);
});
export default router;
