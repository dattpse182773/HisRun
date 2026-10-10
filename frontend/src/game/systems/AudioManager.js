import { defaultSettings, readStorage } from '../../services/storage.js';
const MELODIES = { menu: [60,64,67,69,67,64,62,64,60,62,64,67,64,62,60,55], run: [60,67,64,69,67,64,62,67,60,64,69,72,71,67,64,62] };
// Original synthesized melodies, with separate menu and running arrangements.
class AudioManager {
  constructor() { this.context = null; this.musicTimer = null; this.settings = readStorage('settings', defaultSettings); this.note = 0; this.track = null; }
  unlock() { try { this.context ||= new (window.AudioContext || window.webkitAudioContext)(); void this.context.resume(); } catch {} }
  configure(settings) { const track = this.track; this.settings = settings; this.music(false); if (track) this.music(track); }
  tone(frequency, duration = 0.12, volume = 0.12, type = 'sine', delay = 0) {
    if (!this.context || this.context.state !== 'running' || !this.settings.volume) return;
    const oscillator = this.context.createOscillator(), gain = this.context.createGain(), start = this.context.currentTime + delay;
    oscillator.type = type; oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.001, start); gain.gain.linearRampToValueAtTime(volume * this.settings.volume, start + 0.012); gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    oscillator.connect(gain); gain.connect(this.context.destination); oscillator.start(start); oscillator.stop(start + duration);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }
  play(name) {
    if (!this.settings.sound) return;
    const notes = { select:[660,880], character:[523,659,784], left:[440,330], right:[330,440], roll:[300,210,140], land:[130,100], coin:[880,1175], jump:[392,660], hurt:[150,100], correct:[523,659,784], wrong:[294,220], gameover:[262,220,175], power:[740,988], gate:[660,784] }[name] || [440];
    notes.forEach((frequency,i) => this.tone(frequency, name === 'gameover' ? 0.4 : 0.12, 0.07, ['land','roll'].includes(name) ? 'triangle' : 'sine', i * 0.07));
  }
  music(active) {
    const track = active === true ? 'run' : active || null;
    if (this.track === track && this.musicTimer) return;
    clearInterval(this.musicTimer); this.musicTimer = null; this.track = track;
    if (!track || !this.settings.music) return;
    this.note = 0;
    const beat = () => {
      if (typeof document !== 'undefined' && document.hidden) return;
      const midi = MELODIES[track][this.note % 16];
      this.tone(440 * 2 ** ((midi - 69) / 12), 0.38, 0.045, 'triangle');
      if (this.note % 4 === 0) this.tone(440 * 2 ** ((48 + (this.note % 16 >= 8 ? 5 : 0) - 69) / 12), 0.75, 0.035);
      if (track === 'run' && this.note % 2 === 0) this.tone(80, 0.08, 0.035, 'triangle');
      this.note++;
    };
    beat(); this.musicTimer = setInterval(beat, track === 'menu' ? 440 : 280);
  }
}
export const audioManager = new AudioManager();
