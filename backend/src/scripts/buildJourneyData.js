import { writeFile } from 'node:fs/promises';
import { JOURNEY_MAPS } from '../../../shared/journey.js';

// Original questions, not copied textbook passages. The grade field is suggested,
// while schoolLevel is the actual gameplay filter. Exact textbook edition is unverified.
const sources = {
  pacbo: ['Cục Di sản văn hóa · Pác Bó', 'https://dsvh.gov.vn/di-tich-lich-su-pac-bo-2950'],
  caobang: ['Báo Chính phủ · Cao Bằng và cách mạng', 'https://baochinhphu.vn/cao-bang-vung-buoc-tren-con-duong-cach-mang-ma-dang-va-bac-ho-da-lua-chon-10259924.htm'],
  dienbien: ['Bảo tàng Chiến thắng Điện Biên Phủ', 'https://btctdbp.svhttdl.dienbien.gov.vn/portal/pages/2021-5-7/Chien-dich-Dien-Bien-Phu--Moc-vang-trong-lich-su-cz7od4fe8gt9z.aspx'],
  taybac: ['Cục Du lịch Quốc gia Việt Nam · Điện Biên', 'https://vietnamtourism.gov.vn/printer/55406?type=1'],
  thanglong: ['Trung tâm bảo tồn di sản Thăng Long · Kinh đô mãi muôn đời', 'https://hoangthanhthanglong.com/2020/10/08/trien-lam-kinh-do-mai-muon-doi-tai-hoang-thanh-thang-long/'],
  hanoi: ['UNESCO · Hoàng thành Thăng Long', 'https://whc.unesco.org/en/list/1328/'],
  hoalu: ['Cổng thông tin Ninh Bình · Lễ hội Hoa Lư', 'https://dinhhoa.ninhbinh.gov.vn/tin-tuc-trong-huyen/to-chuc-le-hoi-hoa-lu-voi-vi-the-la-di-san-van-hoa-phi-vat-the-quoc-gia-772.html'],
  trangan: ['UNESCO · Quần thể danh thắng Tràng An', 'https://whc.unesco.org/en/list/1438/'],
  kimlien: ['Du lịch Nghệ An · Khu lưu niệm Kim Liên', 'https://visitnghean.gov.vn/diem-tham-quan/khu-luu-niem-chu-tich-ho-chi-minh-tai-kim-lien'],
  nghean: ['Du lịch Nghệ An · Tổng quan', 'https://visitnghean.gov.vn/tong-quan-ve-nghe-an'],
  hue: ['UNESCO · Quần thể di tích Cố đô Huế', 'https://whc.unesco.org/en/list/678/'],
  hoian: ['UNESCO · Phố cổ Hội An', 'https://whc.unesco.org/en/list/948/'],
  benthanh: ['Ban quản lý Chợ Bến Thành · Lịch sử chợ', 'https://benthanhmarket.vn/about/gioi-thieu-ve-cho-ben-thanh.html'],
  nharong: ['Cục Du lịch Quốc gia Việt Nam · Bến Nhà Rồng', 'https://vietnamtourism.vn/index.php/tourism/items/2925/3'],
};
// Each row: school, subject, question, four options, correct index, explanation, source.
const places = [
  ['map-01', 'pac-bo', [
    ['primary','history','Pác Bó gắn với hoạt động của vị lãnh tụ nào?',['Hồ Chí Minh','Lý Thái Tổ','Đinh Tiên Hoàng','Quang Trung'],0,'Pác Bó gắn với thời gian Bác Hồ về nước lãnh đạo cách mạng.','pacbo'],
    ['primary','geography','Pác Bó nằm ở tỉnh nào?',['Nghệ An','Cao Bằng','Ninh Bình','Quảng Nam'],1,'Khu di tích Pác Bó ở Cao Bằng, miền Bắc Việt Nam.','pacbo'],
    ['middle','history','Nguyễn Ái Quốc trở về nước tại Cao Bằng vào năm nào?',['1911','1930','1941','1954'],2,'Người về nước ngày 28/1/1941, rồi hoạt động tại Pác Bó.','caobang'],
    ['middle','geography','Cao Bằng, nơi có Pác Bó, giáp quốc gia nào?',['Lào','Campuchia','Thái Lan','Trung Quốc'],3,'Cao Bằng có đường biên giới với Trung Quốc.','caobang'],
    ['high','history','Hội nghị Trung ương 8 tại Pác Bó năm 1941 quyết định thành lập tổ chức nào?',['Mặt trận Việt Minh','Hội Quốc Liên','ASEAN','Liên Hợp Quốc'],0,'Hội nghị quyết định thành lập Mặt trận Việt Minh, tập hợp lực lượng giải phóng dân tộc.','pacbo'],
    ['high','geography','Địa thế biên giới của Cao Bằng tạo thuận lợi nào cho căn cứ Pác Bó?',['Xây cảng biển sâu','Liên lạc quốc tế và mở rộng căn cứ','Trồng cây ôn đới trên băng','Phát triển đánh cá xa bờ'],1,'Núi rừng và vị trí giáp Trung Quốc hỗ trợ liên lạc, phát triển căn cứ.','caobang'],
  ]],
  ['map-02', 'dien-bien-phu', [
    ['primary','history','Chiến thắng Điện Biên Phủ diễn ra năm nào?',['1945','1975','1954','1986'],2,'Chiến dịch Điện Biên Phủ kết thúc thắng lợi ngày 7/5/1954.','dienbien'],
    ['primary','geography','Điện Biên nằm ở miền nào của Việt Nam?',['Miền Trung','Miền Nam','Vùng biển phía Nam','Miền Bắc'],3,'Điện Biên nằm ở Tây Bắc, thuộc miền Bắc.','taybac'],
    ['middle','history','Đồi A1 là một di tích gắn với chiến dịch nào?',['Điện Biên Phủ','Hồ Chí Minh','Tây Nguyên năm 1975','Huế – Đà Nẵng năm 1975'],0,'Đồi A1 là cứ điểm quan trọng trong chiến dịch Điện Biên Phủ.','dienbien'],
    ['middle','geography','Địa hình nào tiêu biểu cho tỉnh Điện Biên?',['Đồng bằng ven biển','Miền núi Tây Bắc','Đảo san hô','Hoang mạc cát'],1,'Điện Biên là tỉnh miền núi ở Tây Bắc.','taybac'],
    ['high','history','Ngày 13/3/1954 tại Điện Biên Phủ đánh dấu sự kiện nào?',['Kết thúc chiến dịch','Ký Hiệp định Paris','Mở màn chiến dịch','Đọc Tuyên ngôn Độc lập'],2,'Chiến dịch mở màn ngày 13/3/1954 bằng đợt tiến công các cứ điểm.','dienbien'],
    ['high','geography','Điện Biên có biên giới với cặp quốc gia nào?',['Lào và Campuchia','Trung Quốc và Thái Lan','Campuchia và Trung Quốc','Lào và Trung Quốc'],3,'Điện Biên tiếp giáp Lào và Trung Quốc.','taybac'],
  ]],
  ['map-03', 'thang-long', [
    ['primary','history','Vị vua nào dời đô về Đại La và đổi tên thành Thăng Long?',['Lý Công Uẩn','Trần Nhân Tông','Quang Trung','Gia Long'],0,'Năm 1010, Lý Công Uẩn dời đô về Đại La, đặt tên Thăng Long.','thanglong'],
    ['primary','geography','Hoàng thành Thăng Long nằm ở thành phố nào?',['Huế','Hà Nội','Đà Nẵng','TP. Hồ Chí Minh'],1,'Hoàng thành Thăng Long nằm tại Hà Nội.','hanoi'],
    ['middle','history','Năm nào nhà Lý dời đô từ Hoa Lư ra Thăng Long?',['938','968','1010','1802'],2,'Cuộc dời đô của Lý Công Uẩn diễn ra năm 1010.','thanglong'],
    ['middle','geography','Thăng Long hình thành trên vùng đồng bằng nào?',['Đồng bằng sông Cửu Long','Đồng bằng duyên hải miền Trung','Đồng bằng sông Mã','Đồng bằng sông Hồng'],3,'Thăng Long gắn với không gian đồng bằng sông Hồng.','hanoi'],
    ['high','history','Việc dời đô năm 1010 nối tiếp kinh đô nào trước đó?',['Hoa Lư','Phú Xuân','Cổ Loa thời Âu Lạc','Huế thời Nguyễn'],0,'Lý Công Uẩn chuyển kinh đô từ Hoa Lư sang Đại La – Thăng Long.','thanglong'],
    ['high','geography','Vị trí đồng bằng của Thăng Long thuận lợi hơn núi cao cho hoạt động nào?',['Khai thác băng tuyết','Giao thông và tập trung dân cư','Nuôi cá biển xa bờ','Trồng cây trên hoang mạc'],1,'Vận dụng: địa hình đồng bằng thuận lợi cho giao thông, cư trú và phát triển đô thị.','hanoi'],
  ]],
  ['map-04', 'hoa-lu', [
    ['primary','history','Hoa Lư từng là nơi nào của nước ta?',['Một cảng biển','Một sân bay','Kinh đô','Một đảo xa bờ'],2,'Hoa Lư từng là kinh đô trước khi dời đô ra Thăng Long.','hoalu'],
    ['primary','geography','Cố đô Hoa Lư nằm ở địa danh nào?',['Cao Bằng','Nghệ An','Hội An','Ninh Bình'],3,'Hoa Lư thuộc Ninh Bình, trong không gian di sản Tràng An.','trangan'],
    ['middle','history','Hai triều đại nào gắn với kinh đô Hoa Lư trước nhà Lý?',['Đinh và Tiền Lê','Trần và Hồ','Mạc và Tây Sơn','Nguyễn và Trần'],0,'Hoa Lư là kinh đô thời Đinh, Tiền Lê và buổi đầu nhà Lý.','hoalu'],
    ['middle','geography','Loại đá tạo nên địa hình núi và hang động nổi bật quanh Hoa Lư – Tràng An là gì?',['Đá bazan','Đá vôi','Than đá','Muối mỏ'],1,'Tràng An nổi bật với địa hình karst trên đá vôi.','trangan'],
    ['high','history','Khoảng thời gian nào gắn với vai trò kinh đô của Hoa Lư?',['1802–1945','1945–1954','968–1010','1428–1789'],2,'Hoa Lư giữ vai trò kinh đô trong giai đoạn 968–1010.','hoalu'],
    ['high','geography','Hệ thống hang và sông ngầm ở Tràng An tiêu biểu cho dạng địa hình nào?',['Băng hà','Cồn cát','Núi lửa đang hoạt động','Karst'],3,'Núi đá vôi, hang động và dòng chảy ngầm là đặc trưng karst.','trangan'],
  ]],
  ['map-05', 'kim-lien', [
    ['primary','history','Khu di tích Kim Liên gắn với tuổi thơ của ai?',['Chủ tịch Hồ Chí Minh','Vua Quang Trung','Vua Lý Thái Tổ','Trần Hưng Đạo'],0,'Kim Liên lưu giữ dấu tích quê hương và tuổi thơ của Bác Hồ.','kimlien'],
    ['primary','geography','Kim Liên nằm ở tỉnh nào?',['Cao Bằng','Nghệ An','Ninh Bình','Điện Biên'],1,'Khu di tích Kim Liên nằm ở Nghệ An.','kimlien'],
    ['middle','history','Làng nào trong khu di tích Kim Liên là nơi Bác Hồ chào đời?',['Làng Vạn Phúc','Làng Đông Hồ','Làng Hoàng Trù','Làng Bát Tràng'],2,'Bác Hồ sinh ở làng Hoàng Trù ngày 19/5/1890.','kimlien'],
    ['middle','geography','Theo cách phân vùng trong chương trình cũ, Nghệ An thuộc vùng nào?',['Đông Nam Bộ','Tây Nguyên','Đồng bằng sông Cửu Long','Bắc Trung Bộ'],3,'Nghệ An thuộc Bắc Trung Bộ.','nghean'],
    ['high','history','Tên thuở nhỏ của Chủ tịch Hồ Chí Minh là gì?',['Nguyễn Sinh Cung','Nguyễn Trãi','Nguyễn Du','Nguyễn Bỉnh Khiêm'],0,'Nguyễn Sinh Cung là tên của Bác Hồ thuở nhỏ.','kimlien'],
    ['high','geography','Khai thác giá trị Kim Liên phù hợp nhất với loại hình du lịch nào?',['Du lịch trượt tuyết','Du lịch văn hóa – lịch sử','Du lịch sa mạc','Du lịch lặn biển'],1,'Vận dụng: di tích quê hương và tuổi thơ là tài nguyên du lịch văn hóa – lịch sử.','nghean'],
  ]],
  ['map-06', 'kinh-thanh-hue', [
    ['primary','history','Kinh thành Huế gắn với triều đại nào?',['Nhà Trần','Nhà Đinh','Nhà Nguyễn','Nhà Hồ'],2,'Huế là kinh đô của triều Nguyễn.','hue'],
    ['primary','geography','Dòng sông nào gắn với cảnh quan Kinh thành Huế?',['Sông Hồng','Sông Đà','Sông Tiền','Sông Hương'],3,'Sông Hương chảy qua Huế, góp phần tạo nên cảnh quan cố đô.','hue'],
    ['middle','history','Huế trở thành kinh đô triều Nguyễn từ năm nào?',['1802','1010','938','1954'],0,'Triều Nguyễn đặt kinh đô tại Huế từ năm 1802.','hue'],
    ['middle','geography','Cố đô Huế nằm ở miền nào?',['Miền Bắc','Miền Trung','Miền Nam','Ngoài lãnh thổ Việt Nam'],1,'Huế nằm ở miền Trung Việt Nam.','hue'],
    ['high','history','Triều Nguyễn đặt kinh đô tại Huế trong giai đoạn nào?',['968–1010','1428–1527','1802–1945','1945–1975'],2,'Huế là kinh đô triều Nguyễn từ 1802 đến 1945.','hue'],
    ['high','geography','Nhận định nào đúng về cảnh quan di sản Huế?',['Chỉ có công trình nhân tạo','Không gắn với sông núi','Là cảnh quan băng hà','Kết hợp kiến trúc với sông núi'],3,'Di sản Huế kết hợp kiến trúc với sông Hương, núi Ngự Bình và cảnh quan tự nhiên.','hue'],
  ]],
  ['map-07', 'pho-co-hoi-an', [
    ['primary','history','Hội An xưa nổi tiếng là nơi nào?',['Thương cảng','Kinh đô triều Nguyễn','Căn cứ trên núi cao','Mỏ than'],0,'Hội An từng là thương cảng giao thương với nhiều vùng đất.','hoian'],
    ['primary','geography','Phố cổ Hội An gắn với dòng sông nào?',['Sông Đà','Sông Thu Bồn','Sông Mã','Sông Bạch Đằng'],1,'Phố cổ Hội An nằm bên sông Thu Bồn.','hoian'],
    ['middle','history','Vai trò lịch sử nổi bật của Hội An là gì?',['Trung tâm luyện thép','Căn cứ không quân','Trung tâm giao thương quốc tế','Kinh đô nhà Đinh'],2,'Hội An là cảng buôn bán quốc tế, nơi giao lưu nhiều nền văn hóa.','hoian'],
    ['middle','geography','Trong bối cảnh địa danh trước năm 2018, Hội An thuộc tỉnh nào?',['Nghệ An','Ninh Bình','Cao Bằng','Quảng Nam'],3,'Theo địa giới thời kỳ chương trình cũ, Hội An thuộc Quảng Nam.','hoian'],
    ['high','history','Kiến trúc Hội An phản ánh điều gì từ lịch sử thương cảng?',['Giao lưu văn hóa bản địa và bên ngoài','Sự biệt lập hoàn toàn','Chỉ ảnh hưởng văn hóa băng tuyết','Không có giao thương'],0,'Thương cảng giúp các yếu tố văn hóa bản địa và nước ngoài gặp gỡ.','hoian'],
    ['high','geography','Vị trí gần cửa sông Thu Bồn thuận lợi cho Hội An xưa ở điểm nào?',['Khai thác dầu trên núi','Vận chuyển hàng hóa bằng thuyền','Nuôi tuần lộc','Sản xuất băng nhân tạo'],1,'Vận dụng: gần cửa sông giúp kết nối đường thủy và trao đổi hàng hóa.','hoian'],
  ]],
  ['map-08', 'ben-thanh', [
    ['primary','history','Chợ Bến Thành là dấu ấn lịch sử nổi tiếng của đô thị nào?',['Hà Nội','Huế','Sài Gòn','Điện Biên'],2,'Chợ Bến Thành gắn với lịch sử đô thị Sài Gòn.','benthanh'],
    ['primary','geography','Hoạt động chính ở Chợ Bến Thành là gì?',['Trồng rừng','Khai thác than','Đánh cá ngoài biển','Mua bán hàng hóa'],3,'Chợ là nơi trao đổi, mua bán hàng hóa.','benthanh'],
    ['middle','history','Ngôi chợ Bến Thành ở vị trí hiện nay được xây xong năm nào?',['1914','1010','1802','1975'],0,'Ngôi chợ mới được xây từ 1913 và hoàn thành năm 1914.','benthanh'],
    ['middle','geography','Hoạt động thương mại tại Chợ Bến Thành thuộc khu vực kinh tế nào?',['Nông nghiệp','Dịch vụ','Lâm nghiệp','Khai khoáng'],1,'Buôn bán hàng hóa là hoạt động thương mại thuộc khu vực dịch vụ.','benthanh'],
    ['high','history','Mốc 1914 của Chợ Bến Thành nên hiểu chính xác là gì?',['Lần đầu có mọi hoạt động buôn bán tại Sài Gòn','Năm thành lập triều Nguyễn','Năm hoàn thành ngôi chợ mới tại vị trí hiện nay','Năm Bác Hồ ra đi tìm đường cứu nước'],2,'Mốc 1914 nói về ngôi chợ mới; lịch sử chợ trước đó có các vị trí khác.','benthanh'],
    ['high','geography','Giữ chợ truyền thống giữa đô thị góp phần kết hợp những chức năng nào?',['Chỉ sản xuất nông nghiệp','Chỉ khai khoáng','Chỉ quốc phòng','Thương mại và du lịch văn hóa'],3,'Vận dụng: chợ phục vụ mua bán, đồng thời lưu giữ bản sắc đô thị để khách tham quan tìm hiểu.','benthanh'],
  ]],
  ['map-08', 'ben-nha-rong', [
    ['primary','history','Ai ra đi tìm đường cứu nước từ Bến Nhà Rồng?',['Nguyễn Tất Thành','Lý Công Uẩn','Đinh Bộ Lĩnh','Nguyễn Trãi'],0,'Nguyễn Tất Thành ra đi tìm đường cứu nước từ Bến Nhà Rồng.','nharong'],
    ['primary','geography','Từ Bến Nhà Rồng năm 1911, Nguyễn Tất Thành ra đi bằng phương tiện nào?',['Máy bay','Tàu thủy','Tàu hỏa','Ô tô'],1,'Người rời bến trên một con tàu thủy.','nharong'],
    ['middle','history','Ngày nào gắn với việc Nguyễn Tất Thành rời Bến Nhà Rồng?',['2/9/1945','7/5/1954','5/6/1911','30/4/1975'],2,'Ngày 5/6/1911, Nguyễn Tất Thành rời Bến Nhà Rồng để tìm đường cứu nước.','nharong'],
    ['middle','geography','Bến Nhà Rồng nằm ở thành phố nào?',['Hà Nội','Huế','Hội An','TP. Hồ Chí Minh'],3,'Bến Nhà Rồng nằm tại TP. Hồ Chí Minh, trước đây là Sài Gòn.','nharong'],
    ['high','history','Mục đích chính của Nguyễn Tất Thành khi rời Bến Nhà Rồng là gì?',['Tìm con đường giải phóng dân tộc','Xây dựng kinh đô mới','Mở một triều đại phong kiến','Chỉ tham quan thắng cảnh'],0,'Người ra đi nhằm tìm đường cứu nước, giải phóng dân tộc.','nharong'],
    ['high','geography','Một bến cảng như Nhà Rồng phục vụ trực tiếp loại hình giao thông nào?',['Đường hàng không','Đường thủy','Đường sắt trên cao','Đường ống'],1,'Bến cảng tiếp nhận tàu, gắn với giao thông đường thủy.','nharong'],
  ]],
];
const rows = places.flatMap(([mapId, landmarkId, questions]) => questions.map(([schoolLevel, subject, question, answers, correctAnswer, explanation, sourceKey]) => {
  const map = JOURNEY_MAPS.find(item => item.id === mapId); const landmark = map.landmarks.find(item => item.id === landmarkId);
  const [sourceTitle, sourceUrl] = sources[sourceKey];
  return { contentKey: `journey-v1:${landmarkId}:${schoolLevel}:${subject}`, curriculum: 'pre-2018', schoolLevel, mapId, landmarkId, subject, grade: { primary: 5, middle: 9, high: 12 }[schoolLevel], difficulty: { primary: 1, middle: 2, high: 3 }[schoolLevel], topic: landmark.name, chapter: `${map.name} · ${subject === 'history' ? 'Lịch sử địa phương và dân tộc' : 'Địa lý tự nhiên, dân cư và kinh tế'}`, question, answers, correctAnswer, explanation, source: 'Câu tự biên soạn theo chủ đề chương trình trước 2018; chưa đối chiếu từng bài SGK.', sourceTitle, sourceUrl, textbookVerified: false, active: true };
}));
await writeFile(new URL('../data/questions/journey.json', import.meta.url), JSON.stringify(rows, null, 2) + '\n');
console.log(`Wrote ${rows.length} original, sourced journey questions.`);
