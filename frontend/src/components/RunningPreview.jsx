import { useId } from 'react';
import { getCharacter } from '../game/characters.js';
import { rigParts, RUN_RIG_ATLAS } from '../game/runRig.js';
export default function RunningPreview({ id }) {
  const clip = useId().replace(/:/g, ''); const character = getCharacter(id), parts = rigParts(character.frame), f = parts.frame;
  return <div className="running-preview"><svg viewBox={`0 0 ${f.width} ${f.height}`} role="img" aria-label={`Nhịp chạy hai chân: ${character.name}`}><ellipse cx={f.width / 2} cy={f.height - 6} rx="45" ry="7" fill="#284c3522"/>{['left', 'right', 'body'].map(name => { const p = parts[name], x = p.x - f.x, y = p.y - f.y; return <g key={name} className={`preview-rig-${name}`} style={{ transformOrigin: `${x + p.width / 2}px ${y}px` }}><defs><clipPath id={`${clip}-${name}`}><rect x={x} y={y} width={p.width} height={p.height}/></clipPath></defs><image href={RUN_RIG_ATLAS} width="1536" height="1024" x={-f.x} y={-f.y} clipPath={`url(#${clip}-${name})`}/></g>; })}</svg><span>Xem nhịp chạy</span></div>;
}
