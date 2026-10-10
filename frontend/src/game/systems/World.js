import { getProvinceScenery } from '../../../../shared/provinceScenery.js';
import { EXPLORATION_MAPS } from '../../../../shared/exploration.js';
import { getMap } from '../../../../shared/journey.js';
import { drawLandmark } from './LandmarkRenderer.js';
import { SCENERY, backgroundUrl, projectTrack } from '../scenery.js';
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
    this.backdrop = scene.add.image(640, 360, '__WHITE').setDisplaySize(1280, 720).setDepth(-1800).setVisible(false);
    this.loading = new Set();
    this.details = scene.add.graphics().setDepth(-1400);
    this.ambient = scene.add.graphics().setDepth(-1600);
    this.distance = 0;
    this.label = scene.add.text(28, 125, '', { fontFamily: 'Arial', fontSize: '22px', color: '#fff4d7', backgroundColor: '#203c32dd', padding: { x: 14, y: 10 }, fontStyle: 'bold' }).setDepth(2100);
    this.landmarkLabels = [];
    this.setMap('map-01');
  }
  setMap(id, provinceId) {
    this.province = EXPLORATION_MAPS.find(p => p.id === provinceId);
    this.destination = getProvinceScenery(provinceId);
    this.distance = 0;
    this.details.clear(); this.ambient.clear(); this.marks.clear();
    this.backdrop.setPosition(640, 360).setDisplaySize(1280, 720);
    this.map = getMap(id); this.horizon = this.destination?.horizon || SCENERY[this.map.theme].horizon; this.paint();
    const destination = this.destination;
    const theme = this.map.theme, key = destination && !destination.legacy ? `province-scenery-${provinceId}` : `scenery-${theme}`;
    this.sceneryKey = key;
    this.backdrop.setVisible(false);
    const show = () => {
      this.loading.delete(key);
      if (!this.scene.sys.isActive() || this.sceneryKey !== key) return;
      this.backdrop.setTexture(key).setDisplaySize(1280, 720).setVisible(true);
      this.moveBackdrop(this.distance);
      this.landmarkLabels.forEach(label => label.setVisible(false));
      this.label.setText(this.province ? `MAP ${this.province.number} · ${this.province.name.toUpperCase()}\n${destination.name}` : `MAP ${this.map.number} · ${this.map.name.toUpperCase()}\n${SCENERY[theme].name}`);
    };
    if (this.scene.textures.exists(key)) { show(); return; }
    if (this.loading.has(key)) return;
    this.loading.add(key);
    this.scene.load.once(`filecomplete-${destination?.url.endsWith('.svg') ? 'svg' : 'image'}-${key}`, show);
    if (destination?.url.endsWith('.svg')) this.scene.load.svg(key, destination.url, { width: 1280, height: 720 });
    else this.scene.load.image(key, destination?.url || backgroundUrl(theme));
    if (!this.scene.load.isLoading()) this.scene.load.start();
  }
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
  moveBackdrop(distance) {
    // Advance toward the vanishing point without a looping zoom/reset.
    const progress = Math.min(distance / (this.scene.state?.distanceTarget || 700), 1);
    const zoom = 1 + progress * 0.85;
    this.backdrop.setDisplaySize(1280 * zoom, 720 * zoom);
    this.backdrop.setPosition(this.horizon.x + (640 - this.horizon.x) * zoom,
      this.horizon.y + (360 - this.horizon.y) * zoom);
  }
  tick(distance) {
    this.distance = distance;
    this.moveBackdrop(distance);
    this.drawPassingDetails(distance);
    if (this.destination && !this.destination.legacy) this.drawDestinationMotion(distance);
    const g = this.marks; g.clear();
    // Moving ground detail carries speed while landmarks remain stable and readable.
    for (let i = 0; i < 22; i++) {
      const depth = ((i / 22 + distance / 105) % 1) ** 1.6;
      const point = projectTrack((i % 3) * 0.8 + 0.2, depth * 1.3, this.horizon);
      g.lineStyle(2 + depth * 2, 0x735531, 0.12 + depth * 0.13);
      g.lineBetween(point.x, point.y, point.x + 8 + depth * 16, point.y + 2 + depth * 6);
    }
  }
  drawDestinationMotion(distance) {
    const a = this.ambient, env = this.destination.environment;
    if (['sea','river','wetland','lake'].includes(env)) {
      for (let i = 0; i < 30; i++) {
        const side = i % 2 ? 1 : -1, depth = .16 + ((i * .071 + distance * .0015) % .75);
        const x = 640 + side * (135 + depth * 650), y = 337 + depth * 330;
        a.lineStyle(1 + depth * 2, 0xe5f3d4, .45).lineBetween(x, y, x + 15 + Math.sin(distance * .16 + i) * 9 + depth * 22, y);
      }
      if (!this.destination.illustrated && ['market','bay','islands','coconut','mangrove','cave'].includes(this.destination.design)) {
        for (let i = 0; i < 3; i++) {
          const x = i % 2 ? 995 + Math.sin(distance * .012 + i) * 80 : 145 + Math.sin(distance * .014 + i) * 90;
          const y = 415 + i * 30 + Math.sin(distance * .1 + i) * 3;
          a.fillStyle(0x74472f).fillTriangle(x - 39, y, x + 45, y, x + 25, y + 14).fillTriangle(x - 39,y,x+25,y+14,x-22,y+14);
          a.lineStyle(3,0xe3b876).lineBetween(x-39,y,x+45,y);
          a.fillStyle(0xdcc789).fillRect(x-13,y-19,31,18);
          if (this.destination.design === 'market') for(let fruit=0;fruit<4;fruit++) a.fillStyle(fruit%2?0xebc351:0x81ae4f).fillCircle(x-25+fruit*12,y-4,5);
        }
      }
    }
    if (!this.destination.illustrated && this.destination.design === 'waterfall') for(let i=0;i<15;i++) {
      const x=74+i*21, y=280+((distance*6+i*23)%145);
      a.lineStyle(3,0xf5fff1,.55).lineBetween(x,y,x-2,y+18);
    }
    if (['mountain','pine'].includes(env)) {
      for(let i=0;i<3;i++) a.fillStyle(0xf5f2d9,.14).fillEllipse((i*460+distance*.5)%1600-160,210+i*30,330,22);
    }
  }
  drawPassingDetails(distance) {
    const g = this.details; g.clear();
    // World-space roadside objects grow and pass the camera; recycle only off-screen.
    for (let i = 0; i < 32; i++) {
      const travel = ((distance + i * 13) % 208) / 208;
      const p = 0.025 / (1.025 - travel);
      const side = i % 2 ? 1 : -1;
      const x = this.horizon.x + side * (570 + (i % 4) * 115) * p;
      const y = this.horizon.y + 700 * p;
      const s = p * 2.4;
      if (this.destination?.illustrated || (this.destination && !this.destination.legacy && ['sea','river','wetland','lake'].includes(this.destination.environment))) continue;
      if (y > 820) continue;
      const sway = Math.sin(distance * 0.11 + i) * 8 * s;
      if (i % 4 === 0) {
        g.fillStyle(0x365b28, 0.25).fillEllipse(x, y, 100 * s, 18 * s);
        g.fillStyle(0x77502b).fillRect(x - 6 * s, y - 115 * s, 12 * s, 115 * s);
        g.fillStyle(0x285b2c).fillCircle(x + sway, y - 130 * s, 39 * s)
          .fillCircle(x - 26 * s + sway, y - 103 * s, 29 * s)
          .fillCircle(x + 28 * s + sway, y - 107 * s, 32 * s);
        g.fillStyle(0x5b9438).fillCircle(x - 13 * s + sway, y - 143 * s, 22 * s);
      } else if (i % 4 === 1) {
        g.fillStyle(0x8b8c70).fillTriangle(x - 18 * s, y, x - 7 * s, y - 20 * s, x + 23 * s, y);
        g.fillStyle(0xb2b095).fillTriangle(x - 18 * s, y, x - 7 * s, y - 20 * s, x + 2 * s, y - 3 * s);
      } else {
        g.lineStyle(Math.max(1, 3 * s), 0x487a2f, 0.85);
        for (let blade = -1; blade <= 1; blade++) {
          g.lineBetween(x, y, x + blade * 15 * s + sway, y - (23 - Math.abs(blade) * 7) * s);
        }
        if (i % 5 === 0) g.fillStyle(0xf3ce6c).fillCircle(x + sway, y - 24 * s, 4 * s);
      }
    }
    const a = this.ambient; a.clear();
    // Small drifting leaves and flapping birds vary independently of road marks.
    for (let i = 0; i < 9; i++) {
      const x = (i * 163 + distance * (0.65 + i % 3 * 0.2)) % 1400 - 60;
      const y = 300 + (i * 47 + distance * 1.1) % 410;
      a.fillStyle(i % 2 ? 0x9cba41 : 0xd1aa47, 0.7);
      a.fillEllipse(x, y + Math.sin(distance * 0.12 + i) * 15, 7 + Math.sin(distance * 0.2 + i) * 4, 4);
    }
    for (let i = 0; i < 3; i++) {
      const x = (200 + i * 45 + distance * 0.4) % 1100;
      const y = 100 + i * 18 + Math.sin(distance * 0.025 + i) * 8;
      const wing = Math.sin(distance * 0.5 + i) * 5;
      a.lineStyle(2, 0x355956, 0.65).lineBetween(x - 8, y - wing, x, y).lineBetween(x, y, x + 8, y - wing);
    }
  }
}

// Province scenery and ambient motion are loaded together.
