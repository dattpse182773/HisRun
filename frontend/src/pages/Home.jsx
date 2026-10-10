import { Link } from 'react-router-dom';
import ModePicker from '../components/ModePicker.jsx';
import Heritage from '../components/Heritage.jsx';
import AdministrativeMap from '../components/AdministrativeMap.jsx';

export default function Home() {
  return <>
    <section className="game-poster" aria-label="Poster game HisRun">
      <a className="game-poster-image" href="/assets/posters/hisrun-poster.png" target="_blank" rel="noreferrer" aria-label="Xem poster HisRun kích thước đầy đủ">
        <img src="/assets/posters/hisrun-poster.png" width="1376" height="768" fetchPriority="high" alt="Poster HisRun: hành trình từ Bắc vào Nam cùng các nhân vật con giáp, Tháp Rùa, cầu rồng và chợ Bến Thành."/>
      </a>
      <div className="game-poster-caption"><span>HÀNH TRÌNH TỪ BẮC VÀO NAM</span><a href="#play-modes">Bắt đầu khám phá <span aria-hidden="true">↗</span></a></div>
    </section>
    <section className="hero">
      <div className="hero-copy"><div className="eyebrow"><span /> HÀNH TRÌNH BẮC → NAM</div><h1>Một bước chạy.<br/>Ngàn điều <span>khám phá<svg viewBox="0 0 400 18" aria-hidden="true"><path d="M4 12Q200-4 393 9"/></svg></span></h1><p className="slogan">Chạy xuyên lịch sử - Khám phá địa lý</p><p className="hero-description">Từ Pác Bó đến Bến Nhà Rồng, mỗi miền đất một câu chuyện.<br className="desktop-break"/> Chọn một trong bốn chế độ và bắt đầu khám phá.</p><div className="hero-actions"><a href="#play-modes" className="primary-button">CHƠI NGAY <span>↗</span></a><a className="secondary-link" href="#journey">Khám phá hành trình <span>↓</span></a></div><div className="hero-note"><span className="tiny-compass">✧</span><span>Không cần tài khoản. Chỉ cần một chút tò mò.</span></div></div>
      <div className="hero-admin"><div className="explore-invitation"><span className="mode-icon">⌖</span><h2>34 miền đất.<br/>34 hành trình.</h2><p>Chọn tỉnh trên bản đồ Việt Nam. Khám phá địa danh, lịch sử và địa lý qua 10 câu hỏi mỗi lượt.</p><Link className="primary-button" to="/maps">Mở bản đồ Việt Nam →</Link></div></div>
    </section>
    <ModePicker/><Heritage/><section className="journey" id="journey"><div className="section-heading"><div><div className="eyebrow">MỖI HÀNH TRÌNH LÀ MỘT BÀI HỌC</div><h2>Chạy xa hơn. Hiểu nhiều hơn.</h2></div><span className="section-note">Một thế giới để chơi, một Việt Nam để hiểu.</span></div><div className="feature-grid"><article><span className="feature-icon">↗</span><span className="feature-number">01</span><h3>Chạy qua miền đất Việt</h3><p>Từ làng quê yên bình đến núi rừng hùng vĩ. Mỗi cung đường, một khám phá mới.</p><span className="feature-tag">PHIÊU LƯU</span></article><article><span className="feature-icon book-icon">▤</span><span className="feature-number">02</span><h3>Đánh thức nhà sử học</h3><p>Gặp lại những dấu mốc và câu chuyện đã làm nên chiều dài lịch sử Việt Nam.</p><span className="feature-tag">LỊCH SỬ</span></article><article><span className="feature-icon globe-icon">◎</span><span className="feature-number">03</span><h3>Mở rộng bản đồ tri thức</h3><p>Khám phá sông núi, khí hậu và những điều thú vị về thế giới quanh mình.</p><span className="feature-tag">ĐỊA LÝ</span></article></div><div className="expedition-strip"><div><strong>34 map</strong><span>Bắc vào Nam</span></div><div><strong>3 cấp học</strong><span>kiến thức sử địa</span></div><div><strong>10 câu / map</strong><span>gắn với địa phương</span></div><Link to="/maps">Chọn hành trình của bạn →</Link></div><p className="scope-note">Kiến thức theo chủ đề chương trình trước 2018. Mỗi map có địa danh, câu hỏi Lịch sử và Địa lý riêng.</p></section>
  </>;
}
