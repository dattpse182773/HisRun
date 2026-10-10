# Cảnh chạy tỉnh/thành

Đã thay 26 cảnh SVG đơn giản bằng 26 tranh PNG v2, tạo qua công cụ image_gen tích hợp với village.png làm mẫu phong cách. Giữ 8 ảnh nền cũ. Registry `shared/provinceScenery.js` ánh xạ đủ 34 tỉnh/thành sang 34 cảnh khác nhau. Ảnh mới lưu tại frontend/public/assets/backgrounds/provinces/*-v2.png. Prompt lưu trong docs/scenery-v2-prompts.json. Script build-province-scenery.mjs chỉ tái tạo bản SVG cũ, không được dùng để thay thế tranh v2.

Đây là phong cảnh cách điệu với lối chạy giả tưởng phục vụ gameplay, không phải bản vẽ kiến trúc hay tuyến tham quan ngoài thực tế. Lớp nền tiến gần theo quãng đường, kết hợp chi tiết cây, chim, lá, thuyền, sóng nước, sương hoặc thác tùy cảnh. Dừng game cũng dừng chuyển động.

Ví dụ: Quảng Trị — Phong Nha–Kẻ Bàng (Quảng Bình cũ); Quảng Ninh — vịnh Hạ Long; Cần Thơ — chợ nổi Cái Răng. Tên địa danh của câu hỏi vẫn gắn với provinceId; sceneryMapId cũ chỉ giữ cấu hình gameplay tương thích, không quyết định hình nền tỉnh nữa.

Nguồn tham khảo địa danh:
- https://vietnam.travel/vi/place-to-go
- https://vietnam.travel/places-to-go/northern-vietnam/ha-long
- https://www.vietnam.travel/things-to-do/top-things-do-central-vietnam
- https://vietnam.travel/vi/places-to-go/southern-vietnam/can-tho
- https://vietnam.travel/vi/things-to-do/discovering-dak-lak-province

Kiểm tra: registry đủ 34 tỉnh/thành, 26 PNG khác nhau tồn tại, tỉnh cũ khớp nhóm sáp nhập; chạy renderer ở nhiều quãng đường; sự kiện filecomplete-image hiển thị đúng texture. Kiểm tra trực tiếp ba cảnh Hạ Long, Phong Nha, Cái Răng trên local.

Cập nhật v2: nền PNG nhiều chi tiết; bỏ các lớp cây/đá/thuyền hình khối đơn giản phủ lên tranh mới. Giữ hiệu ứng tiến gần, lá, chim và ánh nước nhẹ. Hình minh họa cách điệu, không cam kết từng chi tiết kiến trúc là bản phục dựng chính xác.
