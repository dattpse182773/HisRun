const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

async function request(path, { signal, ...options } = {}) {
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
  health: signal => request('/health', { signal }),
  questions: (filters = {}, signal) => request(`/questions?${queryString(filters)}`, { signal }),
  randomQuestion: (filters = {}, signal) => request(`/questions/random?${queryString(filters)}`, { signal }),
  answer: (id, answer, signal) => request(`/questions/${encodeURIComponent(id)}/answer`, { method: 'POST', body: JSON.stringify({ answer }), signal }),
  createPlayer: username => request('/users', { method: 'POST', body: JSON.stringify({ username }) }),
  player: (id, signal) => request(`/users/${encodeURIComponent(id)}`, { signal }),
  leaderboard: (metric = 'score', signal) => request(`/leaderboard/${encodeURIComponent(metric)}`, { signal }),
  saveResult: (result, player) => request('/game-results', { method: 'POST', headers: { Authorization: `Bearer ${player.token}` }, body: JSON.stringify({ ...result, playerId: player._id, distance: Math.floor(result.distance), score: Math.floor(result.score) }) }),
};
