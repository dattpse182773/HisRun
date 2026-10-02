# HisRun — Hành trình sử địa Bắc → Nam

Game web React + Phaser, API Express + MongoDB. Bản hiện tại có 8 map hữu hạn, ba cấp học, câu hỏi theo di tích, né chướng ngại vật, nhảy/trượt, xu, vật phẩm, combo kiến thức, âm thanh, tạm dừng, kết quả, hồ sơ, bảng xếp hạng và ôn câu sai.

## Chạy cục bộ

Yêu cầu Node >=22.12. Cài `npm install` riêng trong frontend và backend. Sao chép `.env.example` thành `.env` nếu chưa có.

Mở các terminal riêng:

1. Trong backend: `npm run db:dev` (MongoDB phát triển, lưu dữ liệu tại backend/.local/mongodb).
2. Trong backend: `npm run seed` để nạp/cập nhật 54 câu hành trình, giữ dữ liệu cũ. Sau đó `npm run dev`.
3. Trong frontend: `npm run dev`.
4. Mở http://localhost:5173/maps. API tại http://localhost:5000/api/health.

Có thể dùng MongoDB riêng qua MONGODB_URI. `db:dev` lần đầu cần tải MongoDB; không dùng cho production.

## Hành trình

Map 1 Cao Bằng/Pác Bó → Map 2 Điện Biên → Map 3 Hà Nội/Thăng Long → Map 4 Ninh Bình/Hoa Lư → Map 5 Nghệ An/Kim Liên → Map 6 Huế → Map 7 Hội An → Map 8 TP. Hồ Chí Minh/Chợ Bến Thành và Bến Nhà Rồng.

Map 1–7 dài 500m, Map 8 dài 700m. Mỗi di tích có một cổng lịch sử và một cổng địa lý. Hoàn thành map có nút sang map tiếp; có thể chọn bất kỳ map tại trang hành trình. Cấp 1 chạy chậm hơn cấp 2 và cấp 3. Điểm hoàn thành trên thiết bị được lưu riêng theo cấp học.

## Nội dung học tập

Khung chủ đề chương trình trước 2018 theo yêu cầu. 54 câu tự biên soạn có nguồn từ cơ quan di sản, bảo tàng và UNESCO; chưa đối chiếu từng bài với đúng ấn bản SGK. Không quảng bá là bản sao hoặc ngân hàng đầy đủ của SGK. Nhãn lớp/cấp là mức độ gợi ý. Cách gọi địa danh/phân vùng đặt trong bối cảnh trước 2018.

Nguồn từng câu xuất hiện sau trả lời, có trong backend/src/data/questions/journey.json. Chỉnh dữ liệu gốc tại backend/src/scripts/buildJourneyData.js rồi chạy `npm run data:journey` và `npm run seed`. Không xóa 40 câu mẫu cũ; chế độ hành trình lọc riêng curriculum=pre-2018.

## Kiểm tra

- backend: `npm test` dùng MongoDB tạm riêng.
- frontend: `npm test`, `npm run build`.
- 21 kiểm tra API và hành trình + 5 kiểm tra luật chơi đã đạt ngày 02/10/2026.

## Kiến trúc và giới hạn

shared/journey.js định nghĩa map, địa danh, cấp học và cổng kiến thức dùng chung. React quản lý giao diện; Phaser quản lý chuyển động, va chạm và vòng lặp. EventBus nối hai phía. API giấu đáp án trước trả lời. Kết quả khách có token ghi, kiểm tra nhất quán và chống lưu trùng runId. Bảng xếp hạng nhận kết quả từ client, chưa có xác thực lượt chơi phía server; không dùng cho giải đấu có thưởng.

Lưu trên máy và hàng đợi đồng bộ hỗ trợ lỗi kết nối. Câu hỏi cần API hoạt động; khi lỗi có nút thử lại hoặc tiếp tục chạy. Hộ chiếu hoàn thành map lưu trên trình duyệt, chưa đồng bộ giữa thiết bị. Hình di tích là minh họa cách điệu, không phải tái dựng kiến trúc. Chưa triển khai tài khoản đăng nhập, quản trị nội dung và triển khai production.

Tài liệu docs/PHASE1-SOURCE.md là ảnh chụp mã nguồn Phase 1 lịch sử; README này mô tả phiên bản hiện hành.
