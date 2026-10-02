import TrackObject from '../objects/TrackObject.js';
import { blockedLanes, journeyDifficulty } from './rules.js';
import { checkpointsFor } from '../../../../shared/journey.js';
export default class ObstacleManager {
  constructor(scene) { this.scene = scene; this.items = []; this.spawnTime = 1.5; this.nextGate = 220; this.rows = 0; this.checkpointIndex = 0; }
  reset() { this.items.forEach(item => item.destroy()); this.items = []; this.spawnTime = 1.5; this.nextGate = 220; this.rows = 0; this.checkpointIndex = 0; }
  add(type, lane, z) { const item = new TrackObject(this.scene, type, lane, z); this.items.push(item); return item; }
  tick(dt, state, collision) {
    const difficulty = journeyDifficulty(state); this.spawnTime -= dt;
    if (state.mode === 'journey') {
      const checkpoint = checkpointsFor(state.mapId)[this.checkpointIndex];
      if (checkpoint && state.distance >= checkpoint.distance - 140) {
        const gate = this.add('gate', 1); gate.checkpoint = checkpoint;
        this.checkpointIndex++; this.spawnTime = Math.max(this.spawnTime, 1.8);
      }
    } else if (state.distance >= this.nextGate) { this.add('gate', 1); this.nextGate += 400; this.spawnTime = Math.max(this.spawnTime, 2); }
    if (this.spawnTime <= 0) {
      const { safe, blocked } = blockedLanes(state.level);
      const types = state.level === 1 ? ['log', 'rock', 'branch'] : ['log', 'rock', 'branch', 'pit', 'fence', 'trap'];
      blocked.forEach(lane => this.add(types[this.rows % types.length], lane));
      for (let i = 0; i < 4; i++) this.add('coin', safe, 1450 + i * 65);
      if (Math.random() < difficulty.itemChance) this.add(['shield', 'magnet', 'clock', 'book', 'heart'][this.rows % 5], safe, 1780);
      this.rows++; this.spawnTime = difficulty.interval;
    }
    for (const item of this.items) {
      if (state.gameStatus !== 'playing') break;
      item.z -= state.speed * (state.powers.clock > 0 ? 0.65 : 1) * dt; item.project(state.duration);
      if (!item.checked && item.z <= 0) { item.checked = true; collision(item); }
    }
    this.items = this.items.filter(item => { if (item.z < -140 || !item.active) { item.destroy(); return false; } return true; });
  }
}
