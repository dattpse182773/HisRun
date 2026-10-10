export const TOKENS = {
  shield: { name: 'Khiên', icon: '◇', color: '#5c9da9', detail: 'Chặn một lần va chạm.' },
  magnet: { name: 'Nam châm', icon: 'U', color: '#d17b62', seconds: 10, detail: 'Hút vàng ở cả ba làn trong 10 giây.' },
  clock: { name: 'Chạy chậm', icon: '◷', color: '#718fc6', seconds: 8, detail: 'Chạy ở 65% tốc độ trong 8 giây; thay thế tăng tốc.' },
  boost: { name: 'Chạy nhanh', icon: '»', color: '#419a82', seconds: 6, detail: 'Tăng tốc 30% trong 6 giây, tối đa 460; thay thế chạy chậm.' },
  doubleCoin: { name: 'Vàng ×2', icon: '×2', color: '#d39b26', seconds: 10, detail: 'Mỗi đồng vàng trên đường được tính 2 xu trong 10 giây.' },
  book: { name: 'Sách tri thức', icon: '▤', color: '#bd974b', seconds: 10, detail: 'Nhân đôi điểm câu hỏi thường trong 10 giây.' },
  heart: { name: 'Trống đồng', icon: '✺', color: '#db8181', detail: 'Hồi một mạng, tối đa 3 mạng.' },
  challenge: { name: 'Câu hỏi khó', icon: '?', color: '#8863b3', detail: 'Câu ngoài địa danh đang chạy, 20 giây: đúng +200 điểm, sai/hết giờ −50 điểm. Có thể bỏ qua.' },
  penalty: { name: 'Trừ điểm', icon: '−100', color: '#ae5350', harmful: true, detail: 'Trừ tối đa 100 điểm; điểm không âm. Đổi làn để tránh.' },
  rewind: { name: 'Lùi bước', icon: '−20m', color: '#a36583', harmful: true, detail: 'Lùi tối đa 20 mét; không lặp lại cổng kiến thức đã gặp.' },
};
export const TIMED_POWERS = Object.keys(TOKENS).filter(key => TOKENS[key].seconds);
export function effectiveSpeed(state) { return Math.min(460, state.speed * (state.powers.boost > 0 ? 1.3 : 1)) * (state.powers.clock > 0 ? .65 : 1); }
export function coinValue(state) { return state.powers.doubleCoin > 0 ? 2 : 1; }
export function deductPoints(state, amount) {
  const available = Math.max(0, Math.floor(state.distance) + state.coins * 10 + state.questionPoints - (state.penalties || 0));
  const deducted = Math.min(amount, available); state.penalties = (state.penalties || 0) + deducted; return deducted;
}
export function collectToken(state, kind) {
  const token = TOKENS[kind]; if (!token) return null;
  state.tokensCollected = (state.tokensCollected || 0) + 1;
  if (kind === 'heart') { state.health = Math.min(3, state.health + 1); return 'Trống đồng · hồi 1 mạng (tối đa 3)'; }
  if (kind === 'penalty') return `Trừ ${deductPoints(state, 100)} điểm`;
  if (kind === 'rewind') { const metres = Math.min(20, state.distance); state.distance = Math.max(0, state.distance - metres); return `Lùi ${Math.round(metres)} mét`; }
  if (kind === 'challenge') return 'Thử thách ngoài lề';
  if (kind === 'boost') state.powers.clock = 0;
  if (kind === 'clock') state.powers.boost = 0;
  state.powers[kind] = token.seconds || 1;
  return `${token.name}${token.seconds ? ` · ${token.seconds} giây` : ' đã sẵn sàng'}`;
}
// No token shares an obstacle lane: the player always has a chance to see it and
// dodge harmful ones. Rotation guarantees all types appear during long runs.
export const TOKEN_ROTATION = ['boost', 'doubleCoin', 'clock', 'challenge', 'shield', 'penalty', 'magnet', 'rewind', 'heart', 'book'];
