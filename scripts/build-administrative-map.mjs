import fs from 'node:fs';
import { OLD_PROVINCES, PROVINCES, provinceKey } from '../shared/provinces.js';
// Geographic data: Nguyen Duy Liem (2025), Free-GIS-Data, commit ccb9f4ae992418bfeefd06da1eb42d0249632176.
// Simplified equirectangular projection for an educational SVG, not a legal boundary reference.
function simplify(points, epsilon = .009) {
  if (points.length < 4) return points;
  const [ax, ay] = points[0], [bx, by] = points.at(-1); const dx = bx - ax, dy = by - ay;
  let max = 0, index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [x, y] = points[i]; const t = dx || dy ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy))) : 0;
    const d = Math.hypot(x - ax - t * dx, y - ay - t * dy);
    if (d > max) { max = d; index = i; }
  }
  return max > epsilon ? [...simplify(points.slice(0, index + 1), epsilon).slice(0, -1), ...simplify(points.slice(index), epsilon)] : [points[0], points.at(-1)];
}
const project = ([x, y]) => [+(25 + (x - 102) * 30).toFixed(1), +(25 + (24 - y) * 32).toFixed(1)];
function path(geometry) {
  const polygons = geometry.type === 'MultiPolygon' ? geometry.coordinates : [geometry.coordinates];
  return polygons.flatMap(p => p.map(ring => {
    const reduced = simplify(ring); const points = reduced.length < 4 ? ring : reduced;
    return 'M' + points.map(project).map(p => p.join(',')).join('L') + 'Z';
  })).join('');
}
const result = {};
for (const era of ['63', '34']) {
  const geo = JSON.parse(fs.readFileSync(`docs/map-source/${era}.geojson`, 'utf8'));
  const catalogue = era === '63' ? OLD_PROVINCES : PROVINCES;
  const collected = new Map();
  for (const feature of geo.features) {
    // Upstream row Ma=31 is the Dong Thap/Tien Giang southern geometry but its
    // descriptive columns were copied from Lang Son. Ma=11 is the real Lang Son.
    const sourceName = era === '34' && feature.properties.Ma === '31' ? 'Đồng Tháp' : feature.properties.Name || feature.properties.TinhThanh;
    const id = provinceKey(sourceName);
    const entry = catalogue.find(p => p.id === id);
    if (!entry) throw new Error(`Unknown province: ${id}`);
    if (!collected.has(id)) collected.set(id, { id, name: entry.name, d: '' });
    collected.get(id).d += path(feature.geometry);
  }
  result[era] = [...collected.values()].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  if (result[era].length !== +era) throw new Error(`Expected ${era} provinces`);
}
fs.mkdirSync('frontend/src/data', { recursive: true });
fs.writeFileSync('frontend/src/data/vietnam-boundaries.json', JSON.stringify(result));
console.log(Object.fromEntries(Object.entries(result).map(([era, rows]) => [era, rows.length])));
