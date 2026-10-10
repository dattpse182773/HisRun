import Phaser from 'phaser';
import { questionReady, resolveRunAnswer } from '../../../../shared/runLife.js';
import Player from '../objects/Player.js';
import ObstacleManager from '../systems/ObstacleManager.js';
import World from '../systems/World.js';
import { LANES, canAvoid, comboMultiplier, difficultyAt, newRun, newJourneyRun, journeyDifficulty, scoreOf } from '../systems/rules.js';
import { getMap } from '../../../../shared/journey.js';
import { audioManager } from '../systems/AudioManager.js';
import { POWER_NAMES } from '../objects/TrackObject.js';
import { EventBus, GAME_EVENTS as E } from '../EventBus.js';
import { CHARACTERS, REAR_ATLASES, rearFrame, getCharacter } from '../characters.js';
import { RUN_RIG_ATLAS, rigParts } from '../runRig.js';
import { collectToken, coinValue, deductPoints, effectiveSpeed, TIMED_POWERS, TOKENS } from '../../../../shared/tokens.js';

export default class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }
  preload() { this.load.image('zodiac-run-rig', RUN_RIG_ATLAS); this.load.image('zodiac-roll', '/assets/characters/zodiac-roll.png'); REAR_ATLASES.forEach((url, index) => this.load.image(`zodiac-rear-${index}`, url)); }
  create() {
    if (this.textures.exists('zodiac-run-rig')) {
      const texture = this.textures.get('zodiac-run-rig');
      CHARACTERS.forEach(character => {
        const parts = rigParts(character.frame);
        for (const part of ['body', 'left', 'right']) { const f = parts[part]; texture.add(`${character.id}-${part}`, 0, f.x, f.y, f.width, f.height); }
      });
    }
    REAR_ATLASES.forEach((_, index) => {
      if (!this.textures.exists(`zodiac-rear-${index}`)) return;
      const texture = this.textures.get(`zodiac-rear-${index}`), source = texture.getSourceImage();
      CHARACTERS.forEach(character => { const f = rearFrame(character.frame, source.width, source.height); texture.add(character.id, 0, f.x, f.y, f.width, f.height); });
    });
    if (this.textures.exists('zodiac-roll')) {
      const texture = this.textures.get('zodiac-roll'), source = texture.getSourceImage();
      CHARACTERS.forEach(character => { const col = character.frame % 8, row = Math.floor(character.frame / 8); texture.add(character.id, 0, Math.round(col * source.width / 8), Math.round(row * source.height / 3), Math.floor(source.width / 8), Math.floor(source.height / 3)); });
    }
    this.world = new World(this); this.player = new Player(this); this.obstacles = new ObstacleManager(this);
    this.state = { ...newRun(), gameStatus: 'ready' }; this.invincible = 0; this.hudElapsed = 0; this.gateCount = 0;
    this.notice = this.add.text(640, 170, '', { fontFamily: 'Arial', fontSize: '32px', color: '#fff8d7', backgroundColor: '#214d3f', padding: { x: 20, y: 12 } }).setOrigin(0.5).setDepth(3000).setVisible(false);
    this.noticeTime = 0;
    const handlers = [
      [E.PREVIEW, options => this.preview(options)],
      [E.START, options => this.start(options)],
      [E.INPUT, action => this.inputAction(action)],
      [E.PAUSE, () => this.togglePause()],
      [E.ANSWER, result => this.answer(result)],
      [E.SETTINGS, settings => { audioManager.configure(settings); audioManager.music(this.state.gameStatus === 'playing'); }],
    ];
    handlers.forEach(([event, handler]) => EventBus.on(event, handler));
    const keyHandler = event => {
      if (event.key === 'Escape' && !event.repeat) { this.togglePause(); return; }
      if (['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(document.activeElement?.tagName)) return;
      const action = { ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right', ArrowUp: 'jump', ' ': 'jump', ArrowDown: 'slide', s: 'slide', S: 'slide', Escape: 'pause' }[event.key];
      if (!action) return;
      if (this.state.gameStatus === 'playing' || this.state.gameStatus === 'paused') event.preventDefault();
      if (!event.repeat) this.inputAction(action);
    };
    // Phaser owns input and timing; React only displays throttled snapshots.
    this.input.keyboard.on('keydown', keyHandler);
    let pointerStart = null;
    this.input.on('pointerdown', pointer => { pointerStart = { x: pointer.x, y: pointer.y }; });
    this.input.on('pointerup', pointer => {
      if (!pointerStart) return;
      const dx = pointer.x - pointerStart.x, dy = pointer.y - pointerStart.y; pointerStart = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) return;
      this.inputAction(Math.abs(dx) > Math.abs(dy) ? dx > 0 ? 'right' : 'left' : dy > 0 ? 'slide' : 'jump');
    });
    const blur = () => { if (this.state.gameStatus === 'playing') this.togglePause(); };
    this.game.events.on(Phaser.Core.Events.BLUR, blur);
    const cleanup = () => {
      handlers.forEach(([event, handler]) => EventBus.off(event, handler));
      this.input.keyboard.off('keydown', keyHandler); this.game.events.off(Phaser.Core.Events.BLUR, blur);
      audioManager.music(false);
      this.events.off(Phaser.Scenes.Events.SHUTDOWN, cleanup); this.events.off(Phaser.Scenes.Events.DESTROY, cleanup);
    };
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, cleanup); this.events.once(Phaser.Scenes.Events.DESTROY, cleanup);
    EventBus.emit(E.READY); this.publish();
  }
  start(options = {}) {
    this.challengeActive = false; this.tweens.resumeAll(); this.obstacles.reset(); this.player.reset();
    this.player.setCharacter(options.characterId);
    this.state = options.playMode === 'world' ? { ...newRun('world'), distanceTarget: 1000 } : options.playMode === 'ranked' ? newRun('mixed') : newJourneyRun(options.mapId, options.schoolLevel); this.invincible = 2; this.gateCount = 0; this.hudElapsed = 0;
    this.state.characterId = getCharacter(options.characterId).id;
    if (options.provinceExam) this.state = { ...this.state, mode: 'explore', distanceTarget: 7000, examIndex: 0, questionAtTime: 0, questionAtDistance: 0 };
    this.world.setMap(options.mapId, options.provinceId); this.notify(options.provinceId ? this.world.destination.name : options.mapId ? `Map ${getMap(options.mapId).number} · ${getMap(options.mapId).name}` : 'Sẵn sàng? Hành trình bắt đầu!');
    audioManager.music(true); this.publish();
  }
  preview(options) {
    this.tweens.resumeAll(); this.obstacles.reset(); this.player.reset(); this.player.setCharacter(options.characterId);
    this.state = { ...newJourneyRun(options.mapId, options.schoolLevel), gameStatus: 'ready', characterId: getCharacter(options.characterId).id };
    this.world.setMap(options.mapId); this.notice.setVisible(false); audioManager.music(false); this.publish();
  }
  inputAction(action) {
    if (action === 'pause') return this.togglePause();
    if (this.state.gameStatus !== 'playing') return;
    if (action === 'left' && this.player.move(-1)) audioManager.play('left');
    if (action === 'right' && this.player.move(1)) audioManager.play('right');
    if (action === 'jump' && this.player.jump()) audioManager.play('jump');
    if (action === 'slide' && this.player.slide()) audioManager.play('roll');
  }
  togglePause() {
    if (!['playing', 'paused'].includes(this.state.gameStatus)) return;
    this.state.gameStatus = this.state.gameStatus === 'playing' ? 'paused' : 'playing';
    if (this.state.gameStatus === 'paused') this.tweens.pauseAll(); else this.tweens.resumeAll();
    audioManager.music(this.state.gameStatus === 'playing'); this.publish();
  }
  notify(message) { this.notice.setText(message).setVisible(true); this.noticeTime = 2; }
  burst(color) {
    for (let i = 0; i < 9; i++) {
      const dot = this.add.circle(this.player.x, this.player.y, 5, color).setDepth(2100);
      this.tweens.add({ targets: dot, x: dot.x + Phaser.Math.Between(-90, 90), y: dot.y - Phaser.Math.Between(30, 110), alpha: 0, duration: 450, onComplete: () => dot.destroy() });
    }
  }
  collide(item) {
    if (item.kind === 'question') {
      if (Math.abs(this.player.x - LANES[item.lane]) < (this.player.collisionBody.width + 145) / 2) { item.setActive(false).setVisible(false); this.openExploreQuestion(); }
      return;
    }
    if (item.kind === 'gate') {
      item.setActive(false).setVisible(false); this.state.gameStatus = 'question'; this.tweens.pauseAll(); audioManager.music(false); audioManager.play('gate');
      const mode = this.state.mode;
      if (mode === 'journey') {
        this.state.gatesVisited++;
        this.publish(); EventBus.emit(E.QUESTION, { runId: this.state.runId, mapId: this.state.mapId, schoolLevel: this.state.schoolLevel, curriculum: 'pre-2018', landmarkId: item.checkpoint.landmarkId, landmarkName: item.checkpoint.name, subject: item.checkpoint.subject, timed: false });
        return;
      }
      const subject = mode === 'world' ? 'geography' : ['history', 'geography'].includes(mode) ? mode : this.gateCount++ % 2 === 0 ? 'history' : 'geography';
      this.publish(); EventBus.emit(E.QUESTION, { runId: this.state.runId, subject, grade: mode === 'grade' ? this.state.grade : undefined, scope: mode === 'world' ? 'world' : undefined, curriculum: mode === 'mixed' ? 'pre-2018' : undefined, timed: mode === 'mixed' });
      return;
    }
    const inLane = Math.abs(this.player.x - LANES[item.lane]) < (this.player.collisionBody.width + 145) / 2;
    if (item.kind === 'coin' && (inLane || this.state.powers.magnet > 0)) {
      this.state.coins += coinValue(this.state); item.setActive(false).setVisible(false); audioManager.play('coin'); return;
    }
    if (!inLane) return;
    if (POWER_NAMES[item.kind]) {
      const message = collectToken(this.state, item.kind);
      item.setActive(false).setVisible(false); this.burst(TOKENS[item.kind].harmful ? 0xde8172 : 0xffdf79); this.notify(message); audioManager.play(TOKENS[item.kind].harmful ? 'hurt' : 'power');
      if (item.kind === 'challenge') {
        this.challengeActive = true; this.state.gameStatus = 'question'; this.tweens.pauseAll(); audioManager.music(false);
        this.publish(); EventBus.emit(E.QUESTION, { runId: this.state.runId, challenge: true, subject: this.state.mode === 'world' ? 'geography' : this.gateCount++ % 2 === 0 ? 'geography' : 'history', scope: this.state.mode === 'world' ? 'world' : 'challenge', excludedMapId: this.state.mode === 'journey' ? this.state.mapId : undefined, difficulty: 3, timed: true, landmarkName: 'Thử thách ngoài lề' });
      }
      return;
    }
    if (item.kind === 'coin' || canAvoid(item.kind, this.player.collisionBody) || this.invincible > 0) return;
    if (this.state.powers.shield) { this.state.powers.shield = 0; this.invincible = 1; this.notify('Khiên đã bảo vệ bạn!'); this.burst(0x83d5df); return; }
    if (this.state.mode === 'explore' && this.state.examIndex < 10) {
      item.setActive(false).setVisible(false); this.invincible = 1.8;
      if (!this.openExploreQuestion()) this.notify('Vấp nhẹ! Tiếp tục chạy đến token câu hỏi');
      return;
    }
    else this.state.health--;
    this.invincible = 1.8; audioManager.play('hurt'); this.cameras.main.shake(180, 0.006); this.burst(0xe98054);
    if (this.state.health <= 0) this.finish();
  }
  answer(result) {
    if (this.state.gameStatus !== 'question' || result.runId !== this.state.runId) return;
    if (!result.skipped) {
      if (this.state.mode === 'journey' && !this.challengeActive) this.state.answeredGates++;
      if (result.correct) {
        this.state.correctAnswers++; this.state[result.subject === 'history' ? 'historyCorrect' : 'geographyCorrect']++;
        this.state.combo++; this.state.bestCombo = Math.max(this.state.bestCombo, this.state.combo);
        const points = this.challengeActive ? 200 : Math.round(100 * comboMultiplier(this.state.combo) * (this.state.powers.book > 0 ? 2 : 1));
        this.state.questionPoints += points; this.state.coins += 5; this.burst(0xffdc65); this.notify('Chính xác! +' + points + ' điểm'); audioManager.play('correct');
      } else {
        this.state.wrongAnswers++; this.state.combo = 0;
        if (result.review) this.state.wrongQuestions.push(result.review);
        this.notify(this.challengeActive ? `Thử thách: trừ ${deductPoints(this.state, 50)} điểm` : 'Thêm một điều mới để ghi nhớ'); audioManager.play('wrong');
      }
    }
    if (!result.skipped) {
      resolveRunAnswer(this.state, result.correct);
      this.notify(result.correct ? 'Chính xác! +1 mạng (tối đa 3) · +20 m' : 'Chưa đúng · −1 mạng · lùi 50 m');
      if (this.state.health === 0) { this.tweens.resumeAll(); this.finish(false); return; }
      if (this.state.mode === 'explore' && this.state.examIndex >= 10) { this.tweens.resumeAll(); this.finish(true); return; }
    }
    this.challengeActive = false;
    this.player.state = result.correct ? 'victory' : 'run'; this.state.gameStatus = 'playing'; this.invincible = Math.max(this.invincible, 1.2);
    this.tweens.resumeAll(); audioManager.music(true); this.publish();
  }
  finish(completed = false) {
    this.state.completed = completed; this.state.gameStatus = 'gameover'; this.state.score = scoreOf(this.state); this.player.state = completed ? 'victory' : 'death'; this.player.setAngle(completed ? 0 : -16);
    audioManager.music(false); audioManager.play(completed ? 'correct' : 'gameover'); this.publish();
    EventBus.emit(E.OVER, JSON.parse(JSON.stringify(this.state)));
  }
  publish() { this.state.score = scoreOf(this.state); EventBus.emit(E.HUD, { ...this.state, powers: { ...this.state.powers }, map: this.world.name }); }
  openExploreQuestion() {
    if (this.state.mode !== 'explore' || !questionReady(this.state)) return false;
    const index = this.state.examIndex++;
    this.obstacles.items.filter(item => item.kind === 'question').forEach(item => item.setActive(false).setVisible(false));
    this.state.gameStatus = 'question'; this.tweens.pauseAll(); audioManager.music(false); this.publish();
    EventBus.emit(E.QUESTION, { runId: this.state.runId, exam: true, index }); return true;
  }
  update(time, delta) {
    if (this.state.gameStatus !== 'playing') return;
    const dt = Math.min(delta, 50) / 1000; this.state.duration += dt;
    const difficulty = journeyDifficulty(this.state); this.state.level = difficulty.level; this.state.speed = difficulty.speed;
    this.state.distance += effectiveSpeed(this.state) * dt / 10;
    this.invincible = Math.max(0, this.invincible - dt);
    for (const key of TIMED_POWERS) this.state.powers[key] = Math.max(0, this.state.powers[key] - dt);
    this.player.tick(dt, this.state.duration, this.invincible); this.world.tick(this.state.distance);
    this.obstacles.tick(dt, this.state, item => this.collide(item));
    if (['journey', 'world'].includes(this.state.mode) && this.state.gameStatus === 'playing' && this.state.distance >= this.state.distanceTarget) {
      this.state.distance = this.state.distanceTarget; this.finish(true); return;
    }
    this.noticeTime -= dt; if (this.noticeTime <= 0) this.notice.setVisible(false);
    this.hudElapsed += dt; if (this.hudElapsed >= 0.1) { this.publish(); this.hudElapsed = 0; }
  }
}
