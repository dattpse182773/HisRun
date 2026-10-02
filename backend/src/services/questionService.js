import mongoose from 'mongoose';
import Question from '../models/Question.js';
import { HttpError } from '../middleware/errorHandler.js';
import { JOURNEY_MAPS, SCHOOL_LEVELS } from '../../../shared/journey.js';

const publicFields = { _id: 1, subject: 1, grade: 1, difficulty: 1, topic: 1, question: 1, answers: 1, source: 1, chapter: 1, curriculum: 1, schoolLevel: 1, mapId: 1, landmarkId: 1, textbookVerified: 1 };
export function parseInteger(value, name, min, max, fallback) {
  if (value === undefined) return fallback;
  if (typeof value !== 'string' || !/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) < min || Number(value) > max) {
    throw new HttpError(400, `${name} phải là số nguyên từ ${min} đến ${max}.`);
  }
  return Number(value);
}
export function validateId(id) {
  if (typeof id !== 'string' || !/^[a-f\d]{24}$/i.test(id) || !mongoose.isValidObjectId(id)) throw new HttpError(400, 'ID câu hỏi không hợp lệ.');
}
export function buildFilters(query) {
  const filters = { active: true };
  if (query.mapId !== undefined) {
    if (!JOURNEY_MAPS.some(map => map.id === query.mapId)) throw new HttpError(400, 'Map không hợp lệ.');
    filters.mapId = query.mapId;
  }
  if (query.schoolLevel !== undefined) {
    if (!SCHOOL_LEVELS.some(level => level.id === query.schoolLevel)) throw new HttpError(400, 'Cấp học không hợp lệ.');
    filters.schoolLevel = query.schoolLevel;
  }
  if (query.curriculum !== undefined) {
    if (!['sample', 'pre-2018'].includes(query.curriculum)) throw new HttpError(400, 'Chương trình không hợp lệ.');
    filters.curriculum = query.curriculum;
  }
  if (query.landmarkId !== undefined) {
    const maps = query.mapId ? JOURNEY_MAPS.filter(map => map.id === query.mapId) : JOURNEY_MAPS;
    if (!maps.some(map => map.landmarks.some(landmark => landmark.id === query.landmarkId))) throw new HttpError(400, 'Địa danh không thuộc map đã chọn.');
    filters.landmarkId = query.landmarkId;
  }
  if (query.subject !== undefined) {
    if (!['history', 'geography'].includes(query.subject)) throw new HttpError(400, 'Môn học không hợp lệ.');
    filters.subject = query.subject;
  }
  for (const [key, min, max] of [['grade', 4, 12], ['difficulty', 1, 5]]) {
    const value = parseInteger(query[key], key, min, max);
    if (value !== undefined) filters[key] = value;
  }
  if (query.exclude !== undefined) {
    if (typeof query.exclude !== 'string') throw new HttpError(400, 'exclude phải là danh sách ID.');
    const ids = query.exclude.split(',');
    if (ids.length > 20) throw new HttpError(400, 'Chỉ loại trừ tối đa 20 câu gần nhất.');
    ids.forEach(validateId);
    filters._id = { $nin: ids.map(id => new mongoose.Types.ObjectId(id)) };
  }
  return filters;
}
export async function getQuestions(query) {
  const filters = buildFilters(query);
  const page = parseInteger(query.page, 'page', 1, 10000, 1);
  const limit = parseInteger(query.limit, 'limit', 1, 100, 20);
  const [questions, total] = await Promise.all([
    Question.find(filters).select(publicFields).sort({ _id: 1 }).skip((page - 1) * limit).limit(limit).lean(),
    Question.countDocuments(filters),
  ]);
  return { questions, page, limit, total };
}
export async function getRandomQuestion(query) {
  const filters = buildFilters(query);
  let selection = [{ $sample: { size: 1 } }];
  if (query.review !== undefined) {
    if (typeof query.review !== 'string') throw new HttpError(400, 'review phải là danh sách ID.');
    const ids = query.review.split(',');
    if (ids.length > 20) throw new HttpError(400, 'Tối đa 20 câu ôn tập.');
    ids.forEach(validateId);
    // Weighted random sampling: wrong answers have weight 2, recent exclusions still apply.
    selection = [{ $set: { selectionKey: { $pow: [{ $rand: {} }, { $divide: [1, { $cond: [{ $in: ['$_id', ids.map(id => new mongoose.Types.ObjectId(id))] }, 2, 1] }] }] } } }, { $sort: { selectionKey: -1 } }, { $limit: 1 }];
  }
  const [question] = await Question.aggregate([{ $match: filters }, ...selection, { $project: publicFields }]);
  if (!question) throw new HttpError(404, 'Không có câu hỏi phù hợp. Hãy đổi bộ lọc hoặc seed dữ liệu.');
  return question;
}
export async function getQuestion(id) {
  validateId(id);
  const question = await Question.findOne({ _id: id, active: true }).select(publicFields).lean();
  if (!question) throw new HttpError(404, 'Không tìm thấy câu hỏi.');
  return question;
}
export async function checkAnswer(id, answer) {
  validateId(id);
  if (!Number.isInteger(answer) || answer < 0 || answer > 3) throw new HttpError(400, 'answer phải là số nguyên từ 0 đến 3.');
  const question = await Question.findOne({ _id: id, active: true }).select('+correctAnswer +explanation').lean();
  if (!question) throw new HttpError(404, 'Không tìm thấy câu hỏi.');
  return { correct: answer === question.correctAnswer, correctAnswer: question.correctAnswer, explanation: question.explanation, ...(question.sourceUrl ? { sourceUrl: question.sourceUrl, sourceTitle: question.sourceTitle, textbookVerified: question.textbookVerified } : {}) };
}
