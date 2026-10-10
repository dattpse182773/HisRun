import Phaser from 'phaser';
import { projectTrack } from '../scenery.js';
import { TOKENS } from '../../../../shared/tokens.js';
export const POWER_NAMES = Object.fromEntries(Object.entries(TOKENS).map(([key, token]) => [key, token.name]));
export default class TrackObject extends Phaser.GameObjects.Container {
  constructor(scene, type, lane, z = 1400) {
    super(scene, 0, 0); this.kind = type; this.lane = lane; this.z = z; this.checked = false;
    const g = scene.add.graphics(); this.add(g);
    if (type === 'question') { g.fillStyle(0x257f91).fillCircle(0,-65,52); g.lineStyle(6,0xffda78).strokeCircle(0,-65,52); this.add(scene.add.text(0,-66,'?',{fontSize:'64px',fontStyle:'bold',color:'#fff2bf'}).setOrigin(.5)); this.add(scene.add.text(0,-132,'CÂU HỎI',{fontSize:'20px',color:'#fff2bf',backgroundColor:'#215a66',padding:{x:8,y:5}}).setOrigin(.5)); }
    else if (type === 'coin') { g.fillStyle(0xf0bb3f).fillCircle(0, -35, 23); g.lineStyle(4, 0xffed9d).strokeCircle(0, -35, 18); g.lineStyle(4, 0xffed9d).lineBetween(0, -46, 0, -24); }
    else if (type === 'rock') { g.fillStyle(0x5e7566).fillPoints([{ x: -64, y: 0 }, { x: -55, y: -90 }, { x: -15, y: -125 }, { x: 47, y: -100 }, { x: 66, y: 0 }], true); g.fillStyle(0x93a390).fillTriangle(-55, -90, -15, -125, 12, -66); }
    else if (type === 'branch') { g.fillStyle(0x79563a).fillRect(-82, -150, 15, 150).fillRect(67, -150, 15, 150).fillRect(-85, -150, 170, 73); g.fillStyle(0x44805a).fillEllipse(0, -165, 205, 51); this.add(scene.add.text(0, -127, 'TRƯỢT', { fontSize: '20px', fontStyle: 'bold', color: '#fff8dc' }).setOrigin(0.5)); }
    else if (type === 'pit') { g.fillStyle(0x414939).fillEllipse(0, -2, 154, 65); g.lineStyle(6, 0xaa8853).strokeEllipse(0, -2, 154, 65); }
    else if (['log', 'fence', 'trap'].includes(type)) { g.fillStyle(type === 'trap' ? 0xb95d3c : 0x97643a).fillRoundedRect(-74, -49, 148, 49, 12); g.lineStyle(5, 0xe0aa65).lineBetween(-65, -30, 66, -30); g.fillStyle(0xe6bd78).fillEllipse(64, -24, 22, 46); }
    else if (type === 'gate') { g.fillStyle(0x27594f).fillRect(-460, -265, 27, 265).fillRect(433, -265, 27, 265).fillRoundedRect(-490, -285, 980, 72, 15); g.lineStyle(7, 0xe8c160).strokeRoundedRect(-490, -285, 980, 72, 15); this.add(scene.add.text(0, -250, '✦  CỔNG TRI THỨC  ✦', { fontSize: '34px', fontFamily: 'Arial', fontStyle: 'bold', color: '#fff0af' }).setOrigin(0.5)); }
    else {
      const token = TOKENS[type];
      g.fillStyle(Number.parseInt(token.color.slice(1), 16));
      if (token.harmful) g.fillRoundedRect(-43, -82, 86, 80, 12); else g.fillCircle(0, -42, 40);
      g.lineStyle(4, 0xfff4d4).strokeCircle(0, -42, 34);
      this.add(scene.add.text(0, -44, token.icon, { fontSize: token.icon.length > 2 ? '25px' : '34px', fontStyle: 'bold', color: '#fffbea' }).setOrigin(0.5));
      this.add(scene.add.text(0, -100, token.name.toUpperCase(), { fontSize: '16px', fontStyle: 'bold', color: '#fffbea', backgroundColor: token.color, padding: { x: 7, y: 4 } }).setOrigin(.5));
    }
    scene.add.existing(this);
  }
  project(elapsed) {
    const depth = Math.max(0.01, 1 - this.z / 1600); const perspective = depth * depth;
    const point = projectTrack(this.lane, perspective, this.scene.world.horizon);
    this.x = point.x; this.y = point.y;
    this.setScale(Math.max(0.03, perspective));
    if (this.kind === 'coin') this.scaleX *= 0.35 + Math.abs(Math.cos(elapsed * 5)) * 0.65;
    this.setDepth(Math.round(1000 - this.z));
  }
}
