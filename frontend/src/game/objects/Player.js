import { audioManager } from '../systems/AudioManager.js';
import Phaser from 'phaser';
import { LANES } from '../systems/rules.js';
import { getCharacter } from '../characters.js';
import { gaitAdvance, gaitPose, rigParts } from '../runRig.js';
import { effectiveSpeed } from '../../../../shared/tokens.js';

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
    this.fallbackParts = [...this.list];
    if (scene.textures.exists('zodiac-rear-0')) {
      this.avatar = scene.add.image(0, -29, 'zodiac-rear-0', 'ty-nam').setOrigin(0.5, 0.5);
      this.add(this.avatar); this.fallbackParts.forEach(part => part.setVisible(false));
      if (scene.textures.exists('zodiac-run-rig')) {
        this.runRig = scene.add.container(0, -125);
        this.runLeft = scene.add.image(0, 0, 'zodiac-run-rig', 'ty-nam-left').setOrigin(.5, 0);
        this.runRight = scene.add.image(0, 0, 'zodiac-run-rig', 'ty-nam-right').setOrigin(.5, 0);
        this.runBody = scene.add.image(0, 0, 'zodiac-run-rig', 'ty-nam-body').setOrigin(.5, 0);
        this.runRig.add([this.runLeft, this.runRight, this.runBody]); this.add(this.runRig);
      }
      this.setCharacter('ty-nam');
    }
  }
  setCharacter(id) {
    this.character = getCharacter(id);
    if (this.avatar) { this.avatar.setTexture('zodiac-rear-0', this.character.id); this.avatar.setDisplaySize(112, 192).setY(-29).setAngle(0); }
    this.gaitPhase = 0;
    if (this.runRig) {
      const parts = rigParts(this.character.frame), sx = 112 / parts.frame.width, sy = 192 / parts.frame.height;
      this.rigScale = { x: sx, y: sy };
      for (const [name, sprite] of [['left', this.runLeft], ['right', this.runRight], ['body', this.runBody]]) {
        const p = parts[name]; sprite.setTexture('zodiac-run-rig', `${this.character.id}-${name}`).setScale(sx, sy).setAngle(0);
        sprite.x = name === 'body' ? 0 : (p.x + p.width / 2 - parts.frame.x - parts.frame.width / 2) * sx;
        sprite.y = (p.y - parts.frame.y) * sy; sprite.restY = sprite.y;
      }
      this.runRig.setVisible(true).setAngle(0).setY(-125); this.avatar.setVisible(false);
    }
  }
  move(direction) {
    if (this.scene.tweens.isTweening(this) || this.currentLane + direction < 0 || this.currentLane + direction > 2) return false;
    this.currentLane = Phaser.Math.Clamp(this.currentLane + direction, 0, 2);
    this.scene.tweens.add({ targets: this, x: LANES[this.currentLane], duration: 150, ease: 'Sine.easeInOut' }); return true;
  }
  jump() {
    if (this.altitude > 0 || this.slideTime > 0) return false;
    this.velocity = 560; this.altitude = 0.01; this.state = 'jump'; return true;
  }
  slide() { if (this.altitude === 0 && this.slideTime <= 0) { this.slideTime = 0.65; this.state = 'roll'; return true; } return false; }
  tick(dt, elapsed, invincible) {
    const wasAirborne = this.altitude > 0;
    if (this.altitude > 0) { this.velocity -= 1500 * dt; this.altitude = Math.max(0, this.altitude + this.velocity * dt); if (!this.altitude) this.velocity = 0; }
    if (wasAirborne && this.altitude === 0) audioManager.play('land');
    this.slideTime = Math.max(0, this.slideTime - dt);
    this.state = invincible > 1.4 ? 'hurt' : this.altitude > 0 ? 'jump' : this.slideTime > 0 ? 'roll' : 'run';
    this.collisionBody = { width: 60, height: this.slideTime > 0 ? 48 : 112, bottom: this.altitude };
    this.scaleY = this.avatar ? 1 : this.slideTime > 0 ? 0.42 : 1;
    this.y = 555 - this.altitude;
    this.leftLeg.angle = Math.sin(elapsed * 20) * 24; this.rightLeg.angle = -this.leftLeg.angle;
    if (this.avatar) {
      const stride = this.altitude > 0 || this.slideTime > 0 ? 0 : Math.floor(elapsed * 8) % 2;
      const texture = this.scene.textures.exists(`zodiac-rear-${stride}`) ? `zodiac-rear-${stride}` : 'zodiac-rear-0';
      const rolling = this.slideTime > 0;
      this.avatar.setTexture(rolling && this.scene.textures.exists('zodiac-roll') ? 'zodiac-roll' : texture, this.character.id).setDisplaySize(rolling ? 76 : 112, rolling ? 88 : 192).setY(rolling ? 30 : -29);
      this.avatar.setAngle(rolling ? (1 - this.slideTime / 0.65) * 360 : this.altitude > 0 ? -5 : Math.sin(elapsed * 16) * 3);
      if (this.runRig) {
        const running = !rolling && this.altitude === 0;
        this.runRig.setVisible(running); this.avatar.setVisible(!running);
        if (running) {
          this.gaitPhase += gaitAdvance(dt, this.scene.state ? effectiveSpeed(this.scene.state) : 300);
          const pose = gaitPose(this.gaitPhase);
          this.runRig.setY(-125 + pose.bob).setAngle(pose.lean);
          for (const [sprite, leg] of [[this.runLeft, pose.left], [this.runRight, pose.right]]) sprite.setScale(this.rigScale.x, this.rigScale.y * leg.scaleY).setY(sprite.restY + leg.y).setAngle(leg.angle);
        }
      }
    }
    this.shadow.x = this.x; this.shadow.scaleX = Math.max(0.4, 1 - this.altitude / 300);
    this.alpha = invincible > 0 ? (Math.floor(elapsed * 12) % 2 ? 0.35 : 1) : 1;
  }
  reset() { this.scene.tweens.killTweensOf(this); this.x = 640; this.y = 555; this.currentLane = 1; this.altitude = 0; this.velocity = 0; this.slideTime = 0; this.scaleY = 1; this.alpha = 1; this.angle = 0; this.state = 'idle'; this.setCharacter(this.character?.id); }
  destroy(fromScene) { this.shadow?.destroy(); super.destroy(fromScene); }
}
