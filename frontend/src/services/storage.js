export function readStorage(key, fallback) {
  try { const value = localStorage.getItem(`hisrun:${key}`); return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}
export function writeStorage(key, value) {
  try { localStorage.setItem(`hisrun:${key}`, JSON.stringify(value)); return true; } catch { return false; }
}
export const defaultSettings = { sound: true, music: false, volume: 0.4 };
export function rememberRun(result) {
  if (result.completed && result.mapId) {
    const progress = readStorage('journeyProgress', {});
    const key = `${result.schoolLevel}:${result.mapId}`;
    progress[key] = { score: Math.max(progress[key]?.score || 0, result.score), answered: Math.max(progress[key]?.answered || 0, result.answeredGates || 0), correct: Math.max(progress[key]?.correct || 0, result.correctAnswers), completedAt: Date.now() };
    writeStorage('journeyProgress', progress);
  }
  writeStorage('highScore', Math.max(readStorage('highScore', 0), result.score));
  const runs = readStorage('runs', []);
  writeStorage('runs', [result, ...runs.filter(run => run.runId !== result.runId)].slice(0, 30));
  const wrong = new Map(readStorage('review', []).map(row => [row._id, row]));
  result.wrongQuestions.forEach(row => wrong.set(row._id, { ...row, lastSeen: Date.now() }));
  writeStorage('review', [...wrong.values()].slice(-100));
}
