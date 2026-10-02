import { createHash, randomBytes } from 'node:crypto';
import User from '../models/User.js';
import GameResult from '../models/GameResult.js';
import { HttpError } from '../middleware/errorHandler.js';
import { validateId } from './questionService.js';
import { JOURNEY_MAPS, SCHOOL_LEVELS } from '../../../shared/journey.js';

const hash = token => createHash('sha256').update(token).digest('hex');
const totals = {
  highScore: { $max: '$score' }, totalDistance: { $sum: '$distance' }, coins: { $sum: '$coins' }, totalGames: { $sum: 1 },
  correctAnswers: { $sum: '$correctAnswers' }, wrongAnswers: { $sum: '$wrongAnswers' }, historyCorrect: { $sum: '$historyCorrect' }, geographyCorrect: { $sum: '$geographyCorrect' }, bestCombo: { $max: '$bestCombo' },
};
export async function createPlayer(username) {
  if (typeof username !== 'string' || username.trim().length < 2 || username.trim().length > 24 || /[<>\x00-\x1f]/.test(username)) throw new HttpError(400, 'Tên cần 2–24 ký tự, không chứa ký tự điều khiển hoặc dấu ngoặc nhọn.');
  const token = randomBytes(32).toString('hex');
  const player = await User.create({ username: username.trim(), tokenHash: hash(token) });
  return { _id: player._id, username: player.username, token };
}
export async function getPlayer(id) {
  validateId(id); const player = await User.findById(id).lean();
  if (!player) throw new HttpError(404, 'Không tìm thấy người chơi.');
  // GameResult is the source of truth: duplicate retries cannot inflate totals.
  const [stats] = await GameResult.aggregate([{ $match: { playerId: player._id } }, { $group: { _id: null, ...totals } }, { $project: { _id: 0 } }]);
  const recent = await GameResult.find({ playerId: player._id }).sort({ createdAt: -1 }).limit(10).select('-__v').lean();
  return { _id: player._id, username: player.username, stats: stats || { highScore: 0, totalDistance: 0, coins: 0, totalGames: 0, correctAnswers: 0, wrongAnswers: 0, historyCorrect: 0, geographyCorrect: 0, bestCombo: 0 }, recent };
}
export function validateResult(body) {
  if (!body || !['endless', 'history', 'geography', 'mixed', 'grade', 'journey'].includes(body.mode)) throw new HttpError(400, 'Chế độ không hợp lệ.');
  if (typeof body.runId !== 'string' || !/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(body.runId)) throw new HttpError(400, 'runId không hợp lệ.');
  const clean = { runId: body.runId, mode: body.mode };
  if (body.mode === 'journey') {
    const map = JOURNEY_MAPS.find(row => row.id === body.mapId);
    if (!map || !SCHOOL_LEVELS.some(row => row.id === body.schoolLevel) || typeof body.completed !== 'boolean') throw new HttpError(400, 'Map, cấp học hoặc trạng thái hoàn thành không hợp lệ.');
    if (body.completed && body.distance !== map.distance) throw new HttpError(400, 'Chưa đủ quãng đường hoàn thành map.');
    Object.assign(clean, { mapId: map.id, schoolLevel: body.schoolLevel, completed: body.completed });
  }
  for (const [key, max] of Object.entries({ score: 10000000, distance: 1000000, coins: 100000, correctAnswers: 10000, wrongAnswers: 10000, historyCorrect: 10000, geographyCorrect: 10000, bestCombo: 10000 })) {
    if (!Number.isInteger(body[key]) || body[key] < 0 || body[key] > max) throw new HttpError(400, `${key} không hợp lệ.`);
    clean[key] = body[key];
  }
  if (typeof body.duration !== 'number' || !Number.isFinite(body.duration) || body.duration < 0 || body.duration > 86400) throw new HttpError(400, 'Thời lượng không hợp lệ.');
  clean.duration = body.duration;
  if (clean.historyCorrect + clean.geographyCorrect !== clean.correctAnswers || clean.bestCombo > clean.correctAnswers || clean.distance > clean.duration * 46 + 10 || clean.score < clean.distance + clean.coins * 10 || clean.score > clean.distance + clean.coins * 10 + clean.correctAnswers * 600) throw new HttpError(400, 'Kết quả có các chỉ số không nhất quán.');
  return clean;
}
export async function saveResult(body, authorization) {
  validateId(body?.playerId);
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!/^[a-f\d]{64}$/.test(token)) throw new HttpError(401, 'Cần khóa người chơi để lưu kết quả.');
  const player = await User.findOne({ _id: body.playerId, tokenHash: hash(token) });
  if (!player) throw new HttpError(401, 'Khóa người chơi không hợp lệ.');
  const clean = validateResult(body);
  try {
    await GameResult.updateOne({ playerId: player._id, runId: clean.runId }, { $setOnInsert: { ...clean, playerId: player._id, verified: false } }, { upsert: true, runValidators: true });
  } catch (error) { if (error.code !== 11000) throw error; }
  return getPlayer(String(player._id));
}
export async function leaderboard(metric) {
  const field = { score: 'highScore', distance: 'totalDistance', knowledge: 'correctAnswers' }[metric];
  if (!field) throw new HttpError(400, 'Loại bảng xếp hạng không hợp lệ.');
  return GameResult.aggregate([{ $group: { _id: '$playerId', ...totals } }, { $sort: { [field]: -1, _id: 1 } }, { $limit: 50 }, { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'player' } }, { $project: { ...Object.fromEntries(Object.keys(totals).map(key => [key, 1])), username: { $arrayElemAt: ['$player.username', 0] } } }]);
}
