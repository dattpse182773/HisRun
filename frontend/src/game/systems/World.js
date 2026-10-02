import { getMap } from '../../../../shared/journey.js';
import { drawLandmark } from './LandmarkRenderer.js';
const COLORS = {
  mountain: [0xc5e2d8, 0x83a57c, 0x628c80, 0xddc592],
  battlefield: [0xd9e2c6, 0x9ab26b, 0x738957, 0xd1b981],
  citadel: [0xe4e4ce, 0xa8b983, 0x96ad88, 0xdcca9b],
  karst: [0xc3dfdf, 0x91b9a0, 0x5d8d81, 0xdbc994],
  village: [0xe2e7c5, 0x9cb870, 0x89a269, 0xdfc48a],
  imperial: [0xe4d9d1, 0x9cad85, 0x8f9e8c, 0xd5bfa2],
  port: [0xd9e6dc, 0x79b6b0, 0x9aaf95, 0xe5c78f],
  saigon: [0xc8e0dc, 0x8cbdb0, 0x96aaa1, 0xd8c5a4],
};
export default class World {
  constructor(scene) {
    this.scene = scene; this.graphics = scene.add.graphics().setDepth(-2000); this.marks = scene.add.graphics().setDepth(-1500);
    this.label = scene.add.text(28, 22, '', { fontFamily: 'Arial', fontSize: '24px', color: '#234d41', fontStyle: 'bold' }).setDepth(2100);
    this.landmarkLabels = [];
    this.setMap('map-01');
  }
  setMap(id) { this.map = getMap(id); this.paint(); }
  paint() {
    this.landmarkLabels.forEach(label => label.destroy()); this.landmarkLabels = [];
    const map = this.map, [sky, ground, mountain, road] = COLORS[map.theme]; this.name = map.name;
    this.label.setText('MAP ' + map.number + ' · ' + map.name.toUpperCase());
    const g = this.graphics; g.clear();
    g.fillStyle(sky).fillRect(0, 0, 1280, 720); g.fillStyle(0xfff0ba).fillCircle(1030, 104, 49);
    g.fillStyle(0xf2f3df, 0.8).fillEllipse(285, 113, 230, 35).fillEllipse(229, 94, 106, 56).fillEllipse(800, 156, 200, 27);
    g.fillStyle(mountain);
    for (let x = -100; x < 1280; x += 200) {
      if (map.theme === 'saigon') { g.fillRect(x, 170 + (x % 3) * 20, 120, 220); g.fillStyle(0xd9e5d2).fillRect(x + 25, 220, 22, 30).fillRect(x + 73, 220, 22, 30); g.fillStyle(mountain); }
      else if (['mountain','battlefield','karst'].includes(map.theme)) g.fillTriangle(x, 390, x + 125, map.theme === 'karst' ? 185 : 140, x + 280, 390);
      else g.fillEllipse(x + 100, 345, 380, 135);
    }
    g.fillStyle(ground).fillRect(0, 380, 1280, 340);
    g.lineStyle(7, 0xe1dfa5, 0.5); for (let y = 425; y < 720; y += 64) g.lineBetween(0, y, 1280, y + 30);
    if (['karst','imperial','port','saigon'].includes(map.theme)) { g.fillStyle(0x6faeae).fillRect(0, 430, 1280, 74); g.lineStyle(3, 0xc0dccc, 0.65).lineBetween(0, 458, 1280, 458).lineBetween(0, 478, 1280, 478); }
    g.fillStyle(road).fillPoints([{ x: 590, y: 315 }, { x: 690, y: 315 }, { x: 1190, y: 720 }, { x: 90, y: 720 }], true);
    g.lineStyle(3, 0xffefc3, 0.6).lineBetween(624, 315, 457, 720).lineBetween(657, 315, 823, 720);
    if (map.theme === 'saigon') { drawLandmark(g, 'ben-thanh', 200, 411, 0.92); drawLandmark(g, 'nha-rong', 1070, 398, 0.92); }
    else { drawLandmark(g, map.theme, 205, 410, 1.05); this.tree(g, 1090, 350, 1.4); }
    map.landmarks.forEach((landmark, index) => {
      this.landmarkLabels.push(this.scene.add.text(index ? 1070 : 205, 490, landmark.name, { fontFamily: 'Arial', fontSize: '19px', color: '#244e3d', backgroundColor: '#f6efce', padding: { x: 10, y: 7 } }).setOrigin(0.5).setDepth(-1000));
    });
  }
  tree(g, x, y, scale) {
    g.fillStyle(0x786442).fillRect(x - 7 * scale, y, 14 * scale, 116 * scale);
    g.fillStyle(0x487650).fillCircle(x, y - 20 * scale, 39 * scale).fillCircle(x - 28 * scale, y + 9 * scale, 35 * scale).fillCircle(x + 29 * scale, y + 7 * scale, 33 * scale);
  }
  tick(distance) {
    const g = this.marks; g.clear(); g.lineStyle(3, 0xa77a4e, 0.4);
    for (let i = 0; i < 12; i++) { const depth = ((i / 12 + distance / 80) % 1) ** 1.6; const y = 320 + depth * 420; const x = 640 + (i % 2 ? -1 : 1) * (20 + depth * 260); g.lineBetween(x, y, x + 12 + depth * 22, y); }
  }
}
