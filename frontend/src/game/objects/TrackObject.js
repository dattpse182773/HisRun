import Phaser from 'phaser';
export const POWER_NAMES = { shield: 'Khiên', magnet: 'Nam châm', clock: 'Đồng hồ', book: 'Sách tri thức', heart: 'Trái tim' };
export default class TrackObject extends Phaser.GameObjects.Container {
  constructor(scene, type, lane, z = 1400) {
    super(scene, 0, 0); this.kind = type; this.lane = lane; this.z = z; this.checked = false;
    const g = scene.add.graphics(); this.add(g);
    if (type === 'coin') { g.fillStyle(0xf0bb3f).fillCircle(0, -35, 23); g.lineStyle(4, 0xffed9d).strokeCircle(0, -35, 18); g.lineStyle(4, 0xffed9d).lineBetween(0, -46, 0, -24); }
    else if (type === 'rock') { g.fillStyle(0x5e7566).fillPoints([{ x: -64, y: 0 }, { x: -55, y: -90 }, { x: -15, y: -125 }, { x: 47, y: -100 }, { x: 66, y: 0 }], true); g.fillStyle(0x93a390).fillTriangle(-55, -90, -15, -125, 12, -66); }
    else if (type === 'branch') { g.fillStyle(0x79563a).fillRect(-82, -150, 15, 150).fillRect(67, -150, 15, 150).fillRect(-85, -150, 170, 73); g.fillStyle(0x44805a).fillEllipse(0, -165, 205, 51); this.add(scene.add.text(0, -127, 'TRƯỢT', { fontSize: '20px', fontStyle: 'bold', color: '#fff8dc' }).setOrigin(0.5)); }
    else if (type === 'pit') { g.fillStyle(0x414939).fillEllipse(0, -2, 154, 65); g.lineStyle(6, 0xaa8853).strokeEllipse(0, -2, 154, 65); }
    else if (['log', 'fence', 'trap'].includes(type)) { g.fillStyle(type === 'trap' ? 0xb95d3c : 0x97643a).fillRoundedRect(-74, -49, 148, 49, 12); g.lineStyle(5, 0xe0aa65).lineBetween(-65, -30, 66, -30); g.fillStyle(0xe6bd78).fillEllipse(64, -24, 22, 46); }
    else if (type === 'gate') { g.fillStyle(0x27594f).fillRect(-460, -265, 27, 265).fillRect(433, -265, 27, 265).fillRoundedRect(-490, -285, 980, 72, 15); g.lineStyle(7, 0xe8c160).strokeRoundedRect(-490, -285, 980, 72, 15); this.add(scene.add.text(0, -250, '✦  CỔNG TRI THỨC  ✦', { fontSize: '34px', fontFamily: 'Arial', fontStyle: 'bold', color: '#fff0af' }).setOrigin(0.5)); }
    else {
      const colors = { shield: 0x6fbec9, magnet: 0xd57b60, clock: 0x8fa6df, book: 0xd4ad50, heart: 0xe78080 };
      g.fillStyle(colors[type]).fillCircle(0, -42, 34); g.lineStyle(4, 0xfff4d4).strokeCircle(0, -42, 30);
      this.add(scene.add.text(0, -44, { shield: '◇', magnet: 'U', clock: '◷', book: '▤', heart: '♥' }[type], { fontSize: '34px', color: '#fffbea' }).setOrigin(0.5));
    }
    scene.add.existing(this);
  }
  project(elapsed) {
    const depth = Math.max(0.01, 1 - this.z / 1600); const perspective = depth * depth;
    this.x = 640 + (this.lane - 1) * 280 * perspective; this.y = 315 + 310 * perspective;
    this.setScale(Math.max(0.03, perspective));
    if (this.kind === 'coin') this.scaleX *= 0.35 + Math.abs(Math.cos(elapsed * 5)) * 0.65;
    this.setDepth(Math.round(1000 - this.z));
  }
}
