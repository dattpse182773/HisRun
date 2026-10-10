// Adapted from the user's “Kịch bản game Hisrun”. Period boundaries are teaching
// conventions, not simultaneous transitions in every country.
export const REGIONS = ['Tất cả', 'Miền Bắc', 'Miền Trung', 'Miền Nam'];
export const TIMELINES = {
  vietnam: [
    ['Tiền sử và sơ sử', 'Trước thế kỷ II TCN', 'Từ cộng đồng cư dân cổ, văn hóa đồ đá và đồ đồng đến các nhà nước Văn Lang, Âu Lạc.'],
    ['Bắc thuộc và giành độc lập', 'Thế kỷ II TCN – 938', 'Các cuộc đấu tranh giành quyền tự chủ; chiến thắng Bạch Đằng năm 938 là một bước ngoặt.'],
    ['Quốc gia độc lập', '938 – 1858', 'Các triều đại xây dựng đất nước; kinh đô thay đổi từ Hoa Lư đến Thăng Long, Phú Xuân – Huế.'],
    ['Đấu tranh giải phóng dân tộc', '1858 – 1945', 'Pháp bắt đầu xâm lược năm 1858. Các phong trào yêu nước tiếp nối, đến Cách mạng Tháng Tám 1945.'],
    ['Việt Nam hiện đại', '1945 – nay', 'Độc lập, kháng chiến, thống nhất đất nước năm 1975; Đổi mới từ năm 1986 và hội nhập.'],
  ],
  world: [
    ['Tiền sử', 'Trước khi có chữ viết', 'Con người phát triển công cụ, trồng trọt và chăn nuôi. Mốc kết thúc khác nhau giữa các khu vực.'],
    ['Cổ đại', 'Khoảng thiên niên kỷ IV TCN – thế kỷ V', 'Chữ viết và những nền văn minh sớm xuất hiện; phát triển các xã hội ở Lưỡng Hà, Ai Cập, Ấn Độ, Trung Quốc, Hy Lạp và La Mã.'],
    ['Trung đại', 'Khoảng thế kỷ V – XV', 'Các vương quốc và đế chế phát triển, tôn giáo và mạng lưới thương mại kết nối nhiều khu vực.'],
    ['Cận đại', 'Khoảng thế kỷ XV – đầu XX', 'Phục hưng, các cuộc đi biển, cách mạng tư sản và công nghiệp làm biến đổi thế giới; chủ nghĩa thực dân mở rộng.'],
    ['Hiện đại', 'Đầu thế kỷ XX – nay', 'Hai cuộc chiến tranh thế giới, Chiến tranh Lạnh, giải phóng thuộc địa, cách mạng khoa học – công nghệ và toàn cầu hóa.'],
  ],
};
export const MAP_STORIES = {
  'map-01': {
    geography: 'Cao Bằng thuộc vùng núi Đông Bắc, giáp Trung Quốc. Núi đá vôi, hang động và suối tạo nên cảnh quan Pác Bó; mùa đông có thể lạnh.',
    connection: 'Núi rừng và vị trí biên giới hỗ trợ xây dựng căn cứ, giữ liên lạc và phát triển phong trào cách mạng.',
    timeline: [['Không gian lâu đời', 'Cư dân miền núi gắn đời sống với thung lũng, dòng suối và tuyến giao lưu qua biên giới.'], ['1941', 'Nguyễn Ái Quốc về nước, hoạt động ở Pác Bó. Hội nghị Trung ương 8 quyết định thành lập Mặt trận Việt Minh.'], ['Ngày nay', 'Di tích Pác Bó lưu giữ ký ức về bước chuẩn bị cho cuộc đấu tranh giành độc lập.']],
    source: ['Cục Di sản văn hóa · Pác Bó', 'https://dsvh.gov.vn/di-tich-lich-su-pac-bo-2950'],
  },
  'map-02': {
    geography: 'Điện Biên thuộc Tây Bắc, giáp Lào và Trung Quốc. Thung lũng Mường Thanh nằm giữa vùng núi; đồng ruộng và sông Nậm Rốm gắn với đời sống cư dân.',
    connection: 'Lòng chảo được bao quanh bởi đồi núi vừa có giá trị quân sự, vừa đặt ra thử thách lớn về vận chuyển và tiếp tế.',
    timeline: [['Trước chiến dịch', 'Mường Thanh là không gian cư trú và canh tác của các cộng đồng vùng Tây Bắc.'], ['13/3 – 7/5/1954', 'Chiến dịch Điện Biên Phủ diễn ra, kết thúc bằng thắng lợi của quân và dân Việt Nam.'], ['Ngày nay', 'Đồi A1, các hầm chỉ huy và bảo tàng giúp người học tìm hiểu chiến dịch qua di tích và hiện vật.']],
    source: ['Bảo tàng Chiến thắng Điện Biên Phủ', 'https://btctdbp.svhttdl.dienbien.gov.vn/portal/pages/2021-5-7/Chien-dich-Dien-Bien-Phu--Moc-vang-trong-lich-su-cz7od4fe8gt9z.aspx'],
  },
  'map-03': {
    geography: 'Hà Nội nằm trong không gian đồng bằng sông Hồng. Phù sa, địa hình tương đối bằng phẳng và đường sông tạo thuận lợi cho cư trú, nông nghiệp và giao thương.',
    connection: 'Vị trí trung tâm đồng bằng giúp Thăng Long phát triển thành một kinh đô và đô thị lớn.',
    timeline: [['Trước 1010', 'Đại La là một trung tâm quan trọng, trước khi được chọn làm kinh đô của nhà Lý.'], ['1010', 'Lý Công Uẩn dời đô từ Hoa Lư ra Đại La và đổi tên thành Thăng Long.'], ['Qua nhiều thế kỷ', 'Các lớp di tích chồng xếp phản ánh lịch sử lâu dài của kinh thành. Khu trung tâm Hoàng thành được UNESCO ghi danh năm 2010.']],
    source: ['UNESCO · Hoàng thành Thăng Long', 'https://whc.unesco.org/en/list/1328/'],
  },
  'map-04': {
    geography: 'Hoa Lư – Tràng An nổi bật với núi đá vôi, thung lũng ngập nước, hang động và sông ngầm. Đó là những nét tiêu biểu của địa hình karst.',
    connection: 'Núi đá và đường thủy tạo cảnh quan đặc biệt, đồng thời cung cấp lợi thế phòng thủ cho kinh đô Hoa Lư.',
    timeline: [['Tiền sử', 'Các hang động Tràng An lưu dấu cư trú của con người và sự thích nghi với biến đổi môi trường qua hàng chục nghìn năm.'], ['968 – 1010', 'Hoa Lư giữ vai trò kinh đô dưới các triều Đinh, Tiền Lê và đầu nhà Lý.'], ['Ngày nay', 'Không gian cố đô gắn với Quần thể danh thắng Tràng An, di sản văn hóa và thiên nhiên thế giới.']],
    source: ['UNESCO · Tràng An', 'https://whc.unesco.org/en/list/1438/'],
  },
  'map-05': {
    geography: 'Nghệ An ở Bắc Trung Bộ, có núi phía tây, đồng bằng và biển phía đông. Nam Đàn thuộc lưu vực sông Lam; mùa hè có thể chịu gió phơn khô nóng.',
    connection: 'Làng quê, ruộng đồng và đời sống xứ Nghệ là bối cảnh tuổi thơ của Nguyễn Sinh Cung, sau này là Chủ tịch Hồ Chí Minh.',
    timeline: [['Làng quê xứ Nghệ', 'Các cộng đồng cư dân phát triển đời sống nông nghiệp, truyền thống học tập và văn hóa làng xã.'], ['1890 và tuổi thơ', 'Nguyễn Sinh Cung sinh tại Hoàng Trù; Hoàng Trù và Làng Sen gắn với gia đình và những năm thiếu thời của Người.'], ['Ngày nay', 'Khu di tích Kim Liên bảo tồn các địa điểm lưu niệm, phục vụ tham quan và tìm hiểu lịch sử.']],
    source: ['Du lịch Nghệ An · Kim Liên', 'https://visitnghean.gov.vn/diem-tham-quan/khu-luu-niem-chu-tich-ho-chi-minh-tai-kim-lien'],
  },
  'map-06': {
    geography: 'Huế nằm ở miền Trung, gắn với sông Hương, núi Ngự và vùng đồng bằng ven biển. Mùa mưa thường tập trung vào những tháng cuối năm.',
    connection: 'Kiến trúc kinh đô được bố trí trong quan hệ với sông, núi và cảnh quan tự nhiên.',
    timeline: [['Trước triều Nguyễn', 'Phú Xuân từng là trung tâm chính trị quan trọng ở Đàng Trong và thời Tây Sơn.'], ['1802 – 1945', 'Huế là kinh đô của triều Nguyễn, với kinh thành, cung điện, lăng tẩm và các công trình nghi lễ.'], ['Ngày nay', 'Quần thể di tích Cố đô Huế là di sản thế giới, nơi bảo tồn kiến trúc và ký ức của kinh đô.']],
    source: ['UNESCO · Cố đô Huế', 'https://whc.unesco.org/en/list/678/'],
  },
  'map-07': {
    geography: 'Hội An nằm ven sông Thu Bồn, gần biển. Đường sông và đường biển từng giúp thương thuyền trao đổi hàng hóa; phố cổ có nguy cơ ngập trong mùa mưa.',
    connection: 'Vị trí thương cảng khiến Hội An trở thành nơi gặp gỡ văn hóa Việt Nam, Trung Hoa, Nhật Bản và nhiều cộng đồng khác.',
    timeline: [['Trước thời cực thịnh', 'Vùng cửa sông là không gian giao lưu và cư trú từ trước khi phố cảng phát triển mạnh.'], ['Thế kỷ XV – XIX', 'Hội An phát triển như một thương cảng, lưu dấu giao thương trong nhà ở, hội quán và công trình tín ngưỡng.'], ['Ngày nay', 'Phố cổ được bảo tồn như một di sản thế giới; nghề thủ công và đời sống ven sông tiếp nối truyền thống địa phương.']],
    source: ['UNESCO · Hội An', 'https://whc.unesco.org/en/list/948/'],
  },
  'map-08': {
    geography: 'TP. Hồ Chí Minh thuộc miền Nam, gắn với hệ thống sông Sài Gòn – Đồng Nai. Khí hậu có mùa mưa và mùa khô; sông, cảng và chợ thúc đẩy giao thương.',
    connection: 'Cùng một đô thị, chợ kể câu chuyện trao đổi hàng hóa còn bến cảng gắn với một hành trình lịch sử lớn.',
    timeline: [['Không gian Sài Gòn – Gia Định', 'Đô thị phát triển qua quá trình cư trú, mở rộng giao thương và kết nối đường thủy.'], ['5/6/1911', 'Nguyễn Tất Thành rời Bến Nhà Rồng trên tàu Amiral Latouche-Tréville, bắt đầu hành trình tìm đường cứu nước.'], ['1914 và ngày nay', 'Chợ Bến Thành ở vị trí hiện nay khai trương năm 1914. Chợ và Bến Nhà Rồng vẫn là những địa điểm tiêu biểu của thành phố.']],
    source: ['Cục Du lịch Quốc gia Việt Nam · Bến Nhà Rồng', 'https://vietnamtourism.vn/index.php/tourism/items/2925/3'],
    extraSource: ['Ban quản lý Chợ Bến Thành', 'https://benthanhmarket.vn/about/gioi-thieu-ve-cho-ben-thanh.html'],
  },
};
