import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import boundaries from '../data/vietnam-boundaries.json';
import { ADMIN_SOURCE, PROVINCES, currentProvince, mapsForProvince, provinceNote, provinceQuiz } from '../../../shared/provinces.js';
import { JOURNEY_MAPS } from '../../../shared/journey.js';

export default function AdministrativeMap({ school = 'primary', compact = false }) {
  const id = useId();
  const [era, setEra] = useState('34');
  const [selected, setSelected] = useState('hochiminh');
  const [island, setIsland] = useState('');
  const [answer, setAnswer] = useState(null);
  const [zoom, setZoom] = useState(1);
  const province = boundaries[era].find(p => p.id === selected);
  const quiz = island ? { question: `Quần đảo ${island} gắn với tỉnh/thành nào của Việt Nam?`, answer: island === 'Hoàng Sa' ? 'Đà Nẵng' : 'Khánh Hòa', choices: ['Đà Nẵng', 'Khánh Hòa', 'Hà Nội', 'Cao Bằng'] } : provinceQuiz(province.name, era);
  const journeys = mapsForProvince(province.name, era).map(mapId => JOURNEY_MAPS.find(m => m.id === mapId));
  function choose(value, islandName = '') { setSelected(value); setIsland(islandName); setAnswer(null); }
  function changeEra(next) {
    if (next === era) return;
    const group = era === '63' ? currentProvince(province.name) : PROVINCES.find(p => p.id === selected);
    choose(group.id); setEra(next);
  }
  return <section className={`administrative-map ${compact ? 'compact' : ''}`} aria-label="Khám phá bản đồ hành chính Việt Nam">
    <header><div><span className="eyebrow">CHẠM MỘT MIỀN ĐẤT</span><h2>Việt Nam qua hai dấu mốc</h2></div><span className="admin-count">{era}<small>tỉnh / thành</small></span></header>
    <div className="admin-era" aria-label="Mốc địa giới">{[['63','Trước sắp xếp 2025'],['34','Sau sắp xếp 2025']].map(([value, label]) => <button key={value} aria-pressed={era === value} onClick={() => changeEra(value)}><strong>{value} tỉnh/thành</strong><span>{label}</span></button>)}</div>
    <label className="admin-select" htmlFor={`${id}-province`}>Chọn tỉnh/thành <select id={`${id}-province`} value={selected} onChange={e => choose(e.target.value)}>{boundaries[era].map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
    <div className="admin-map-body"><div className="admin-map-frame">
      <div className="admin-zoom"><button aria-label="Thu nhỏ bản đồ" disabled={zoom === 1} onClick={() => setZoom(Math.max(1, zoom - .5))}>−</button><span>{Math.round(zoom * 100)}%</span><button aria-label="Phóng to bản đồ" disabled={zoom === 3} onClick={() => setZoom(Math.min(3, zoom + .5))}>+</button></div>
      <div className="admin-map-scroll"><svg viewBox="0 0 520 590" style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%`, maxWidth: 'none' }} aria-label={`Bản đồ Việt Nam ${era} tỉnh thành. Chọn tỉnh bằng bản đồ hoặc danh sách phía trên.`}>
        <rect width="520" height="590" fill="#e5f1ed"/>
        <g className="admin-provinces">{boundaries[era].map((p, index) => <path key={p.id} d={p.d} fillRule="evenodd" fill={selected === p.id ? '#cb743b' : ['#95b79a','#b2c9a4','#7fa992','#c3d0a3'][index % 4]} className={selected === p.id ? 'selected' : ''} role="button" tabIndex={0} aria-label={`Chọn ${p.name}`} aria-pressed={selected === p.id} onClick={() => choose(p.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(p.id); } }}><title>{p.name}</title></path>)}</g>
        <text x="42" y="40" className="admin-map-title">VIỆT NAM</text><text x="285" y="320" className="admin-sea">BIỂN ĐÔNG</text>
        <g className="admin-island" role="button" tabIndex={0} aria-label="Chọn quần đảo Hoàng Sa" onClick={() => choose('danang', 'Hoàng Sa')} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose('danang', 'Hoàng Sa'); } }}><rect x="311" y="207" width="187" height="52" rx="12"/><text x="325" y="228">QĐ. Hoàng Sa</text><text x="325" y="247" className="island-sub">Việt Nam · Đà Nẵng</text></g>
        <g className="admin-island" role="button" tabIndex={0} aria-label="Chọn quần đảo Trường Sa" onClick={() => choose('khanhhoa', 'Trường Sa')} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose('khanhhoa', 'Trường Sa'); } }}><rect x="316" y="493" width="192" height="52" rx="12"/><text x="329" y="514">QĐ. Trường Sa</text><text x="329" y="533" className="island-sub">Việt Nam · Khánh Hòa</text></g>
        <text x="25" y="567" className="admin-map-caption">Chạm tỉnh để khám phá · Cuộn khi phóng to</text>
      </svg></div>
    </div><article className="admin-detail" aria-live="polite"><span className="eyebrow">{island ? 'BIỂN ĐẢO VIỆT NAM' : era === '63' ? 'ĐỊA DANH TRƯỚC SẮP XẾP' : 'ĐƠN VỊ SAU SẮP XẾP'}</span><h3>{island ? `Quần đảo ${island}` : province.name}</h3>{island && <p>Quần đảo {island} thuộc Việt Nam, gắn với địa bàn {province.name}.</p>}<p className="admin-merger">{provinceNote(province.name, era)}</p>
      <details className="admin-quiz" key={`${era}-${selected}-${island}`}><summary>Thử một câu hỏi địa lý</summary><p>{quiz.question}</p><div>{quiz.choices.map(choice => <button key={choice} disabled={answer !== null} className={answer !== null && choice === quiz.answer ? 'correct' : answer === choice ? 'incorrect' : ''} onClick={() => setAnswer(choice)}>{choice}</button>)}</div>{answer !== null && <p role="status">{answer === quiz.answer ? 'Chính xác!' : `Đáp án: ${quiz.answer}.`} {provinceNote(province.name, era)}</p>}<small>Kiến thức hành chính cập nhật 2025, bổ sung ngoài chương trình SGK cũ.</small></details>
      <Link className="primary-button full-button" to={`/explore?province=${currentProvince(province.name)?.id || selected}`}>Chạy khám phá · 10 câu →</Link>{journeys.length ? <div className="admin-journeys">{journeys.map(map => <Link key={map.id} to={`/game?map=${map.id}&school=${school}`}>Map {map.number} · {map.landmarks.map(l => l.name).join(' / ')} <span>Chạy & trả lời câu hỏi ↗</span></Link>)}</div> : <p className="admin-coming">Chọn Chạy khám phá để chơi map tỉnh/thành hiện nay.</p>}
    </article></div>
    <details className="admin-sources"><summary>Nguồn & cách đọc bản đồ</summary><p>63 đơn vị ngay trước sắp xếp năm 2025; Huế đã là thành phố trực thuộc Trung ương từ 01/01/2025. Giữ tên địa danh lịch sử trong bài học và đối chiếu địa bàn hiện nay ở phần chú thích.</p><p>Ranh giới đã giản lược phục vụ học tập, không dùng để xác định địa giới pháp lý. Hoàng Sa và Trường Sa được thể hiện cùng lãnh thổ Việt Nam.</p><a href={ADMIN_SOURCE} target="_blank" rel="noreferrer">Báo Chính phủ · Nghị quyết 202/2025/QH15 ↗</a><a href="https://github.com/nguyenduy1133/Free-GIS-Data" target="_blank" rel="noreferrer">Dữ liệu địa lý: Nguyễn Duy Liêm (2025) ↗</a></details>
  </section>;
}

