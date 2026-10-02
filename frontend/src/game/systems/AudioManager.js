import { defaultSettings, readStorage } from '../../services/storage.js';
class AudioManager {
  constructor() { this.context = null; this.musicTimer = null; this.settings = readStorage('settings', defaultSettings); this.note = 0; }
  unlock() { try { this.context ||= new (window.AudioContext || window.webkitAudioContext)(); void this.context.resume(); } catch { /* Silent play remains available. */ } }
  configure(settings) { this.settings = settings; }
  tone(frequency, duration = 0.12, volume = 0.12) {
    if (!this.context || this.context.state !== 'running' || !this.settings.volume) return;
    const oscillator = this.context.createOscillator(); const gain = this.context.createGain();
    oscillator.type = 'sine'; oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(volume * this.settings.volume, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
    oscillator.connect(gain); gain.connect(this.context.destination); oscillator.start(); oscillator.stop(this.context.currentTime + duration);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }
  play(name) { if (this.settings.sound) this.tone(({ coin: 880, jump: 520, hurt: 150, correct: 1046, wrong: 220, gameover: 130, power: 740, gate: 660 })[name] || 440, name === 'gameover' ? 0.6 : 0.16); }
  music(active) {
    clearInterval(this.musicTimer); this.musicTimer = null;
    if (active && this.settings.music) this.musicTimer = setInterval(() => this.tone([262, 330, 392, 440, 392, 330, 294, 330][this.note++ % 8], 0.5, 0.025), 600);
  }
}
export const audioManager = new AudioManager();
