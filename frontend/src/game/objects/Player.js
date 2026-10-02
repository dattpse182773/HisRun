import Phaser from 'phaser';
import { LANES } from '../systems/rules.js';

export default class Player extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, 640, 555);
    this.currentLane = 1; this.altitude = 0; this.velocity = 0; this.slideTime = 0; this.state = 'idle';
    this.collisionBody = { width: 60, height: 112, bottom: 0 };
    this.shadow = scene.add.ellipse(640, 620, 85, 20, 0x264d3f, 0.2);
    this.leftLeg = scene.add.rectangle(-15, 42, 19, 45, 0x234d45).setOrigin(0.5, 0.1);
    this.rightLeg = scene.add.rectangle(15, 42, 19, 45, 0x234d45).setOrigin(0.5, 0.1);
    this.add([this.leftLeg, this.rightLeg, scene.add.rectangle(-35, 10, 14, 43, 0xedc091).setAngle(14), scene.add.rectangle(35, 10, 14, 43, 0xedc091).setAngle(-14), scene.add.rectangle(0, 12, 56, 68, 0xe99149), scene.add.rectangle(0, 14, 39, 45, 0xb86238).setStrokeStyle(3, 0xf6bd70), scene.add.circle(0, -37, 25, 0xedc091), scene.add.rectangle(0, -61, 46, 24, 0x255b48), scene.add.ellipse(0, -49, 78, 19, 0x255b48), scene.add.rectangle(0, -51, 47, 7, 0xe9c467)]);
    scene.add.existing(this); this.setDepth(2000);
  }
  move(direction) {
    if (this.scene.tweens.isTweening(this)) return;
    this.currentLane = Phaser.Math.Clamp(this.currentLane + direction, 0, 2);
    this.scene.tweens.add({ targets: this, x: LANES[this.currentLane], duration: 150, ease: 'Sine.easeInOut' });
  }
  jump() {
    if (this.altitude > 0 || this.slideTime > 0) return false;
    this.velocity = 560; this.altitude = 0.01; this.state = 'jump'; return true;
  }
  slide() { if (this.altitude === 0 && this.slideTime <= 0) { this.slideTime = 0.6; this.state = 'slide'; } }
  tick(dt, elapsed, invincible) {
    if (this.altitude > 0) { this.velocity -= 1500 * dt; this.altitude = Math.max(0, this.altitude + this.velocity * dt); if (!this.altitude) this.velocity = 0; }
    this.slideTime = Math.max(0, this.slideTime - dt);
    this.state = invincible > 1.4 ? 'hurt' : this.altitude > 0 ? 'jump' : this.slideTime > 0 ? 'slide' : 'run';
    this.collisionBody = { width: 60, height: this.slideTime > 0 ? 48 : 112, bottom: this.altitude };
    this.scaleY = this.slideTime > 0 ? 0.42 : 1;
    this.y = 555 - this.altitude + (this.slideTime > 0 ? 39 : Math.sin(elapsed * 20) * 4);
    this.leftLeg.angle = Math.sin(elapsed * 20) * 24; this.rightLeg.angle = -this.leftLeg.angle;
    this.shadow.x = this.x; this.shadow.scaleX = Math.max(0.4, 1 - this.altitude / 300);
    this.alpha = invincible > 0 ? (Math.floor(elapsed * 12) % 2 ? 0.35 : 1) : 1;
  }
  reset() { this.scene.tweens.killTweensOf(this); this.x = 640; this.y = 555; this.currentLane = 1; this.altitude = 0; this.velocity = 0; this.slideTime = 0; this.scaleY = 1; this.alpha = 1; this.angle = 0; this.state = 'idle'; }
  destroy(fromScene) { this.shadow?.destroy(); super.destroy(fromScene); }
}
