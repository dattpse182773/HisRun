// Original short practice questions, not verbatim copies of examination papers.
// Source coverage is partial; see docs/question-bank-status.md.
const sources = {
  4: 'https://www.scribd.com/document/917308290/Tom-T%E1%BA%AFt-Ki%E1%BA%BFn-Th%E1%BB%A9c-L%E1%BB%8Bch-S%E1%BB%AD-L%E1%BB%9Bp-4-Ghi-Vo-Vo',
  6: 'https://thuviendethi.com/bo-de-kiem-tra-lich-su-6-ca-nam-9302/',
  7: 'https://thuviendethi.com/kiem-tra-hoc-ki-i-mon-lich-su-7-thoi-gian-45-phut-2835/',
  8: 'https://thuviendethi.com/de-va-dap-an-thi-chon-hoc-sinh-gioi-lich-su-lop-8-de-so-5-phong-gd-dt-thuy-nguyen-31562/',
  9: 'https://thuviendethi.com/de-kiem-tra-mot-tiet-lich-su-lop-9-nam-hoc-2016-2017-truong-thcs-tan-tien-31692/',
  10: 'https://thuviendethi.com/de-thi-mon-lich-su-10-thoi-gian-lam-bai-180-phut-khong-ke-thoi-gian-phat-de-3461/',
  11: 'https://thuviendethi.com/de-kiem-tra-1-tiet-bai-viet-so-2-nam-hoc-2014-2015-mon-lich-su-11-3436/',
  12: 'https://vnuf2.edu.vn/vi/attachments/article/2232/T%C3%93M%20T%E1%BA%AET%20L%C3%9D%20THUY%E1%BA%BET%20L%E1%BB%8ACH%20S%E1%BB%AC%2012.pdf',
};
sources[5] = sources[4];
// Each record: topic | prompt | correct answer | three distractors | short teaching note.
const facts = {
4: `Dựng nước|Người đứng đầu nước Văn Lang được gọi là gì?|Hùng Vương|Lê Thánh Tông|Quang Trung|Gia Long|Văn Lang gắn với thời đại các vua Hùng.
Dựng nước|Cổ Loa là kinh đô của nước nào?|Âu Lạc|Đại Việt|Đại Nam|Vạn Xuân|An Dương Vương xây thành Cổ Loa để bảo vệ Âu Lạc.
Dựng nước|Nghề nào giữ vai trò quan trọng trong đời sống cư dân Văn Lang?|Trồng lúa nước|Lắp ráp ô tô|Khai thác dầu ngoài khơi|Chế tạo máy bay|Lúa nước gắn với đời sống định cư của cư dân Việt cổ.
Dựng nước|Trống đồng giúp chúng ta tìm hiểu điều gì?|Đời sống người Việt cổ|Thời tiết ngày mai|Lịch bay hiện đại|Giá cả tuần tới|Hoa văn và hiện vật là dấu vết về đời sống quá khứ.
Giành độc lập|Ai lãnh đạo chiến thắng Bạch Đằng năm 938?|Ngô Quyền|Lý Công Uẩn|Lê Lợi|Nguyễn Huệ|Chiến thắng kết thúc thời Bắc thuộc, mở thời kỳ độc lập lâu dài.
Buổi đầu độc lập|Ai dẹp loạn mười hai sứ quân?|Đinh Bộ Lĩnh|Trần Nhân Tông|Nguyễn Trãi|Lý Bí|Thống nhất các lực lượng cát cứ giúp củng cố đất nước.
Buổi đầu độc lập|Kinh đô thời Đinh đặt ở đâu?|Hoa Lư|Hội An|Phú Xuân|Cổ Loa|Hoa Lư là trung tâm chính trị thời Đinh và Tiền Lê.
Nhà Lý|Vị vua nào quyết định dời đô năm 1010?|Lý Công Uẩn|Gia Long|Đinh Tiên Hoàng|Trần Thái Tông|Đại La được đổi tên thành Thăng Long sau khi dời đô.
Nhà Lý|Tên Thăng Long gắn với đô thị nào ngày nay?|Hà Nội|Huế|Đà Nẵng|Cần Thơ|Tên gọi lịch sử cần được nối với địa danh hiện nay.
Nhà Trần|Nhà Trần chống quân xâm lược nào trong thế kỉ XIII?|Mông – Nguyên|Nam Hán|Minh|Thanh|Ba lần kháng chiến thời Trần bảo vệ nền độc lập Đại Việt.
Nhà Trần|Vị tướng nào nổi tiếng trong kháng chiến chống Mông – Nguyên?|Trần Quốc Tuấn|Phan Bội Châu|Trương Định|Nguyễn Trường Tộ|Trần Quốc Tuấn còn được gọi là Trần Hưng Đạo.
Hậu Lê|Ai lãnh đạo khởi nghĩa Lam Sơn?|Lê Lợi|Ngô Quyền|Lý Thường Kiệt|Đinh Bộ Lĩnh|Lam Sơn chống ách đô hộ của nhà Minh.
Hậu Lê|Khởi nghĩa Lam Sơn nhằm chống quân nào?|Minh|Tống|Thanh|Nam Hán|Phân biệt các cuộc kháng chiến theo thời kỳ và đối thủ.
Tây Sơn|Nguyễn Huệ lên ngôi với niên hiệu nào?|Quang Trung|Gia Long|Minh Mạng|Tự Đức|Quang Trung là vị hoàng đế của phong trào Tây Sơn.
Nhà Nguyễn|Kinh đô triều Nguyễn đặt tại đâu?|Huế|Hoa Lư|Cổ Loa|Lam Sơn|Huế còn lưu giữ hệ thống cung điện và lăng tẩm triều Nguyễn.
Ôn tập|Thứ tự nào đúng từ sớm đến muộn?|Văn Lang – Âu Lạc – Đại Việt|Đại Việt – Văn Lang – Âu Lạc|Âu Lạc – Đại Việt – Văn Lang|Đại Việt – Âu Lạc – Văn Lang|Dùng trục thời gian để liên kết các thời kỳ dựng nước.`,
5: `Chống Pháp|Thực dân Pháp mở đầu xâm lược Việt Nam năm nào?|1858|1802|1945|1975|Mốc 1858 mở đầu thời kỳ chống thực dân Pháp.
Chống Pháp|Trương Định gắn với phong trào nào?|Kháng chiến chống Pháp ở Nam Kì|Khởi nghĩa Lam Sơn|Kháng chiến chống Mông – Nguyên|Phong trào Tây Sơn|Ông tiếp tục chống Pháp theo nguyện vọng của nhân dân.
Canh tân|Nguyễn Trường Tộ đề nghị điều gì?|Canh tân đất nước|Dời đô ra Cổ Loa|Lập nước Văn Lang|Xây thành Hoa Lư|Canh tân là đổi mới để tăng sức mạnh đất nước.
Cứu nước|Phong trào Đông Du hướng thanh niên sang nước nào?|Nhật Bản|Ai Cập|Brazil|Canada|Phan Bội Châu mong tìm con đường cứu nước qua học tập ở Nhật.
Cứu nước|Nguyễn Tất Thành ra đi tìm đường cứu nước năm nào?|1911|1858|1954|1975|Hành trình năm 1911 mở đầu quá trình tìm đường giải phóng dân tộc.
Cứu nước|Nơi ra đi năm 1911 của Nguyễn Tất Thành gắn với địa danh nào?|Bến Nhà Rồng|Thành Cổ Loa|Ải Chi Lăng|Cố đô Hoa Lư|Bến Nhà Rồng nằm tại Sài Gòn, nay là TP. Hồ Chí Minh.
Cách mạng|Đảng Cộng sản Việt Nam ra đời năm nào?|1930|1911|1945|1954|Sự ra đời của Đảng là bước ngoặt của cách mạng Việt Nam.
Cách mạng|Cách mạng tháng Tám thắng lợi năm nào?|1945|1930|1954|1975|Thắng lợi đưa tới sự ra đời của nước Việt Nam Dân chủ Cộng hòa.
Độc lập|Ngày Quốc khánh gắn với sự kiện nào năm 1945?|Đọc Tuyên ngôn Độc lập|Mở chiến dịch Điện Biên Phủ|Ký Hiệp định Paris|Khởi nghĩa Lam Sơn|Ngày 2/9/1945, bản Tuyên ngôn được đọc tại Ba Đình.
Kháng chiến|Toàn quốc kháng chiến chống Pháp bắt đầu năm nào?|1946|1930|1968|1986|Cuối năm 1946, cuộc kháng chiến bước sang quy mô toàn quốc.
Kháng chiến|Chiến thắng Điện Biên Phủ diễn ra năm nào?|1954|1945|1975|1986|Điện Biên Phủ là thắng lợi lớn trong kháng chiến chống Pháp.
Kháng chiến|Chiến dịch Điện Biên Phủ thuộc cuộc kháng chiến nào?|Chống Pháp|Chống Minh|Chống Tống|Chống Thanh|Không nhầm chiến dịch 1954 với chiến dịch Hồ Chí Minh 1975.
Thống nhất|Hiệp định Paris về Việt Nam được ký năm nào?|1973|1954|1945|1986|Hiệp định Paris là mốc quan trọng trước thắng lợi 1975.
Thống nhất|Chiến dịch nào kết thúc ngày 30/4/1975?|Chiến dịch Hồ Chí Minh|Chiến dịch Biên giới|Chiến dịch Việt Bắc|Chiến dịch Điện Biên Phủ|Chiến dịch giải phóng Sài Gòn, góp phần kết thúc chiến tranh.
Thống nhất|Cuộc tổng tuyển cử chung cả nước sau thống nhất diễn ra năm nào?|1976|1946|1954|1960|Nhân dân cả nước bầu Quốc hội của nước Việt Nam thống nhất.
Đổi mới|Công cuộc đổi mới được đề ra tại Đại hội VI năm nào?|1986|1975|1954|1930|Đổi mới gắn với phát triển đất nước sau thống nhất.`,
6: `Sử học|Đồ gốm khai quật được thuộc loại tư liệu nào?|Hiện vật|Truyền miệng|Dự báo|Hư cấu|Hiện vật là vật chất còn lại từ quá khứ.
Sử học|Một thế kỉ gồm bao nhiêu năm?|100|10|50|1000|Phân biệt thập kỉ, thế kỉ và thiên niên kỉ.
Sử học|Năm 938 thuộc thế kỉ nào?|X|IX|XI|VIII|Thế kỉ X gồm các năm 901 đến 1000.
Nguyên thủy|Công cụ ban đầu của người nguyên thủy chủ yếu làm bằng gì?|Đá|Thép không gỉ|Nhựa|Nhôm|Công cụ đá xuất hiện trước các công cụ kim loại.
Nguyên thủy|Trồng trọt giúp con người thay đổi đời sống thế nào?|Có điều kiện định cư lâu dài|Chỉ sống bằng săn bắt|Không cần thức ăn|Không cần lao động|Nguồn lương thực ổn định hỗ trợ đời sống định cư.
Cổ đại|Các quốc gia phương Đông cổ đại thường phát triển ở đâu?|Lưu vực sông lớn|Vùng băng vĩnh cửu|Hoang mạc không nước|Đỉnh núi tuyết|Nước và phù sa thuận lợi cho nông nghiệp.
Cổ đại|Ai Cập cổ đại gắn với con sông nào?|Sông Nin|Sông Hồng|Sông Mê Công|Sông Đà|Sông Nin tạo điều kiện cho cư dân Ai Cập làm nông nghiệp.
Cổ đại|Kim tự tháp là công trình tiêu biểu của nền văn minh nào?|Ai Cập|Văn Lang|Chăm-pa|Đại Việt|Công trình kiến trúc là nguồn tìm hiểu văn minh cổ đại.
Văn Lang|Người đứng đầu nước Văn Lang là ai?|Hùng Vương|Lê Lợi|Ngô Quyền|Quang Trung|Hùng Vương là danh xưng của vua Văn Lang.
Văn Lang|Vì sao cư dân Việt cổ ở nhà sàn?|Hạn chế ẩm ướt và thú dữ|Để khai thác dầu|Để tránh mọi cơn bão tuyệt đối|Để không phải dùng gỗ|Kiểu nhà thích nghi với môi trường sống.
Âu Lạc|An Dương Vương gắn với nhà nước nào?|Âu Lạc|Vạn Xuân|Đại Nam|Đại Ngu|Thành Cổ Loa gắn với An Dương Vương và Âu Lạc.
Bắc thuộc|Hai Bà Trưng khởi nghĩa năm nào?|40|938|1288|1789|Cuộc khởi nghĩa biểu hiện ý chí giành độc lập đầu Công nguyên.
Bắc thuộc|Lý Bí đặt tên nước là gì năm 544?|Vạn Xuân|Đại Cồ Việt|Đại Nam|Đại Ngu|Tên Vạn Xuân thể hiện mong muốn đất nước bền vững.
Bắc thuộc|Triệu Quang Phục tận dụng địa bàn nào để kháng chiến?|Dạ Trạch|Hoa Lư|Phú Xuân|Bến Nhà Rồng|Đầm lầy Dạ Trạch thuận lợi cho lối đánh linh hoạt.
Độc lập|Ngô Quyền đánh quân Nam Hán năm 938 trên sông nào?|Bạch Đằng|Hương|Tiền|Đồng Nai|Ông tận dụng cọc gỗ và thủy triều để đánh giặc.
Độc lập|Ý nghĩa nổi bật của chiến thắng năm 938 là gì?|Mở thời kỳ độc lập lâu dài|Lập triều Nguyễn|Mở đầu đô hộ phương Bắc|Bắt đầu kháng chiến chống Pháp|Chiến thắng tạo bước ngoặt sau thời Bắc thuộc.`,
7: `Nhà Lý|Nhà Lý được thành lập năm nào?|1009|938|1226|1802|Lý Công Uẩn lên ngôi năm 1009.
Nhà Lý|Vua Lý dời đô ra Đại La năm nào?|1010|1009|1054|1288|Sau dời đô, Đại La mang tên Thăng Long.
Nhà Lý|Quốc hiệu Đại Việt được đặt năm nào?|1054|968|938|1802|Quốc hiệu Đại Việt được sử dụng từ thời Lý.
Nhà Lý|Bộ luật Hình thư ban hành dưới triều nào?|Lý|Đinh|Ngô|Tây Sơn|Hình thư được ban hành năm 1042.
Nhà Lý|Lễ cày tịch điền nhằm khuyến khích hoạt động nào?|Sản xuất nông nghiệp|Đóng tàu viễn dương|Luyện thi võ|Mở chiến tranh|Nhà vua làm lễ để đề cao việc chăm lo ruộng đất.
Nhà Lý|Phòng tuyến Như Nguyệt gắn với kháng chiến chống ai?|Tống|Minh|Thanh|Pháp|Nhà Lý chống Tống trong những năm 1075–1077.
Nhà Trần|Nhà Trần thành lập năm nào?|1226|1009|1428|1802|Nhà Trần kế tiếp nhà Lý.
Nhà Trần|Trần Quốc Tuấn nổi tiếng trong kháng chiến chống quân nào?|Mông – Nguyên|Minh|Thanh|Pháp|Tài chỉ huy của ông gắn với các thắng lợi thời Trần.
Nhà Trần|Chiến thắng Bạch Đằng thời Trần diễn ra năm nào?|1288|938|1789|1954|Cùng sông Bạch Đằng nhưng khác chiến thắng của Ngô Quyền năm 938.
Nhà Trần|Ai chỉ huy đánh đoàn thuyền lương tại Vân Đồn?|Trần Khánh Dư|Lý Bí|Đinh Bộ Lĩnh|Nguyễn Trường Tộ|Mất lương thực làm quân Nguyên gặp khó khăn.
Nhà Trần|Sức mạnh quan trọng giúp chống Mông – Nguyên thắng lợi là gì?|Đoàn kết toàn dân|Phụ thuộc hoàn toàn ngoại viện|Không chuẩn bị lực lượng|Chia rẽ triều đình|Sự đồng lòng kết hợp tổ chức và chỉ huy tạo sức mạnh.
Lam Sơn|Khởi nghĩa Lam Sơn do ai lãnh đạo?|Lê Lợi|Nguyễn Huệ|Trần Thủ Độ|Lý Công Uẩn|Khởi nghĩa chống nhà Minh, dẫn tới việc lập nhà Lê sơ.
Lam Sơn|Bình Ngô đại cáo gắn với tác giả nào?|Nguyễn Trãi|Nguyễn Du|Hồ Xuân Hương|Nguyễn Bỉnh Khiêm|Bản cáo tổng kết cuộc đấu tranh giành độc lập.
Tây Sơn|Quang Trung đánh bại quân Thanh vào mùa xuân năm nào?|1789|1288|1428|1802|Thắng lợi Ngọc Hồi – Đống Đa gắn với xuân Kỷ Dậu.
Phong kiến|Hai tầng lớp chính trong lãnh địa Tây Âu là gì?|Lãnh chúa và nông nô|Công nhân và tư sản|Chủ đồn điền và công nhân|Thợ máy và kỹ sư|Lãnh địa là đơn vị kinh tế và chính trị phong kiến Tây Âu.
Phát kiến|Tiến bộ nào hỗ trợ các chuyến đi biển xa?|La bàn và kỹ thuật đóng tàu|Động cơ phản lực|Điện thoại thông minh|Vệ tinh định vị|Kỹ thuật hàng hải hỗ trợ các cuộc phát kiến địa lý.`,
8: `Cận đại|Cách mạng công nghiệp khởi đầu ở nước nào?|Anh|Nhật Bản|Nga|Ấn Độ|Nước Anh đi đầu quá trình cơ giới hóa sản xuất.
Cận đại|Máy móc thay lao động thủ công làm thay đổi điều gì?|Năng suất sản xuất|Số ngày trong tuần|Quỹ đạo Trái Đất|Chu kỳ Mặt Trăng|Sản xuất cơ khí tạo bước chuyển lớn trong kinh tế.
Cách mạng Pháp|Cách mạng Pháp bùng nổ năm nào?|1789|1917|1848|1858|Năm 1789 là mốc mở đầu cách mạng tư sản Pháp.
Cách mạng Pháp|Lực lượng nào thúc đẩy cách mạng Pháp tiến lên?|Quần chúng nhân dân|Chỉ riêng hoàng gia|Quân đội thuộc địa Nhật|Triều đình nhà Thanh|Sự tham gia của nhân dân ảnh hưởng tiến trình cách mạng.
Cách mạng Nga|Cách mạng tháng Hai 1917 lật đổ chế độ nào?|Nga hoàng|Nhà Thanh|Mạc phủ Nhật|Triều Nguyễn|Sau tháng Hai xuất hiện tình trạng hai chính quyền.
Cách mạng Nga|Hai chính quyền sau tháng Hai ở Nga gồm Chính phủ lâm thời và gì?|Các Xô viết|Liên hợp quốc|ASEAN|Quốc hội Việt Nam|Tình trạng này dẫn tới yêu cầu giải quyết vấn đề chính quyền.
Cách mạng Nga|Cách mạng tháng Mười diễn ra năm nào?|1917|1789|1858|1945|Tháng Mười đưa chính quyền về tay các Xô viết.
Chiến tranh|Chiến tranh thế giới thứ nhất bắt đầu năm nào?|1914|1939|1945|1871|Chiến tranh thứ nhất diễn ra từ 1914 đến 1918.
Chiến tranh|Chiến tranh thế giới thứ hai diễn ra trong thời gian nào?|1939–1945|1914–1918|1858–1884|1789–1794|Không nhầm hai cuộc chiến tranh thế giới.
Châu Á|Cách mạng Tân Hợi diễn ra tại nước nào?|Trung Quốc|Nhật Bản|Ấn Độ|Ai Cập|Cách mạng năm 1911 lật đổ triều Thanh.
Châu Á|Duy tân Minh Trị gắn với quốc gia nào?|Nhật Bản|Pháp|Đức|Nga|Cải cách giúp Nhật Bản phát triển theo hướng tư bản chủ nghĩa.
Việt Nam|Liên quân Pháp – Tây Ban Nha tấn công nơi nào đầu tiên năm 1858?|Đà Nẵng|Hà Nội|Huế|Vinh|Đà Nẵng là mục tiêu mở đầu xâm lược.
Việt Nam|Phong trào Cần Vương gắn với lời kêu gọi của vua nào?|Hàm Nghi|Gia Long|Lý Thái Tổ|Quang Trung|Chiếu Cần Vương kêu gọi giúp vua chống Pháp.
Việt Nam|Phan Đình Phùng gắn với khởi nghĩa nào?|Hương Khê|Lam Sơn|Hai Bà Trưng|Tây Sơn|Hương Khê là cuộc khởi nghĩa tiêu biểu của Cần Vương.
Việt Nam|Khởi nghĩa Yên Thế gắn với người lãnh đạo nào?|Hoàng Hoa Thám|Ngô Quyền|Trần Nhân Tông|Lê Thánh Tông|Yên Thế là phong trào đấu tranh bền bỉ của nông dân.
Việt Nam|Nguyễn Tất Thành rời Sài Gòn tìm đường cứu nước năm nào?|1911|1930|1945|1954|Đây là hướng đi mới trong bối cảnh các phong trào cũ gặp khó khăn.`,
9: `Thế giới 1945|Liên Xô chế tạo thành công bom nguyên tử năm nào?|1949|1917|1957|1961|Thành tựu này phá thế độc quyền hạt nhân của Mỹ.
Thế giới 1945|Nước nào phóng vệ tinh nhân tạo đầu tiên năm 1957?|Liên Xô|Nhật Bản|Ấn Độ|Pháp|Sputnik đánh dấu bước tiến của khoa học vũ trụ.
Thế giới 1945|Gagarin bay vào vũ trụ năm nào?|1961|1945|1954|1989|Ông là người đầu tiên bay vào vũ trụ.
Giải phóng dân tộc|Năm 1960 được gọi là gì trong lịch sử châu Phi?|Năm châu Phi|Năm châu Âu|Năm Đại Tây Dương|Năm Đông Á|Nhiều quốc gia châu Phi giành độc lập trong năm này.
Đông Nam Á|ASEAN thành lập năm nào?|1967|1945|1954|1995|ASEAN ra đời nhằm tăng cường hợp tác khu vực.
Đông Nam Á|Việt Nam gia nhập ASEAN năm nào?|1995|1967|1975|1986|Đây là một mốc trong quá trình hội nhập khu vực.
Quan hệ quốc tế|Hai nước tuyên bố chấm dứt Chiến tranh lạnh năm 1989 là gì?|Mỹ và Liên Xô|Pháp và Nhật|Việt Nam và Lào|Anh và Ấn Độ|Cuộc gặp Malta gắn với mốc này.
Quan hệ quốc tế|Liên hợp quốc được thành lập năm nào?|1945|1919|1967|1991|Mục đích chính là duy trì hòa bình và an ninh quốc tế.
Việt Nam 1930|Đảng Cộng sản Việt Nam ra đời năm nào?|1930|1911|1941|1954|Đảng ra đời gắn với sự thống nhất các tổ chức cộng sản.
Việt Nam 1941|Mặt trận nào được thành lập tháng 5/1941?|Việt Minh|ASEAN|SEATO|Liên hợp quốc|Việt Minh tập hợp lực lượng cho nhiệm vụ giải phóng dân tộc.
Việt Nam 1945|Cách mạng tháng Tám thành công năm nào?|1945|1930|1954|1975|Tổng khởi nghĩa giành chính quyền trên cả nước.
Kháng chiến|Chiến dịch Việt Bắc thu – đông 1947 bảo vệ điều gì?|Căn cứ địa kháng chiến|Thành Cổ Loa thời Âu Lạc|Kinh đô nhà Lý|Cảng Hội An thế kỉ XVII|Thắng lợi làm thất bại ý đồ đánh nhanh của Pháp.
Kháng chiến|Chiến thắng quyết định năm 1954 mang tên gì?|Điện Biên Phủ|Ngọc Hồi|Chi Lăng|Bạch Đằng|Chiến thắng góp phần buộc Pháp ký Hiệp định Genève.
Thống nhất|Hiệp định Paris về Việt Nam được ký năm nào?|1973|1945|1954|1995|Hiệp định tạo điều kiện thuận lợi cho đấu tranh thống nhất.
Thống nhất|Mùa xuân 1975 kết thúc bằng chiến dịch nào?|Hồ Chí Minh|Việt Bắc|Biên giới|Điện Biên Phủ|Chiến dịch kết thúc ngày 30/4/1975.
Đổi mới|Đại hội mở đầu đường lối đổi mới là Đại hội nào?|VI năm 1986|III năm 1960|II năm 1951|IV năm 1976|Đổi mới đáp ứng yêu cầu phát triển đất nước.`,
10: `Cổ đại|Nông nghiệp phương Đông cổ đại thuận lợi nhờ yếu tố nào?|Sông lớn và phù sa|Băng hà quanh năm|Thiếu nước kéo dài|Đất hoàn toàn đá trơ|Điều kiện tự nhiên tác động tới hoạt động kinh tế.
Cổ đại|Hy Lạp và La Mã cổ đại gắn với vùng biển nào?|Địa Trung Hải|Biển Đông|Biển Đỏ|Biển Baltic|Giao thông biển hỗ trợ thương mại và giao lưu.
Cổ đại|Kim tự tháp là di sản của nền văn minh nào?|Ai Cập|La Mã|Ấn Độ|Trung Hoa|Di sản kiến trúc giúp nhận biết các nền văn minh.
Cổ đại|Lực lượng lao động bị bóc lột chủ yếu trong xã hội chiếm hữu nô lệ là ai?|Nô lệ|Kỹ sư hiện đại|Lãnh chúa|Công nhân nhà máy|Cần phân biệt địa vị các tầng lớp trong xã hội cổ đại.
Trung đại|Lãnh địa Tây Âu chủ yếu mang tính kinh tế gì?|Tự cung tự cấp|Công nghiệp toàn cầu|Kinh tế số|Thị trường chứng khoán|Lãnh địa sản xuất phần lớn nhu yếu phẩm tại chỗ.
Phát kiến|Columbus đến châu Mỹ năm nào?|1492|1789|1914|1945|Các chuyến hàng hải mở rộng hiểu biết và giao lưu giữa châu lục.
Phát kiến|Vasco da Gama tìm đường biển tới đâu?|Ấn Độ|Nam Cực|Australia|Bắc Cực|Tuyến đường vòng qua châu Phi nối châu Âu với Ấn Độ.
Việt Nam|Chiến thắng nào năm 938 mở thời kỳ độc lập lâu dài?|Bạch Đằng|Đống Đa|Điện Biên Phủ|Rạch Gầm – Xoài Mút|Ngô Quyền tận dụng điều kiện sông nước để giành thắng lợi.
Việt Nam|Đinh Bộ Lĩnh đặt quốc hiệu nào?|Đại Cồ Việt|Đại Nam|Âu Lạc|Vạn Xuân|Năm 968 đánh dấu việc xây dựng chính quyền sau thống nhất.
Việt Nam|Dời đô năm 1010 gắn với nhân vật nào?|Lý Công Uẩn|Lê Lợi|Nguyễn Huệ|Gia Long|Thăng Long trở thành trung tâm chính trị lâu dài.
Việt Nam|Khởi nghĩa Lam Sơn chống lực lượng nào?|Nhà Minh|Nhà Thanh|Quân Pháp|Quân Nam Hán|Lam Sơn đưa tới sự ra đời nhà Lê sơ.
Việt Nam|Rạch Gầm – Xoài Mút năm 1785 là chiến thắng chống quân nào?|Xiêm|Thanh|Minh|Tống|Phong trào Tây Sơn đồng thời thực hiện nhiệm vụ bảo vệ đất nước.
Việt Nam|Ngọc Hồi – Đống Đa năm 1789 chống quân nào?|Thanh|Xiêm|Mông Cổ|Nam Hán|Quang Trung chỉ huy cuộc tiến công mùa xuân Kỷ Dậu.
Việt Nam|Đô thị Hội An phát triển gắn với hoạt động nào?|Thương mại đường biển|Khai thác băng|Chế tạo vệ tinh|Săn tuần lộc|Thương cảng thể hiện giao lưu kinh tế và văn hóa.
Cận đại|Cách mạng công nghiệp bắt đầu ở đâu?|Anh|Trung Quốc|Nga|Việt Nam|Cơ giới hóa sản xuất làm biến đổi kinh tế và xã hội.
Cận đại|Sản xuất công nghiệp làm nổi lên hai giai cấp nào?|Tư sản và vô sản|Lãnh chúa và nông nô|Vua Hùng và Lạc hầu|Chủ nô và nô lệ cổ đại|Phân biệt cơ cấu xã hội giữa các thời kỳ.`,
11: `Châu Á|Duy tân Minh Trị bắt đầu năm nào?|1868|1789|1917|1945|Cải cách đưa Nhật Bản phát triển theo hướng tư bản.
Châu Á|Cách mạng Tân Hợi năm 1911 diễn ra tại đâu?|Trung Quốc|Ấn Độ|Nhật Bản|Thái Lan|Cuộc cách mạng lật đổ triều Thanh.
Chiến tranh|Chiến tranh thế giới thứ nhất diễn ra khi nào?|1914–1918|1939–1945|1858–1884|1946–1954|Cần phân biệt mốc của hai cuộc chiến tranh thế giới.
Cách mạng Nga|Tháng Hai năm 1917 lật đổ chính quyền nào?|Nga hoàng|Chính phủ Việt Minh|Triều Thanh|Mạc phủ Nhật|Đây là bước đầu của quá trình cách mạng Nga năm 1917.
Cách mạng Nga|Lực lượng lãnh đạo Cách mạng tháng Mười là gì?|Đảng Bolshevik|Đảng Quốc đại|Quốc dân đảng Trung Quốc|Triều đình Nga|Lenin và Bolshevik lãnh đạo khởi nghĩa giành chính quyền.
Thế giới 1918–1939|Khủng hoảng kinh tế thế giới lớn bắt đầu năm nào?|1929|1914|1945|1967|Khủng hoảng tác động sâu sắc tới các nước tư bản.
Chiến tranh|Chiến tranh thế giới thứ hai kết thúc năm nào?|1945|1918|1939|1954|Chủ nghĩa phát xít bị đánh bại sau chiến tranh.
Đông Nam Á|Giữa hai cuộc chiến tranh, phong trào giải phóng dân tộc có hai khuynh hướng nào?|Tư sản và vô sản|Chủ nô và lãnh chúa|Phong kiến và nguyên thủy|Du mục và săn bắt|Sự trưởng thành của các lực lượng mới làm phong trào đa dạng hơn.
Ấn Độ|Tổ chức gắn với phong trào dân tộc ở Ấn Độ là gì?|Đảng Quốc đại|Bolshevik|Việt Minh|ASEAN|Đảng Quốc đại có vai trò nổi bật trong phong trào Ấn Độ.
Việt Nam|Đà Nẵng bị liên quân Pháp – Tây Ban Nha tấn công năm nào?|1858|1802|1911|1945|Vị trí cảng và khoảng cách tới Huế là các yếu tố chiến lược.
Việt Nam|Hiệp ước Nhâm Tuất được ký năm nào?|1862|1884|1919|1946|Hiệp ước đánh dấu bước nhượng bộ của triều Nguyễn.
Việt Nam|Phong trào Cần Vương bùng lên năm nào?|1885|1858|1911|1930|Chiếu Cần Vương ra đời sau biến cố kinh thành Huế.
Việt Nam|Phan Bội Châu gắn với phong trào nào?|Đông Du|Lam Sơn|Tây Sơn|Hai Bà Trưng|Ông chủ trương vận động cứu nước theo xu hướng bạo động.
Việt Nam|Phan Châu Trinh chú trọng con đường nào?|Cải cách, nâng cao dân trí|Khôi phục nhà Đinh|Lập lại Văn Lang|Chinh phục thuộc địa|Xu hướng cải cách khác với chủ trương bạo động.
Việt Nam|Nguyễn Tất Thành ra đi tìm đường cứu nước từ đâu?|Sài Gòn|Hoa Lư|Cổ Loa|Đông Kinh thời Lê|Hành trình năm 1911 hướng tới tìm hiểu thế giới và con đường giải phóng.
Ôn tập|Đặc điểm của các phong trào đầu thế kỉ XX là gì?|Xuất hiện xu hướng cứu nước mới|Chỉ có khởi nghĩa thời cổ đại|Không có hoạt động yêu nước|Đã thống nhất đất nước năm 1975|Bối cảnh thuộc địa thúc đẩy tìm kiếm phương pháp đấu tranh mới.`,
12: `Thế giới 1945|Hội nghị Ianta diễn ra vào năm nào?|1945|1919|1930|1954|Ianta bàn việc kết thúc chiến tranh và tổ chức trật tự sau chiến tranh.
Thế giới 1945|Ba cường quốc dự Hội nghị Ianta là gì?|Liên Xô, Mỹ, Anh|Pháp, Đức, Nhật|Mỹ, Trung Quốc, Ấn Độ|Anh, Pháp, Italia|Các thỏa thuận góp phần hình thành trật tự hai cực.
Liên hợp quốc|Mục tiêu hàng đầu của Liên hợp quốc là gì?|Giữ hòa bình và an ninh quốc tế|Chinh phục thuộc địa|Thống nhất mọi đồng tiền|Thay thế mọi chính phủ|Tổ chức thúc đẩy hợp tác và giải quyết tranh chấp hòa bình.
Liên hợp quốc|Việt Nam gia nhập Liên hợp quốc năm nào?|1977|1945|1954|1995|Gia nhập Liên hợp quốc là một mốc đối ngoại sau thống nhất.
Liên Xô|Vệ tinh nhân tạo đầu tiên được phóng năm nào?|1957|1945|1961|1989|Liên Xô đạt thành tựu nổi bật trong chinh phục vũ trụ.
Đông Nam Á|ASEAN ra đời năm nào?|1967|1945|1977|1995|Hợp tác khu vực là nội dung quan trọng khi học Đông Nam Á.
Quan hệ quốc tế|Chiến tranh lạnh chủ yếu gắn với đối đầu giữa hai nước nào?|Mỹ và Liên Xô|Pháp và Italia|Nhật và Ấn Độ|Việt Nam và Lào|Sự đối đầu chi phối quan hệ quốc tế nhiều thập kỉ.
Việt Nam 1919–1930|Nguyễn Ái Quốc đọc Luận cương Lenin về dân tộc và thuộc địa năm nào?|1920|1911|1930|1945|Sự kiện góp phần xác định con đường giải phóng dân tộc.
Việt Nam 1919–1930|Hội nghị thành lập Đảng Cộng sản Việt Nam diễn ra năm nào?|1930|1920|1941|1951|Đây là bước ngoặt về tổ chức và đường lối cách mạng.
Việt Nam 1930–1945|Việt Minh được thành lập năm nào?|1941|1930|1954|1976|Mặt trận tập hợp lực lượng giải phóng dân tộc.
Việt Nam 1930–1945|Nhật đầu hàng Đồng minh năm 1945 tạo điều kiện gì cho Việt Nam?|Thời cơ tổng khởi nghĩa|Bắt đầu chiến tranh thế giới thứ nhất|Thành lập ASEAN|Khởi động đổi mới|Thời cơ kết hợp với sự chuẩn bị lực lượng từ trước.
Việt Nam 1945–1954|Chiến dịch Biên giới thu – đông diễn ra năm nào?|1950|1947|1954|1968|Thắng lợi mở thông liên lạc quốc tế và củng cố thế chủ động.
Việt Nam 1945–1954|Điện Biên Phủ góp phần dẫn tới hiệp định nào?|Genève 1954|Paris 1973|Versailles 1919|Nhâm Tuất 1862|Đấu tranh quân sự và ngoại giao có quan hệ với nhau.
Việt Nam 1954–1975|Phong trào Đồng khởi tiêu biểu ở Bến Tre diễn ra năm nào?|1960|1945|1954|1975|Đồng khởi tạo bước chuyển của cách mạng miền Nam.
Việt Nam 1954–1975|Hiệp định Paris về Việt Nam được ký năm nào?|1973|1954|1945|1986|Sau hiệp định, so sánh lực lượng có thay đổi thuận lợi.
Việt Nam 1975–2000|Đường lối đổi mới được đề ra năm nào?|1986|1975|1954|1930|Đại hội VI khởi đầu công cuộc đổi mới.`,
};
export const STUDY_BANK = Object.entries(facts).flatMap(([grade, text]) => text.split('\n').map((line, i) => {
  const [topic, question, correct, ...rest] = line.split('|');
  return { id: `study-${grade}-${i + 1}`, grade: Number(grade), subject: 'history', topic, question, answers: [correct, ...rest.slice(0, 3)], correctAnswer: 0, explanation: rest[3], sourceUrl: sources[grade], sourceTitle: `Tài liệu tham khảo Lịch sử lớp ${grade}`, sourceStatus: 'topic-reference', textbookVerified: false };
}));
