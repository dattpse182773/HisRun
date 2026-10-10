# Vietnam educational administrative map

Input geometry: Nguyễn Duy Liêm (2025), Free-GIS-Data, retrieved 2026-10-05.
https://github.com/nguyenduy1133/Free-GIS-Data
Commit: ccb9f4ae992418bfeefd06da1eb42d0249632176.
The repository allows free use and requests author attribution, displayed in the map's sources panel.

63.geojson: pre-2025 Provinces_included_Paracel_SpratlyIslands_combine.geojson (65 features; two detached island geometries are grouped under Đà Nẵng and Khánh Hòa).
34.geojson: post-2025 Provinces.geojson.

Important upstream correction: post-2025 row Ma=31 contains the southern Đồng Tháp / Tiền Giang geometry (first vertex 106.79046 E, 10.21334 N), but descriptive fields repeat Lạng Sơn. The builder explicitly labels this row Đồng Tháp. The actual Lạng Sơn geometry is Ma=11 (106.31141 E, 21.45183 N). No upstream demographic figures or codes are shown in the app.

Merger membership independently follows Nghị quyết 202/2025/QH15, as published by Báo Chính phủ:
https://xaydungchinhsach.chinhphu.vn/chi-tiet-34-don-vi-hanh-chinh-cap-tinh-tu-12-6-2025-119250612141845533.htm
Effective date 12 June 2025; newly formed governments operational 1 July 2025. Huế was already a centrally governed city from 1 January 2025; its historical name Thừa Thiên Huế is normalized for the 63-unit snapshot.

Build with `node scripts/build-administrative-map.mjs`. RDP tolerance .009 degrees; equirectangular illustration, not a legal boundary reference. Original geographic files are retained for reproduction. Hoàng Sa / Trường Sa geometry and visible selectable labels remain on both layers.

All 97 administrative quizzes are supplementary 2025 knowledge, not attributed to pre-2018 textbooks. Existing historical questions retain historical location names, with a separate present-day note. A province without an existing historical runner map is clearly marked; other provinces' landmarks are not misassigned to it.
