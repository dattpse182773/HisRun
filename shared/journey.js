export const CURRICULUM = 'pre-2018';
export const SCHOOL_LEVELS = [
  { id: 'primary', name: 'Cấp 1', detail: 'Tiểu học · nền tảng lớp 4–5', grades: [4, 5], speed: 240 },
  { id: 'middle', name: 'Cấp 2', detail: 'THCS · lớp 6–9', grades: [6, 7, 8, 9], speed: 300 },
  { id: 'high', name: 'Cấp 3', detail: 'THPT · lớp 10–12', grades: [10, 11, 12], speed: 340 },
];
export const JOURNEY_MAPS = [
  { id: 'map-01', number: 1, name: 'Cao Bằng', region: 'Miền Bắc', latitude: 22.94, theme: 'mountain', color: '#477d65', distance: 500, title: 'Theo dấu chân về nguồn', landmarks: [{ id: 'pac-bo', name: 'Pác Bó', story: 'Giữa núi rừng biên giới, Pác Bó gắn với những ngày Nguyễn Ái Quốc trở về trực tiếp lãnh đạo cách mạng.' }] },
  { id: 'map-02', number: 2, name: 'Điện Biên', region: 'Miền Bắc', latitude: 21.38, theme: 'battlefield', color: '#748349', distance: 500, title: 'Âm vang một chiến thắng', landmarks: [{ id: 'dien-bien-phu', name: 'Chiến trường Điện Biên Phủ', story: 'Đồi A1 và thung lũng Mường Thanh lưu dấu chiến dịch Điện Biên Phủ, một bước ngoặt trong kháng chiến chống Pháp.' }] },
  { id: 'map-03', number: 3, name: 'Hà Nội', region: 'Miền Bắc', latitude: 21.03, theme: 'citadel', color: '#ad7848', distance: 500, title: 'Ngàn năm một kinh thành', landmarks: [{ id: 'thang-long', name: 'Hoàng thành Thăng Long', story: 'Từ quyết định dời đô của nhà Lý, Thăng Long trở thành trung tâm chính trị lâu dài trên đồng bằng sông Hồng.' }] },
  { id: 'map-04', number: 4, name: 'Ninh Bình', region: 'Miền Bắc', latitude: 20.28, theme: 'karst', color: '#648e80', distance: 500, title: 'Kinh đô giữa núi đá', landmarks: [{ id: 'hoa-lu', name: 'Cố đô Hoa Lư', story: 'Giữa địa hình núi đá vôi, Hoa Lư từng là kinh đô dưới các triều Đinh, Tiền Lê và những năm đầu nhà Lý.' }] },
  { id: 'map-05', number: 5, name: 'Nghệ An', region: 'Miền Trung', latitude: 18.68, theme: 'village', color: '#8b9652', distance: 500, title: 'Về thăm quê Bác', landmarks: [{ id: 'kim-lien', name: 'Khu di tích Kim Liên', story: 'Những mái nhà tranh ở Hoàng Trù và Làng Sen kể về quê hương, gia đình và thời niên thiếu của Chủ tịch Hồ Chí Minh.' }] },
  { id: 'map-06', number: 6, name: 'Huế', region: 'Miền Trung', latitude: 16.47, theme: 'imperial', color: '#966b64', distance: 500, title: 'Dấu xưa bên sông Hương', landmarks: [{ id: 'kinh-thanh-hue', name: 'Kinh thành Huế', story: 'Kinh thành, cung điện và dòng sông Hương tạo nên cảnh quan đặc trưng của kinh đô triều Nguyễn.' }] },
  { id: 'map-07', number: 7, name: 'Hội An', region: 'Miền Trung', latitude: 15.88, theme: 'port', color: '#c19243', distance: 500, title: 'Phố cổ, thuyền xưa', landmarks: [{ id: 'pho-co-hoi-an', name: 'Phố cổ Hội An', story: 'Những nếp nhà cổ ven sông Thu Bồn lưu dấu một thương cảng, nơi các nền văn hóa gặp gỡ qua hoạt động buôn bán.' }] },
  { id: 'map-08', number: 8, name: 'TP. Hồ Chí Minh', region: 'Miền Nam', latitude: 10.77, theme: 'saigon', color: '#be815b', distance: 700, title: 'Từ phố chợ tới bến tàu', landmarks: [{ id: 'ben-thanh', name: 'Chợ Bến Thành', story: 'Ngôi chợ với tháp đồng hồ là một dấu ấn giao thương của Sài Gòn đầu thế kỷ XX.' }, { id: 'ben-nha-rong', name: 'Bến Nhà Rồng', story: 'Bến cảng gắn với hành trình ra đi tìm đường cứu nước của Nguyễn Tất Thành, mở đầu một chặng đường lịch sử.' }] },
];
export function getMap(id) { return JOURNEY_MAPS.find(map => map.id === id) || JOURNEY_MAPS[0]; }
export function getSchool(id) { return SCHOOL_LEVELS.find(level => level.id === id) || SCHOOL_LEVELS[0]; }
export function checkpointsFor(mapId) {
  const map = getMap(mapId);
  return map.landmarks.flatMap((landmark, index) => [
    { landmarkId: landmark.id, name: landmark.name, subject: 'history', distance: 160 + index * 300 },
    { landmarkId: landmark.id, name: landmark.name, subject: 'geography', distance: 310 + index * 300 },
  ]);
}
export function nextMap(id) { const index = JOURNEY_MAPS.findIndex(map => map.id === id); return index >= 0 ? JOURNEY_MAPS[index + 1] || null : null; }
