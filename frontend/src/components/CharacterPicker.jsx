import { useState } from 'react';
import RunningPreview from './RunningPreview.jsx';
import { audioManager } from '../game/systems/AudioManager.js';
import { CHARACTERS, ZODIACS, getCharacter, CHARACTER_ATLAS, ATLAS_SIZE, characterFrame } from '../game/characters.js';
export const GREETINGS = ['Vẫy tay chào', 'Cúi chào', 'Đá chân vui', 'Vẫy hai tay', 'Dang tay đón bạn', 'Chào từ trái tim', 'Bước nhảy ngang', 'Chào hoàng gia', 'Nhảy mừng', 'Giơ tay chào', 'Nghiêng đầu thân thiện', 'Cười đón bạn'];

export function CharacterPortrait({ id, className = '' }) {
  const character = getCharacter(id), frame = characterFrame(character.frame);
  return <span role="img" aria-label={`${character.animal} ${character.name}`} className={`character-portrait ${className}`} style={{ aspectRatio: `${frame.width}/${frame.height}`, backgroundImage: `url(${CHARACTER_ATLAS})`, backgroundSize: `${ATLAS_SIZE.width / frame.width * 100}% ${ATLAS_SIZE.height / frame.height * 100}%`, backgroundPosition: `${frame.x / (ATLAS_SIZE.width - frame.width) * 100}% ${frame.y / (ATLAS_SIZE.height - frame.height) * 100}%` }} />;
}
export default function CharacterPicker({ value, onChange }) {
  const [greeting, setGreeting] = useState(0);
  const selected = getCharacter(value);
  const zodiacIndex = Math.floor(selected.frame / 2);
  const col = selected.frame % 8, row = Math.floor(selected.frame / 8);
  function select(id) { audioManager.unlock(); audioManager.play('character'); setGreeting(n => n + 1); onChange(id); }
  return <section className="character-picker" aria-label="Chọn nhân vật">
    <div className="character-heading"><div><span className="eyebrow">12 CON GIÁP · 24 NGƯỜI BẠN</span><h3>Ai sẽ cùng bạn khám phá?</h3></div><div className="character-variants" aria-label="Phiên bản nhân vật">{['nam', 'nu'].map(variant => <button type="button" key={variant} aria-pressed={selected.variant === variant} onClick={() => select(`${selected.zodiac}-${variant}`)}>{variant === 'nam' ? 'Nam' : 'Nữ'}</button>)}</div></div>
    <div className="greeting-preview"><RunningPreview id={value}/><div key={`${value}-${greeting}`} className={`greeting-motion greet-${zodiacIndex}`}><CharacterPortrait id={value}/><span aria-hidden="true" className="greeting-pose" style={{ backgroundPosition: `${col / 7 * 100}% ${row / 2 * 100}%` }}/></div><div><strong>{selected.animal} · {selected.name}</strong><p>{GREETINGS[zodiacIndex]}</p><button type="button" className="secondary-link" onClick={() => select(value)}>Chào lại ↻</button></div></div>
    <div className="character-grid">{ZODIACS.map(zodiac => {
      const character = CHARACTERS.find(item => item.zodiac === zodiac.id && item.variant === selected.variant);
      return <button type="button" key={zodiac.id} className={`character-option ${selected.zodiac === zodiac.id ? 'selected' : ''}`} aria-label={`Chọn ${character.animal} ${character.name}`} aria-pressed={selected.id === character.id} onClick={() => select(character.id)}>{selected.id === character.id ? <span key={greeting} className={`greeting-motion greet-${zodiac.index}`}><CharacterPortrait id={character.id}/><span aria-hidden="true" className="greeting-pose" style={{backgroundPosition: `${character.frame % 8 / 7 * 100}% ${Math.floor(character.frame / 8) / 2 * 100}%`}}/></span> : <CharacterPortrait id={character.id}/>}<strong>{zodiac.name}</strong><small>{zodiac.animal}</small>{selected.id === character.id && <span className="character-check" aria-hidden="true">✓</span>}</button>;
    })}</div><p className="character-caption" role="status">Đồng hành: <strong>{selected.animal} · {selected.name}</strong>. Các nhân vật có cùng tốc độ và khả năng.</p>
  </section>;
}

