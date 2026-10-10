export const ADMIN_SOURCE = 'https://xaydungchinhsach.chinhphu.vn/chi-tiet-34-don-vi-hanh-chinh-cap-tinh-tu-12-6-2025-119250612141845533.htm';
export const ADMIN_DATE = '01/7/2025';
const groups = [
  ['Hà Nội'], ['Huế'], ['Lai Châu'], ['Điện Biên'], ['Sơn La'], ['Lạng Sơn'], ['Cao Bằng'], ['Thanh Hóa'], ['Nghệ An'], ['Hà Tĩnh'], ['Quảng Ninh'],
  ['Tuyên Quang', 'Tuyên Quang', 'Hà Giang'], ['Lào Cai', 'Lào Cai', 'Yên Bái'],
  ['Thái Nguyên', 'Thái Nguyên', 'Bắc Kạn'], ['Phú Thọ', 'Phú Thọ', 'Vĩnh Phúc', 'Hòa Bình'],
  ['Bắc Ninh', 'Bắc Ninh', 'Bắc Giang'], ['Hưng Yên', 'Hưng Yên', 'Thái Bình'],
  ['Hải Phòng', 'Hải Phòng', 'Hải Dương'], ['Ninh Bình', 'Ninh Bình', 'Hà Nam', 'Nam Định'],
  ['Quảng Trị', 'Quảng Trị', 'Quảng Bình'], ['Đà Nẵng', 'Đà Nẵng', 'Quảng Nam'],
  ['Quảng Ngãi', 'Quảng Ngãi', 'Kon Tum'], ['Gia Lai', 'Gia Lai', 'Bình Định'],
  ['Đắk Lắk', 'Đắk Lắk', 'Phú Yên'], ['Khánh Hòa', 'Khánh Hòa', 'Ninh Thuận'],
  ['Lâm Đồng', 'Lâm Đồng', 'Đắk Nông', 'Bình Thuận'], ['Đồng Nai', 'Đồng Nai', 'Bình Phước'],
  ['TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', 'Bình Dương', 'Bà Rịa - Vũng Tàu'],
  ['Tây Ninh', 'Tây Ninh', 'Long An'], ['Đồng Tháp', 'Đồng Tháp', 'Tiền Giang'],
  ['Vĩnh Long', 'Vĩnh Long', 'Bến Tre', 'Trà Vinh'], ['Cần Thơ', 'Cần Thơ', 'Sóc Trăng', 'Hậu Giang'],
  ['An Giang', 'An Giang', 'Kiên Giang'], ['Cà Mau', 'Cà Mau', 'Bạc Liêu'],
];
export function provinceKey(name) { return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/thua thien[ -]+hue/, 'hue').replace(/^(tp\.|thanh pho|tinh)\s+|\s+city$/g, '').replace(/[^a-z]/g, ''); }
export const PROVINCES = groups.map(([name, ...members]) => ({ id: provinceKey(name), name, members: members.length ? members : [name] }));
export const OLD_PROVINCES = PROVINCES.flatMap(group => group.members.map(name => ({ id: provinceKey(name), name, currentId: group.id })));
export function currentProvince(oldName) { return PROVINCES.find(group => group.members.some(name => provinceKey(name) === provinceKey(oldName))); }
export function provinceNote(name, era = '63') {
  const group = era === '34' ? PROVINCES.find(p => p.id === provinceKey(name)) : currentProvince(name);
  if (!group) return '';
  if (group.members.length === 1) return group.name === 'Huế' ? 'Huế không sáp nhập cấp tỉnh trong đợt sắp xếp năm 2025. Trước 01/01/2025, địa bàn này mang tên tỉnh Thừa Thiên Huế.' : `${group.name} không sáp nhập cấp tỉnh trong đợt sắp xếp năm 2025.`;
  const intro = era === '63' ? `${name} (trước sắp xếp) hiện thuộc ${group.name}. ` : '';
  return `${intro}${group.name} mới gồm ${group.members.join(' + ')} trước sắp xếp. Chính quyền mới hoạt động từ ${ADMIN_DATE}; Nghị quyết 202/2025/QH15 có hiệu lực từ 12/6/2025.`;
}
export const PROVINCE_MAPS = { caobang: ['map-01'], dienbien: ['map-02'], hanoi: ['map-03'], ninhbinh: ['map-04'], nghean: ['map-05'], hue: ['map-06'], quangnam: ['map-07'], hochiminh: ['map-08'] };
export function mapProvinceNote(mapId) { const old = OLD_PROVINCES.find(p => PROVINCE_MAPS[p.id]?.includes(mapId)); return old ? provinceNote(old.name) : ''; }
export function mapsForProvince(name, era) {
  const members = era === '34' ? PROVINCES.find(p => p.id === provinceKey(name))?.members || [] : [name];
  return [...new Set(members.flatMap(n => PROVINCE_MAPS[provinceKey(n)] || []))];
}
export function provinceQuiz(name, era) {
  const group = era === '34' ? PROVINCES.find(p => p.id === provinceKey(name)) : currentProvince(name);
  if (!group) return null;
  if (era === '34') {
    const answer = group.members.length > 1 ? group.members.join(' + ') : 'Không sáp nhập cấp tỉnh trong đợt năm 2025';
    const distractors = PROVINCES.filter(p => p.id !== group.id && p.members.length > 1).slice(0, 3).map(p => p.members.join(' + '));
    return { question: `${group.name} sau sắp xếp năm 2025 được hình thành như thế nào?`, answer, choices: [answer, ...distractors].sort((a, b) => a.localeCompare(b, 'vi')) };
  }
  const choices = [group.name, ...PROVINCES.filter(p => p.id !== group.id).slice(0, 3).map(p => p.name)].sort((a, b) => a.localeCompare(b, 'vi'));
  return { question: `Địa bàn ${name} trước sắp xếp hiện thuộc tỉnh/thành nào theo đợt sắp xếp năm 2025?`, answer: group.name, choices };
}
