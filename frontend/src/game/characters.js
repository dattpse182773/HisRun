export const CHARACTER_ATLAS = '/assets/characters/zodiac-atlas.png';
export const ATLAS_SIZE = { width: 1536, height: 1024 };
export const REAR_ATLASES = ['/assets/characters/zodiac-rear-a.png', '/assets/characters/zodiac-rear-b.png'];
export function rearFrame(index, width = 1536, height = 1024) {
  const column = index % 8, row = Math.floor(index / 8);
  const columns = [0, 200, 395, 590, 779, 965, 1154, 1345, 1536], rows = [0, 355, 685, 1024];
  const x = Math.round(columns[column] * width / 1536), y = Math.round(rows[row] * height / 1024);
  return { x, y, width: Math.round(columns[column + 1] * width / 1536) - x, height: Math.round(rows[row + 1] * height / 1024) - y };
}
// Measured gutters from the generated atlas; rows are deliberately not equal height.
export function characterFrame(index) {
  const rows = [60, 390, 700, 1000], column = index % 8, row = Math.floor(index / 8);
  const edges = row === 1 ? [0, 196, 386, 578, 758, 962, 1154, 1346, 1536] : [0, 194, 386, 578, 770, 962, 1154, 1346, 1536];
  return { x: edges[column], y: rows[row], width: edges[column + 1] - edges[column], height: rows[row + 1] - rows[row] };
}
export const ZODIACS = [
  ['ty', 'Tý', 'Chuột'], ['suu', 'Sửu', 'Trâu'], ['dan', 'Dần', 'Hổ'], ['mao', 'Mão', 'Mèo'],
  ['thin', 'Thìn', 'Rồng'], ['ti', 'Tỵ', 'Rắn'], ['ngo', 'Ngọ', 'Ngựa'], ['mui', 'Mùi', 'Dê'],
  ['than', 'Thân', 'Khỉ'], ['dau', 'Dậu', 'Gà'], ['tuat', 'Tuất', 'Chó'], ['hoi', 'Hợi', 'Lợn'],
].map(([id, name, animal], index) => ({ id, name, animal, index }));
export const CHARACTERS = ZODIACS.flatMap(zodiac => ['nam', 'nu'].map((variant, index) => ({
  id: `${zodiac.id}-${variant}`, zodiac: zodiac.id, name: `${zodiac.name} · ${variant === 'nam' ? 'Nam' : 'Nữ'}`,
  animal: zodiac.animal, variant, frame: zodiac.index * 2 + index,
})));
export function getCharacter(id) { return CHARACTERS.find(character => character.id === id) || CHARACTERS[0]; }
