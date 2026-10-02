import { useState } from 'react';
import Modal from './Modal.jsx';
import { readStorage, writeStorage, defaultSettings } from '../services/storage.js';
import { audioManager } from '../game/systems/AudioManager.js';
import { EventBus, GAME_EVENTS as E } from '../game/EventBus.js';
export default function Settings({ onClose }) {
  const [settings, setSettings] = useState(() => readStorage('settings', defaultSettings));
  function change(key, value) { const next = { ...settings, [key]: value }; setSettings(next); writeStorage('settings', next); audioManager.unlock(); audioManager.configure(next); EventBus.emit(E.SETTINGS, next); }
  return <Modal title="Theo nhịp của bạn"><p className="muted">Điều chỉnh âm thanh cho chuyến đi.</p><label className="setting-row">Âm thanh hiệu ứng<input type="checkbox" checked={settings.sound} onChange={event => change('sound', event.target.checked)} /></label><label className="setting-row">Nhạc nền<input type="checkbox" checked={settings.music} onChange={event => change('music', event.target.checked)} /></label><label className="setting-row">Âm lượng · {Math.round(settings.volume * 100)}%<input aria-label="Âm lượng" type="range" min="0" max="1" step="0.05" value={settings.volume} onChange={event => change('volume', Number(event.target.value))} /></label><button className="primary-button full-button" onClick={onClose}>Xong ✓</button></Modal>;
}
