const baseUrl = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '')).replace(/\/$/, '');

async function request(path, { signal, ...options } = {}) {
  if (!baseUrl) throw new Error('Bản online chưa kết nối máy chủ dữ liệu.');
  const timeout = AbortSignal.timeout(6000);
  const response = await fetch(`${baseUrl}${path}`, { ...options, signal: signal ? AbortSignal.any([signal, timeout]) : timeout, headers: { 'Content-Type': 'application/json', ...options.headers } });
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || 'Chưa thể kết nối máy chủ.');
    error.data = data;
    error.status = response.status;
    throw error;
  }
  return data;
}
const queryString = filters => new URLSearchParams(Object.entries(filters).filter(([, value]) => value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0)).map(([key, value]) => [key, Array.isArray(value) ? value.join(',') : value])).toString();
export const api = {
  examCatalog: signal => request('/exams/catalog', { signal }),
  startExam: data => request('/exams', { method: 'POST', body: JSON.stringify(data) }),
  answerExam: (token, index, answer) => request(`/exams/${encodeURIComponent(token)}/answer`, { method: 'POST', body: JSON.stringify({ index, answer }) }),
  submitExam: (token, data) => request(`/exams/${encodeURIComponent(token)}/submit`, { method: 'POST', body: JSON.stringify(data) }),
  examRanking: signal => request('/exams/ranking', { signal }),
  health: signal => request('/health', { signal }),
  questions: (filters = {}, signal) => request(`/questions?${queryString(filters)}`, { signal }),
  randomQuestion: (filters = {}, signal) => request(`/questions/random?${queryString(filters)}`, { signal }),
  answer: (id, answer, signal) => request(`/questions/${encodeURIComponent(id)}/answer`, { method: 'POST', body: JSON.stringify({ answer }), signal }),
  createPlayer: username => request('/users', { method: 'POST', body: JSON.stringify({ username }) }),
  player: (id, signal) => request(`/users/${encodeURIComponent(id)}`, { signal }),
  leaderboard: (metric = 'score', signal, mode) => request(`/leaderboard/${encodeURIComponent(metric)}?${queryString({mode})}`, { signal }),
  saveResult: (result, player) => request('/game-results', { method: 'POST', headers: { Authorization: `Bearer ${player.token}` }, body: JSON.stringify({ ...result, playerId: player._id, distance: Math.floor(result.distance), score: Math.floor(result.score) }) }),
};
