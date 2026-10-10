import { EXPLORATION_MAPS } from '../../../shared/exploration.js';
import { ADMIN_SOURCE, provinceNote, PROVINCES } from '../../../shared/provinces.js';
import { readFileSync } from 'node:fs';
const legacy = JSON.parse(readFileSync(new URL('./questions/journey.json', import.meta.url), 'utf8'));
const heritage = 'https://dsvh.gov.vn/danh-muc-di-tich-quoc-gia-dac-biet-1752';
const legacyProvince = { caobang:'map-01', dienbien:'map-02', hanoi:'map-03', ninhbinh:'map-04', nghean:'map-05', hue:'map-06', danang:'map-07', hochiminh:'map-08' };
const tourism = 'https://vietnam.travel/vi/place-to-go';
const types = [...new Set(EXPLORATION_MAPS.map(p => p.kind))];
const terrains = [...new Set(EXPLORATION_MAPS.map(p => p.terrain))];
function choices(answer, pool) { return [answer, ...[...new Set(pool)].filter(s => s !== answer).slice(0, 3)]; }
export function provinceBank(id) {
  const p = EXPLORATION_MAPS.find(p => p.id === id); if (!p) return [];
  const others = EXPLORATION_MAPS.filter(q => q.id !== id);
  const membership = p.members.length > 1 ? p.members.join(' + ') : 'Không sáp nhập cấp tỉnh trong đợt 2025';
  const facts = [
    ['Địa giới 2025', `${p.name} được hình thành thế nào trong đợt sắp xếp cấp tỉnh năm 2025?`, membership, choices(membership, PROVINCES.filter(q => q.members.length > 1).map(q => q.members.join(' + '))), provinceNote(p.name, '34'), ADMIN_SOURCE],
    ['Địa danh lịch sử', `Trong chuyến khám phá ${p.name}, địa danh nào nằm trong địa bàn hiện nay?`, p.landmark, choices(p.landmark, others.map(q => q.landmark)), `${p.landmark} thuộc địa bàn ${p.oldProvince} trước sắp xếp, nay thuộc ${p.name}.`, tourism],
    ['Địa danh lịch sử', `${p.landmark} nằm trong tỉnh/thành nào sau sắp xếp 2025?`, p.name, choices(p.name, others.map(q => q.name)), provinceNote(p.oldProvince), ADMIN_SOURCE],
    ['Dấu mốc địa giới', `Trước đợt sắp xếp 2025, ${p.landmark} thuộc địa bàn nào?`, p.oldProvince, choices(p.oldProvince, others.map(q => q.oldProvince)), `Tên ${p.oldProvince} trong tài liệu cũ cần đối chiếu với địa bàn ${p.name} hiện nay.`, tourism],
    ['Di sản địa phương', `${p.landmark} là loại địa điểm nào?`, p.kind, choices(p.kind, types), `${p.landmark} là ${p.kind.toLowerCase()}, một điểm tìm hiểu về địa phương.`, tourism],
    ['Vị trí địa lý', `Theo cách chia ba miền dùng trong hành trình, ${p.name} ở miền nào?`, p.region, choices(p.region, ['Miền Bắc','Miền Trung','Miền Nam','Ngoài lãnh thổ Việt Nam']), `Map ${p.name} được xếp vào ${p.region}. Đây là cách chia ba miền, không phải danh mục vùng kinh tế.`, tourism],
    ['Địa hình', `Đặc điểm địa hình nào phù hợp với ${p.name} hiện nay?`, p.terrain, choices(p.terrain, ['Hoàn toàn băng vĩnh cửu','Toàn bộ là hoang mạc khô hạn','Chỉ có đảo san hô, không có đất liền']), `${p.name} có ${p.terrain.toLowerCase()}; địa hình không đồng nhất ở mọi nơi.`, tourism],
    ['Sông nước', `Sông hoặc vùng biển nào gắn với địa bàn ${p.name}?`, p.water, choices(p.water, ['Sông Nin','Sông Amazon','Sông Thames']), `${p.water} là một yếu tố địa lý của địa bàn; ba phương án còn lại nằm ngoài Việt Nam.`, tourism],
    ['Đối chiếu tư liệu', `Khi đọc tài liệu cũ ghi ${p.oldProvince} tại ${p.landmark}, nên đối chiếu map nào hiện nay?`, p.name, choices(p.name, others.map(q => q.name)), provinceNote(p.oldProvince), ADMIN_SOURCE],
    ['Đọc bản đồ', `Ở map ${p.name}, cặp địa danh – địa bàn trước sắp xếp nào đúng?`, `${p.landmark} – ${p.oldProvince}`, choices(`${p.landmark} – ${p.oldProvince}`, others.map(q => `${p.landmark} – ${q.oldProvince}`)), `Giữ tên lịch sử của địa danh, đồng thời ghi rõ địa bàn hiện nay là ${p.name}.`, tourism],
  ];
  if (p.members.length > 1) {
    facts.push(['Sắp xếp hành chính', `Chính quyền ${p.name} mới hoạt động từ ngày nào?`, '01/7/2025', ['01/7/2025','01/7/2024','01/01/2020','02/9/1945'], 'Phân biệt ngày hoạt động 01/7/2025 với ngày nghị quyết có hiệu lực 12/6/2025.', ADMIN_SOURCE]);
    facts.push(['Sắp xếp hành chính', `${p.name} mới gồm bao nhiêu tỉnh/thành trước sắp xếp?`, String(p.members.length), choices(String(p.members.length), ['1','2','3','4','5']), provinceNote(p.name, '34'), ADMIN_SOURCE]);
    facts.push(['Địa giới 2025', `Địa bàn nào sau đây được sắp xếp vào ${p.name}?`, p.members.at(-1), choices(p.members.at(-1), others.flatMap(q => q.members)), provinceNote(p.name, '34'), ADMIN_SOURCE]);
  } else {
    facts.push(['Địa giới 2025', `Nhận xét nào đúng về ${p.name} trong đợt sắp xếp cấp tỉnh 2025?`, 'Giữ nguyên, không sáp nhập cấp tỉnh', ['Giữ nguyên, không sáp nhập cấp tỉnh','Sáp nhập với Hà Nội','Sáp nhập với TP. Hồ Chí Minh','Sáp nhập với Cần Thơ'], provinceNote(p.name, '34'), ADMIN_SOURCE]);
    facts.push(['Địa giới 2025', `${p.name} thuộc nhóm nào theo Nghị quyết 202/2025/QH15?`, 'Nhóm 11 tỉnh/thành không sắp xếp', ['Nhóm 11 tỉnh/thành không sắp xếp','Nhóm đơn vị bị đổi thành huyện','Nhóm đơn vị hợp nhất ba tỉnh','Nhóm tỉnh ngoài Việt Nam'], provinceNote(p.name, '34'), ADMIN_SOURCE]);
  }
  if (id === 'danang' || id === 'khanhhoa') {
    const island = id === 'danang' ? 'Hoàng Sa' : 'Trường Sa';
    facts.push(['Biển đảo', `Quần đảo nào của Việt Nam gắn với địa bàn ${p.name}?`, island, choices(island, ['Hoàng Sa','Trường Sa','Hawaii','Canary']), `Quần đảo ${island} thuộc Việt Nam, gắn với ${p.name}.`, ADMIN_SOURCE]);
  }
  const extra = {
    laichau: ['Bia Lê Lợi ở Lai Châu gắn với vị vua nào?', 'Lê Thái Tổ', ['Lê Thái Tổ','Lý Thái Tổ','Trần Thái Tông','Gia Long'], 'Bia ghi dấu hoạt động của Lê Lợi ở Tây Bắc, được khắc năm Tân Hợi 1431.', 'https://laichau.gov.vn/?id=5faa5c46e13823554d0b9842&page=Article.Print.detail'],
    bacninh: ['Đền Đô ở Bắc Ninh thờ các vị vua của triều đại nào?', 'Nhà Lý', ['Nhà Lý','Nhà Nguyễn','Nhà Đinh','Nhà Hồ'], 'Đền Đô còn có tên Lý Bát Đế, gắn với các vị vua triều Lý.', 'https://vietnamtourism.gov.vn/post/61196'],
    angiang: ['Văn hóa Óc Eo ở An Giang gắn với vương quốc cổ nào?', 'Phù Nam', ['Phù Nam','Vạn Xuân','Đại Ngu','Đại Nam'], 'Di vật Óc Eo giúp tìm hiểu đời sống và giao thương của Phù Nam.', 'https://baotanglichsu.vn/vi/Articles/3101/71999/van-hoa-oc-eo-phu-nam-mot-thoang-nhin-lai-qua-suu-tap-hien-vat-trung-bay-tai-bao-tang-lich-su-quoc-gia.html'],
    camau: ['Nhạc sĩ Cao Văn Lầu, gắn với Bạc Liêu nay thuộc Cà Mau, sáng tác tác phẩm nào?', 'Dạ cổ hoài lang', ['Dạ cổ hoài lang','Bình Ngô đại cáo','Truyện Kiều','Chiếu dời đô'], 'Tác phẩm góp phần quan trọng vào sự phát triển nghệ thuật vọng cổ Nam Bộ.', 'https://scov.gov.vn/dat-nuoc-con-nguoi/dat-nuoc-viet-nam/ve-mien-cong-tu-bac-lieu-.html'],
  }[id];
  if (extra) { const [q,a,options,note,url] = extra; facts.push(['Lịch sử – văn hóa',q,a,options,note,url]); }
  const bank = facts.map(([topic, question, answer, answers, explanation, sourceUrl], i) => ({ id: `province-${id}-${i}`, provinceId: id, topic, question, answers, correctAnswer: answers.indexOf(answer), explanation, sourceUrl: sourceUrl === tourism && p.kind.startsWith('Di tích') ? heritage : sourceUrl, sourceTitle: sourceUrl === ADMIN_SOURCE ? 'Báo Chính phủ · Sắp xếp cấp tỉnh 2025' : 'Tài liệu tham khảo địa danh – di sản', sourceStatus: 'topic-reference', textbookVerified: false }));
  for (const q of legacy.filter(q => legacyProvince[id] && q.mapId === legacyProvince[id])) {
    if (!bank.some(row => row.question === q.question)) bank.push({ id:`province-${id}-legacy-${q.contentKey}`, provinceId:id, topic:q.topic, question:q.question, answers:q.answers, correctAnswer:q.correctAnswer, explanation:q.explanation, sourceUrl:q.sourceUrl, sourceTitle:q.sourceTitle, textbookVerified:false });
  }
  return bank;
}
