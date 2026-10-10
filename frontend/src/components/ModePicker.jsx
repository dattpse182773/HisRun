import { Link } from 'react-router-dom';
import { PLAY_MODES } from '../../../shared/playModes.js';
export default function ModePicker() {
  return <section className="play-modes" id="play-modes"><span className="eyebrow">4 CHẾ ĐỘ CHƠI</span><h2>Hôm nay bạn muốn chơi thế nào?</h2><div className="mode-cards">{PLAY_MODES.map((mode, i) => <Link key={mode.id} to={mode.route} className={`mode-card mode-${mode.id}`}><span className="mode-icon">{mode.icon}</span><small>0{i + 1}</small><h3>{mode.name}</h3><p>{mode.detail}</p><strong>{mode.comingSoon ? 'Sắp ra mắt' : 'Bắt đầu →'}</strong></Link>)}</div></section>;
}

