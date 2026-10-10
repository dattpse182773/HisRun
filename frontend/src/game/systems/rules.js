export const LANES = [360, 640, 920];
export const MAX_SPEED = 460;
export const MODES = [
  { id: 'endless', name: 'Chạy bất tận', detail: 'Chạy, khám phá và học theo nhịp của bạn.', icon: '∞' },
  { id: 'history', name: 'Dấu chân lịch sử', detail: 'Hành trình chỉ có câu hỏi Lịch sử.', icon: '▤' },
  { id: 'geography', name: 'Nhà địa lý', detail: 'Khám phá những miền đất và thế giới.', icon: '◎' },
  { id: 'mixed', name: 'Thử thách tổng hợp', detail: 'Luân phiên hai môn. 20 giây mỗi câu.', icon: '✦' },
  { id: 'grade', name: 'Theo lớp học', detail: 'Chọn kiến thức từ lớp 6 đến lớp 12.', icon: '◇' },
];
export function difficultyAt(distance) {
  const level = Math.min(5, Math.floor(distance / 1000) + 1);
  return { level, speed: Math.min(MAX_SPEED, 300 + (level - 1) * 40), interval: 2.1 - (level - 1) * 0.18, questionDifficulty: Math.ceil(level / 2), itemChance: 0.25 - (level - 1) * 0.02 };
}
export function comboMultiplier(combo) { return combo >= 10 ? 3 : combo >= 5 ? 2 : combo >= 3 ? 1.5 : combo >= 2 ? 1.2 : 1; }
export function newRun(mode = 'endless', grade = 6) {
  return { runId: crypto.randomUUID(), mode, grade, score: 0, distance: 0, coins: 0, health: 3, level: 1, speed: 300, combo: 0, bestCombo: 0, correctAnswers: 0, wrongAnswers: 0, historyCorrect: 0, geographyCorrect: 0, questionPoints: 0, penalties: 0, tokensCollected: 0, duration: 0, gameStatus: 'playing', powers: { shield: 0, magnet: 0, clock: 0, boost: 0, doubleCoin: 0, book: 0 }, wrongQuestions: [] };
}
export function scoreOf(state) { return Math.max(0, Math.floor(state.distance) + state.coins * 10 + state.questionPoints - (state.penalties || 0)); }
export function blockedLanes(level, random = Math.random) {
  const safe = Math.floor(random() * 3);
  const candidates = [0, 1, 2].filter(lane => lane !== safe);
  return { safe, blocked: level < 3 ? [candidates[Math.floor(random() * 2)]] : candidates };
}
export function canAvoid(type, body) {
  return ['log', 'pit', 'trap', 'fence'].includes(type) ? body.bottom > 45 : type === 'branch' ? body.height <= 55 : false;
}
export function newJourneyRun(mapId, schoolLevel) {
  const map = getMap(mapId), school = getSchool(schoolLevel);
  return { ...newRun('journey', school.grades[0]), mapId: map.id, schoolLevel: school.id, distanceTarget: map.distance, gatesVisited: 0, answeredGates: 0, completed: false };
}
export function journeyDifficulty(state) {
  if (state.mode !== 'journey') return difficultyAt(state.distance);
  const school = getSchool(state.schoolLevel);
  const stage = Math.min(2, Math.floor(state.distance / 250));
  const level = { primary: 1, middle: 2, high: 3 }[school.id];
  return { level, speed: Math.min(MAX_SPEED, school.speed + stage * 20), interval: { primary: 2.8, middle: 2.3, high: 2 }[school.id], questionDifficulty: level, itemChance: 0.35 };
}
import { getMap, getSchool } from '../../../../shared/journey.js';
