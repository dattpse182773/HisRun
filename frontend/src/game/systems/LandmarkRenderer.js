// Original graphic silhouettes. These are stylized landmarks, not accurate reconstructions.
export function drawLandmark(g, theme, x, y, scale = 1) {
  const rect = (dx, dy, w, h, color) => g.fillStyle(color).fillRect(x + dx * scale, y + dy * scale, w * scale, h * scale);
  const circle = (dx, dy, r, color) => g.fillStyle(color).fillCircle(x + dx * scale, y + dy * scale, r * scale);
  const roof = (dx, dy, w, color) => g.fillStyle(color).fillTriangle(x + dx * scale, y + dy * scale, x + (dx + w / 2) * scale, y + (dy - 35) * scale, x + (dx + w) * scale, y + dy * scale);
  if (theme === 'mountain') {
    g.fillStyle(0x5a7868).fillEllipse(x, y - 25 * scale, 220 * scale, 170 * scale);
    g.fillStyle(0x263f37).fillEllipse(x, y + 9 * scale, 72 * scale, 102 * scale);
    rect(-114, 45, 228, 15, 0x65b8b7); return;
  }
  if (theme === 'battlefield') {
    g.fillStyle(0x78955c).fillEllipse(x, y + 10 * scale, 260 * scale, 115 * scale);
    rect(-64, -37, 128, 63, 0x827660); rect(-33, -13, 66, 39, 0x374c3d);
    rect(43, -146, 5, 109, 0x684b3a); rect(48, -146, 57, 34, 0xb7553e); circle(74, -129, 5, 0xf2d072); return;
  }
  if (theme === 'ben-thanh') {
    rect(-128, -47, 256, 100, 0xe9c891); roof(-144, -47, 288, 0xac6742);
    rect(-41, -144, 82, 197, 0xf1d7a0); roof(-54, -144, 108, 0xb9774c);
    circle(0, -107, 22, 0xfff7d9); rect(-2, -123, 4, 17, 0x405747); rect(0, -108, 12, 4, 0x405747);
    rect(-19, 7, 38, 46, 0x49634c);
  } else if (theme === 'nha-rong') {
    rect(-133, -72, 266, 125, 0xc7805c); roof(-148, -72, 296, 0x7c5141);
    rect(-127, -14, 254, 9, 0xf6dbad);
    for (let i = -108; i <= 100; i += 43) { rect(i, -50, 22, 30, 0xf9e4b7); rect(i, 8, 22, 45, 0x476659); }
    circle(-19, -110, 8, 0xe6c579); circle(19, -110, 8, 0xe6c579);
  } else if (theme === 'village') {
    rect(-102, -25, 204, 79, 0xdbc998); roof(-123, -25, 246, 0xa88a48);
    rect(-40, 3, 34, 51, 0x4d6746); rect(39, -2, 29, 32, 0x586f45);
  } else if (theme === 'port') {
    for (let i = -1; i <= 1; i++) { rect(i * 85 - 39, -56, 78, 110, 0xe0b459); roof(i * 85 - 45, -56, 90, 0x71634c); rect(i * 85 - 12, 8, 24, 46, 0x416454); circle(i * 85, -14, 11, 0xcb6e44); }
  } else {
    rect(-128, -23, 256, 77, theme === 'imperial' ? 0xb36f59 : 0xbaa279);
    for (let i = -1; i <= 1; i++) rect(i * 65 - 15, 13, 30, 41, 0x3d5f4b);
    rect(-91, -94, 182, 71, 0xdac598); roof(-110, -94, 220, theme === 'imperial' ? 0xc3994d : 0x9b6243);
    rect(-26, -139, 52, 45, 0xe3d1a2); roof(-40, -139, 80, 0xa67348);
    for (let i = -65; i <= 65; i += 32) rect(i, -71, 14, 30, 0x456751);
  }
}
