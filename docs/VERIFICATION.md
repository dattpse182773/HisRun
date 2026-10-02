# Verification — 02/10/2026

- Frontend production build: passed.
- Frontend rules: 5/5 passed (safe lanes, difficulty cap, jump/slide collision rules, score/combo, restart isolation).
- Backend: 21/21 passed using isolated ephemeral MongoDB. Covers original APIs, private write token, duplicate result idempotency, profile/leaderboard aggregation, 54 map/curriculum/landmark/subject combinations, exclusions, source visibility, invalid filters, north–south ordering and gate distances.
- Local journey seed inserted 54 records without deleting old questions.
- Browser: Map 8 selected; Bến Nhà Rồng history question displayed; correct answer revealed explanation and official source link; completed at 700m; result showed successful server save; journey passport showed 1/8 completed.
- Viewports inspected: desktop 1440×1000 and mobile 390×844. Modal, canvas, school selector and map page rendered.
- Services: frontend localhost:5173, backend localhost:5000, development MongoDB 127.0.0.1:27017.

Scope limits: did not manually finish every map at every school level. Exact SGK editions were not supplied; questions are original, source-linked, and textbookVerified=false. Client-reported leaderboard remains unverified against authoritative game sessions. Browser completion passport is local to the device.

## Responsive update

- Added shared responsive stylesheet, active navigation, safe-area spacing and modal body scroll lock.
- Browser inspected maps at 320, 520, 768 and 1440px: no horizontal overflow; all navigation links visible with 44px height.
- Home/profile checked at 320px: no horizontal overflow.
- Game at 390×844: touch controls 82×73px within viewport, single-column question answers.
- Landscape 844×390: canvas bottom 375px; four touch controls 56×64px.
- Production build passed after final landscape correction. Checks use browser viewport emulation, not physical devices.
