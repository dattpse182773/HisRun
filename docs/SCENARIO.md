# Tích hợp kịch bản HisRun

Nguồn thiết kế: `Kịch bản game Hisrun.docx` do người dùng cung cấp. Hai ảnh tham khảo được trích nguyên bản trong `docs/scenario-reference/`.

- 12 con giáp Việt Nam, 24 phiên bản nam/nữ. Lựa chọn lưu trên thiết bị, truyền vào Phaser cho mỗi lượt, giữ khi chơi lại hoặc chuyển map. Ngoại hình không thay đổi chỉ số hay vùng va chạm.
- Atlas chính diện `frontend/public/assets/characters/zodiac-atlas.png` dùng cho phần lựa chọn nhân vật. Trong game dùng hai atlas quay lưng `zodiac-rear-a.png` và `zodiac-rear-b.png`, đổi khung theo nhịp chạy, kết hợp nghiêng, nảy, nhảy và co người khi trượt. Cả 24 lựa chọn có hình quay lưng tương ứng; các ảnh giữ nền alpha trong suốt.
- Tám phong cảnh mới trong `frontend/public/assets/backgrounds/` lấy phong cách hoạt hình từ ảnh làng quê và Hồ Gươm người dùng gửi. Mỗi map tải riêng ảnh đang cần; xu và chướng ngại vật tiến từ điểm tụ của đường tới ba làn va chạm. Đây là phong cảnh minh họa, không phải phục dựng địa hình chính xác. Map Hà Nội dùng cảnh Hồ Gươm, còn trạm kiến thức vẫn là Hoàng thành Thăng Long.
- 8 map hiện có được nhóm theo Bắc, Trung, Nam. Sơ đồ có Hoàng Sa và Trường Sa, là minh họa tuyến đi, không phải bản đồ địa giới hành chính hiện hành. Nội dung dùng bối cảnh chương trình trước 2018.
- Mỗi địa danh có cổng câu hỏi lịch sử và địa lý. Khi hoàn thành map, hiển thị sổ tay địa lý, mốc lịch sử, liên hệ giữa hai môn và nguồn đọc thêm.
- Trang hành trình có dòng thời gian Việt Nam và thế giới. Chỉnh nhầm “thế kỷ IV TCN” thành “thiên niên kỷ IV TCN” khi nói về các nền văn minh sớm; không xem các mốc phân kỳ là đồng thời ở mọi nơi. Không dùng các lỗi “Thánh giáo” hay “Phong trào Tới mới” trong tài liệu nguồn.
- Không tạo sự kiện cổ đại cho địa danh hiện đại nếu không có cơ sở; các sổ tay trình bày bối cảnh trước đó, mốc tiêu biểu và giá trị bảo tồn ngày nay.

## Tạo tài sản hình ảnh

Dùng công cụ ImageGen tích hợp, tham khảo ảnh thứ hai trong tài liệu. Prompt cuối:

> Create a production game character atlas by extracting/recreating the exact 24 Vietnamese zodiac chibi characters from the supplied reference image. Preserve their designs, Vietnamese outfits, colors, animal ears and horns and identities. EXACT layout 8 columns x 3 rows of equal cells across whole image, 1536x1024 if possible. Each cell contains one complete full-body isolated character, centered horizontally and vertically, consistent scale, generous transparent padding, feet all aligned within each row. Row1 left to right: rat boy, rat girl, buffalo boy, buffalo girl, tiger boy, tiger girl, cat boy, cat girl. Row2: dragon boy, dragon girl, snake boy, snake girl, horse boy, horse girl, goat boy, goat girl. Row3: monkey boy, monkey girl, rooster boy, rooster girl, dog boy, dog girl, pig boy, pig girl. Remove ALL parchment, boxes, borders, circular backdrops and text. Truly transparent alpha everywhere outside characters. No shadows outside silhouettes. Keep original charming polished warm hand-drawn illustration, crisp outlines. This is one cohesive sprite atlas asset, no cell separators. No extra characters, no cropped ears/feet/tails, no overlapping cells.

Ảnh sinh ra có khoảng cách hàng không đều; `characterFrame` định nghĩa vùng từng nhân vật theo khoảng trống thực tế để tránh cắt hình hoặc lẫn nhân vật kế bên. Không chỉnh sửa ảnh gốc.

## Kiểm tra

Các ảnh mới: `mountain.png` (Pác Bó), `battlefield.png` (Mường Thanh), `citadel.png` (Hồ Gươm), `karst.png` (Hoa Lư), `village.png` (làng quê), `imperial.png` (Huế), `port.png` (Hội An), `saigon.png` (Bến Thành và Bến Nhà Rồng). Cảnh Sài Gòn ghép các địa danh trong bố cục nghệ thuật.

Đặc tả tạo cảnh: minh họa game hoạt hình cel-shaded, nét viền rõ, màu tươi; góc nhìn người chạy từ phía sau, đường rộng ở tiền cảnh thu về điểm tụ; kiến trúc và cây cối ở hai bên; không HUD, chữ, nhân vật, xu hay chướng ngại vật vẽ sẵn. Hai atlas quay lưng giữ đúng thứ tự 8 cột × 3 hàng và trang phục từ ảnh tham khảo; khung A/B đổi chân và tay trong bước chạy, nền trong suốt, không viền ô hay chữ.

Chạy `npm test --prefix frontend` và `npm run build --prefix frontend`. Thử chọn nam/nữ, vào game, tạm dừng đổi nhân vật, tải lại để kiểm tra lưu lựa chọn; kiểm tra lọc vùng miền và giao diện 390px.

Backend và bộ câu hỏi không đổi trong lần tích hợp này. Để chạy cục bộ cần MongoDB và backend; `npm run db:dev --prefix backend`, `npm run seed --prefix backend`, `npm start --prefix backend`, `npm run dev --prefix frontend`. Truy cập `http://localhost:5173` theo origin mặc định của backend.
