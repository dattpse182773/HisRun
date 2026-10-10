import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { OLD_PROVINCES, PROVINCES, currentProvince, mapsForProvince, provinceNote, provinceQuiz } from '../../shared/provinces.js';
import { CHARACTERS } from '../src/game/characters.js';
import { gaitAdvance, gaitPose, rigParts } from '../src/game/runRig.js';
const boundaries = JSON.parse(fs.readFileSync(new URL('../src/data/vietnam-boundaries.json', import.meta.url)));
test('63 old areas belong to exactly one of 34 current provinces and all have geometry', () => {
  assert.equal(PROVINCES.length, 34); assert.equal(OLD_PROVINCES.length, 63);
  assert.equal(new Set(OLD_PROVINCES.map(p => p.id)).size, 63);
  for (const [era, catalogue] of [['63', OLD_PROVINCES], ['34', PROVINCES]]) {
    assert.deepEqual(boundaries[era].map(p => p.id).sort(), catalogue.map(p => p.id).sort());
    for (const p of boundaries[era]) { assert.ok(p.d.startsWith('M')); assert.ok(p.d.endsWith('Z')); const q = provinceQuiz(p.name, era); assert.equal(new Set(q.choices).size, 4); assert.ok(q.choices.includes(q.answer)); }
  }
});
test('merger notes preserve historical areas and distinguish unchanged provinces', () => {
  assert.equal(currentProvince('Bình Dương').name, 'TP. Hồ Chí Minh');
  assert.deepEqual(currentProvince('Bình Dương').members, ['TP. Hồ Chí Minh', 'Bình Dương', 'Bà Rịa - Vũng Tàu']);
  assert.match(provinceNote('Bình Dương'), /01\/7\/2025/); assert.match(provinceNote('Bình Dương'), /12\/6\/2025/);
  assert.match(provinceNote('Nghệ An'), /không sáp nhập/);
  assert.match(provinceNote('Huế'), /01\/01\/2025/);
  assert.deepEqual(mapsForProvince('Quảng Nam', '63'), ['map-07']);
  assert.deepEqual(mapsForProvince('Đà Nẵng', '34'), ['map-07']);
  assert.deepEqual(mapsForProvince('Bình Dương', '63'), []);
  assert.deepEqual(mapsForProvince('TP. Hồ Chí Minh', '34'), ['map-08']);
});
test('every character has two separate in-bounds leg frames below a measured costume hem', () => {
  assert.equal(CHARACTERS.length, 24);
  for (const c of CHARACTERS) {
    const parts = rigParts(c.frame);
    assert.ok(parts.left.x + parts.left.width <= parts.right.x);
    for (const p of [parts.body, parts.left, parts.right]) { assert.ok(p.width > 0 && p.height > 0); assert.ok(p.x >= 0 && p.y >= 0 && p.x + p.width <= 1536 && p.y + p.height <= 1024); }
  }
});
test('feet exchange lifted and planted positions every half cycle, independent of frame rate', () => {
  const a = gaitPose(Math.PI / 2), b = gaitPose(Math.PI * 1.5);
  assert.equal(a.left.lift, 1); assert.equal(a.right.lift, 0);
  assert.equal(b.left.lift, 0); assert.equal(b.right.lift, 1);
  assert.ok(a.left.scaleY < a.right.scaleY); assert.ok(b.right.scaleY < b.left.scaleY);
  assert.ok(Math.abs(gaitAdvance(1 / 60) * 60 - gaitAdvance(1 / 30) * 30) < 1e-10);
  assert.ok(gaitAdvance(.1, 340) > gaitAdvance(.1, 240));
});
