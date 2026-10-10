import { MAP_STORIES, TIMELINES } from '../../../shared/scenario.js';
import { useState } from 'react';
import GeographyLesson from './GeographyLesson.jsx';
export function HistoryTimeline() {
  const [scope, setScope] = useState('vietnam');
  return <section className="history-library"><div className="character-heading"><div><span className="eyebrow">BỐI CẢNH HÀNH TRÌNH</span><h2>Dòng chảy lịch sử</h2></div><div className="character-variants">{[['vietnam','Việt Nam'],['world','Thế giới']].map(([id,label]) => <button key={id} aria-pressed={scope === id} onClick={() => setScope(id)}>{label}</button>)}</div></div><ol className="history-timeline">{TIMELINES[scope].map(([title,date,text]) => <li key={title}><span>{date}</span><h3>{title}</h3><p>{text}</p></li>)}</ol><p className="muted">Mốc phân kỳ mang tính khái quát và thay đổi theo khu vực, cách tiếp cận. Địa danh trong hành trình dùng bối cảnh chương trình trước 2018.</p><a className="source-link" href="https://openstax.org/books/world-history-volume-1/pages/3-2-ancient-mesopotamia" target="_blank" rel="noreferrer">Đọc thêm: sự xuất hiện của chữ viết · OpenStax ↗</a></section>;
}
export default function StoryRecap({ map }) {
  const story = MAP_STORIES[map.id];
  if (!story) return null;
  return <section className="story-recap" aria-label={`Sổ tay ${map.name}`}><span className="eyebrow">MANG THEO SAU HÀNH TRÌNH</span><h3>Sổ tay {map.name}</h3><GeographyLesson key={map.id} map={map}/><div className="recap-geography"><strong>Địa lý</strong><p>{story.geography}</p></div><ol className="recap-timeline">{story.timeline.map(([date,text]) => <li key={date}><strong>{date}</strong><p>{text}</p></li>)}</ol><p className="recap-connection"><strong>Sử & địa gặp nhau:</strong> {story.connection}</p><div className="recap-sources">{[story.source,story.extraSource].filter(Boolean).map(([label,url]) => <a key={url} className="source-link" href={url} target="_blank" rel="noreferrer">{label} ↗</a>)}</div></section>;
}
