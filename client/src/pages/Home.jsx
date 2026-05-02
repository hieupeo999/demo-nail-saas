import { Link } from 'react-router-dom';

const DESIGNS = [
  { name: 'Ombre Hồng Pastel',  price: 'từ 150.000đ', src: '/images/nail-01.jpg' },
  { name: 'French Nail Classic', price: 'từ 120.000đ', src: '/images/nail-02.jpg' },
  { name: 'French Ngôi Sao',     price: 'từ 130.000đ', src: '/images/nail-03.jpg' },
  { name: '3D Tiffany Blue',     price: 'từ 250.000đ', src: '/images/nail-04.jpg' },
  { name: 'Nail Holographic',    price: 'từ 200.000đ', src: '/images/nail-05.jpg' },
  { name: 'French Glitter Bạc', price: 'từ 180.000đ', src: '/images/nail-06.jpg' },
  { name: 'Cat-Eye Tím',         price: 'từ 180.000đ', src: '/images/nail-07.jpg' },
  { name: 'Nghệ Thuật Đa Sắc', price: 'từ 220.000đ', src: '/images/nail-08.jpg' },
];

const HERO_TILES = [
  { src: '/images/nail-01.jpg' },
  { src: '/images/nail-03.jpg' },
  { src: '/images/nail-05.jpg' },
  { src: '/images/nail-07.jpg' },
];

const REVIEWS = [
  {
    stars: '★★★★★',
    text: '"Mình đã làm nail ở nhiều chỗ nhưng Thủy Linh Nail là nơi mình hài lòng nhất. Kỹ thuật viên cực kỳ tỉ mỉ, mẫu đẹp như hình. Nhất định sẽ quay lại!"',
    name: 'Nguyễn Thị Hương',
    since: 'Khách hàng từ 2022',
    emoji: '🌸',
  },
  {
    stars: '★★★★★',
    text: '"Không gian sạch sẽ, nhân viên thân thiện và tay nghề cao. Mình làm nail 3D ở đây và kết quả vượt mọi kỳ vọng. Giá cả cũng rất hợp lý!"',
    name: 'Trần Thu Trang',
    since: 'Khách hàng thân thiết',
    emoji: '💅',
  },
  {
    stars: '★★★★★',
    text: '"Thủy Linh Nail là địa chỉ tin cậy của mình suốt 2 năm qua. Chất lượng luôn đồng đều, gel bền màu lâu và nhân viên luôn tư vấn nhiệt tình!"',
    name: 'Lê Minh Phương',
    since: 'Khách hàng VIP',
    emoji: '✨',
  },
];

export default function Home() {
  return (
    <div style={{ background: 'var(--bg)' }}>
      {/* Info strip */}
      <div className="hn-strip">
        <span>📍 52 Lê Văn Thịnh · Bắc Ninh</span>
        <span className="sep">·</span>
        <span>📞 0839 056 090</span>
        <span className="sep">·</span>
        <span>🕐 8:00 – 20:00 hàng ngày</span>
        <span className="sep">·</span>
        <span>✨ Đặt lịch để được ưu tiên phục vụ</span>
      </div>

      {/* Sticky nav */}
      <nav className="hn-nav">
        <div className="hn-nav-brand">
          <img src="/images/logo.jpg" alt="Thủy Linh Nail" className="hn-nav-logo" />
          THUY&nbsp;<span>LINH</span>
        </div>
        <ul className="hn-nav-links">
          <li><a href="#home">Trang Chủ</a></li>
          <li><a href="#designs">Bộ Sưu Tập</a></li>
          <li><a href="#about">Giá Dịch Vụ</a></li>
          <li><Link to="/game">Mini Game</Link></li>
          <li><a href="#daotao">Đào Tạo</a></li>
        </ul>
        <button className="hn-nav-book">Đặt Lịch Ngay</button>
      </nav>

      {/* Hero */}
      <section id="home" className="hn-hero">
        <div className="hn-hero-left">
          <div className="hn-hero-eyebrow">Nail Studio Cao Cấp</div>
          <h1 className="hn-hero-name">
            THUY<br /><span>LINH</span><br />NAIL
          </h1>
          <div className="hn-hero-divider" />
          <p className="hn-hero-desc">
            Không gian làm đẹp sang trọng tại Bắc Ninh — nơi nghệ thuật nail
            gặp gỡ sự tinh tế. Mỗi bộ nail là một tác phẩm được chăm chút
            tỉ mỉ từ những đôi bàn tay nghệ nhân.
          </p>
          <div className="hn-hero-ctas">
            <button className="hn-btn-primary">Đặt Lịch Ngay</button>
            <button className="hn-btn-outline">Xem Bộ Sưu Tập</button>
          </div>
          <div className="hn-hero-meta">
            <div className="hn-meta-item">
              <span className="hn-meta-num">4+</span>
              <span className="hn-meta-label">Năm kinh nghiệm</span>
            </div>
            <div className="hn-meta-item">
              <span className="hn-meta-num">2000+</span>
              <span className="hn-meta-label">Khách hàng</span>
            </div>
            <div className="hn-meta-item">
              <span className="hn-meta-num">200+</span>
              <span className="hn-meta-label">Mẫu nail</span>
            </div>
          </div>
        </div>

        <div className="hn-hero-right">
          {HERO_TILES.map((t, i) => (
            <div key={i} className="hn-hero-tile">
              <img src={t.src} alt="nail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="hn-stats">
        <div className="hn-stat-item">
          <div className="hn-stat-num">4+</div>
          <div className="hn-stat-label">Năm Kinh Nghiệm</div>
        </div>
        <div className="hn-stat-item">
          <div className="hn-stat-num">2000+</div>
          <div className="hn-stat-label">Khách Hàng Hài Lòng</div>
        </div>
        <div className="hn-stat-item">
          <div className="hn-stat-num">200+</div>
          <div className="hn-stat-label">Mẫu Nail Độc Đáo</div>
        </div>
        <div className="hn-stat-item">
          <div className="hn-stat-num">5★</div>
          <div className="hn-stat-label">Đánh Giá Trung Bình</div>
        </div>
      </section>

      {/* Designs */}
      <section id="designs" className="hn-designs">
        <div className="hn-section-header">
          <div className="hn-section-eyebrow">Bộ Sưu Tập</div>
          <h2 className="hn-section-title">Mẫu Nail Nổi Bật</h2>
          <p className="hn-section-sub">
            Từ phong cách tối giản thanh lịch đến những họa tiết phức tạp tinh xảo —
            chúng tôi biến mọi ý tưởng của bạn thành hiện thực.
          </p>
        </div>
        <div className="hn-designs-grid">
          {DESIGNS.map((d, i) => (
            <div key={i} className="hn-design-card">
              <div className="hn-design-thumb">
                <img src={d.src} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div className="hn-design-info">
                <div className="hn-design-name">{d.name}</div>
                <div className="hn-design-price">{d.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="hn-about">
        <div className="hn-about-inner">
          <div className="hn-about-img">
            <img src="/images/storefront.jpg" alt="Thủy Linh Nail Studio" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
          </div>
          <div>
            <div className="hn-about-tag">Về Chúng Tôi</div>
            <h2 className="hn-about-title">Nghệ Thuật<br />Từ Tâm Huyết</h2>
            <div className="hn-about-bar" />
            <p className="hn-about-desc">
              Thủy Linh Nail được thành lập với niềm đam mê nghệ thuật làm đẹp.
              Chúng tôi không chỉ làm nail — chúng tôi tạo ra những tác phẩm nghệ thuật
              trên từng đôi bàn tay, giúp bạn tự tin tỏa sáng mọi lúc, mọi nơi.
            </p>
            <div className="hn-about-features">
              {[
                { icon: '🎨', text: 'Đội ngũ thợ tay nghề cao, được đào tạo chuyên sâu' },
                { icon: '✨', text: 'Sử dụng sản phẩm cao cấp, an toàn cho sức khỏe' },
                { icon: '🌸', text: 'Không gian sạch sẽ, sang trọng, thoải mái' },
                { icon: '⏰', text: 'Đặt lịch linh hoạt, phục vụ tận tâm 7 ngày/tuần' },
              ].map((f, i) => (
                <div key={i} className="hn-about-feat">
                  <div className="hn-about-feat-icon">{f.icon}</div>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
            <button className="hn-btn-primary" style={{ width: 'auto', display: 'inline-flex' }}>
              Đặt Lịch Ngay
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hn-cta">
        <div className="hn-cta-tag">Ưu Đãi Đặc Biệt</div>
        <h2 className="hn-cta-title">Đặt Lịch Hôm Nay</h2>
        <p className="hn-cta-sub">
          Giảm 15% cho khách hàng đặt lịch lần đầu — Ưu đãi có hạn, đừng bỏ lỡ!
        </p>
        <div className="hn-cta-btns">
          <button className="hn-cta-btn-primary">📞 Gọi Ngay: 0839 056 090</button>
          <button className="hn-cta-btn-ghost">Xem Bảng Giá</button>
        </div>
      </section>

      {/* Reviews */}
      <section className="hn-reviews">
        <div className="hn-section-header">
          <div className="hn-section-eyebrow">Khách Hàng Nói Gì</div>
          <h2 className="hn-section-title">Đánh Giá Chân Thực</h2>
        </div>
        <div className="hn-reviews-grid">
          {REVIEWS.map((r, i) => (
            <div key={i} className="hn-review-card">
              <div className="hn-review-stars">{r.stars}</div>
              <p className="hn-review-text">{r.text}</p>
              <div className="hn-review-author">
                <div className="hn-review-avatar">{r.emoji}</div>
                <div>
                  <div className="hn-review-name">{r.name}</div>
                  <div className="hn-review-since">{r.since}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Đào Tạo */}
      <section id="daotao" className="hn-training">
        <div className="hn-training-inner">
          <div className="hn-section-header" style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
            <div className="hn-section-eyebrow">Thuỷ Linh Beauty Studio</div>
            <h2 className="hn-section-title">Đào Tạo Nail<br />Chuyên Nghiệp</h2>
            <p className="hn-section-sub" style={{ maxWidth: '560px' }}>
              Bạn thích làm đẹp nhưng chưa biết bắt đầu từ đâu? Hay muốn nâng tay nghề để kiếm thêm thu nhập?
              <br /><strong>Ở đây, bạn không chỉ học làm nail — mà học cách kiếm tiền từ nail.</strong>
            </p>
          </div>

          <div className="hn-training-grid">
            {/* Điểm khác biệt */}
            <div className="hn-tr-card">
              <div className="hn-tr-icon">💖</div>
              <h3 className="hn-tr-title">Điểm Khác Biệt</h3>
              <ul className="hn-tr-list">
                <li>Dạy 1-1 hoặc nhóm nhỏ</li>
                <li>Mỗi học viên 1 lộ trình riêng</li>
                <li>Tập trung thế mạnh từng người</li>
                <li>Cầm tay chỉ việc</li>
              </ul>
            </div>

            {/* Lộ trình */}
            <div className="hn-tr-card hn-tr-card--featured">
              <div className="hn-tr-icon">📚</div>
              <h3 className="hn-tr-title">Lộ Trình Học</h3>
              <div className="hn-tr-path">
                <div className="hn-tr-step">
                  <span className="hn-tr-badge">🔰 Người Mới</span>
                  <span>Cơ bản · Sơn gel · Form móng</span>
                </div>
                <div className="hn-tr-step">
                  <span className="hn-tr-badge">🎨 Nâng Cao</span>
                  <span>Vẽ móng · Đính đá · Phối màu</span>
                </div>
                <div className="hn-tr-step">
                  <span className="hn-tr-badge">💼 Ra Nghề</span>
                  <span>Làm khách thật · Tư vấn · Upsell</span>
                </div>
              </div>
            </div>

            {/* Cam kết */}
            <div className="hn-tr-card">
              <div className="hn-tr-icon">🔥</div>
              <h3 className="hn-tr-title">Cam Kết</h3>
              <ul className="hn-tr-list">
                <li>💰 Làm tại nhà / tiệm / mở tiệm</li>
                <li>✅ Không giấu nghề</li>
                <li>✅ Học đến khi làm được</li>
                <li>✅ Hỗ trợ sau khóa</li>
              </ul>
            </div>
          </div>

          <div className="hn-tr-cta">
            <a href="tel:0839056090" className="hn-btn-primary hn-tr-btn">
              📞 Gọi Tư Vấn Ngay
            </a>
            <span className="hn-tr-phone">0839 056 090</span>
          </div>
        </div>
      </section>

      {/* Game promo */}
      <section className="hn-game">
        <div>
          <div className="hn-game-tag">Thử Ngay</div>
          <div className="hn-game-title">Mini Game Nail 💅</div>
          <div className="hn-game-sub">
            Thách thức trí nhớ của bạn — nhớ và tái tạo mẫu nail trong vài giây!
          </div>
        </div>
        <Link to="/game" className="hn-game-btn">
          🎮 Chơi Ngay
        </Link>
      </section>

      {/* Footer */}
      <footer className="hn-footer">
        <div className="hn-footer-inner">
          <div>
            <div className="hn-footer-brand">THUY <span>LINH</span></div>
            <div className="hn-footer-tagline">Nail Studio · Bắc Ninh</div>
            <p className="hn-footer-desc">
              Không gian làm đẹp sang trọng, chuyên nghiệp tại Bắc Ninh.
              Mỗi bộ nail là một tác phẩm nghệ thuật.
            </p>
            <div className="hn-footer-socials">
              {['📘', '📸', '🎵'].map((s, i) => (
                <div key={i} className="hn-footer-social">{s}</div>
              ))}
            </div>
          </div>
          <div>
            <div className="hn-footer-col-title">Liên Kết</div>
            <ul className="hn-footer-links">
              <li><a href="#home">Trang Chủ</a></li>
              <li><a href="#designs">Bộ Sưu Tập</a></li>
              <li><a href="#about">Về Chúng Tôi</a></li>
              <li><Link to="/game">Mini Game</Link></li>
              <li><a href="#daotao">Đào Tạo</a></li>
              <li><Link to="/login">Đăng Nhập</Link></li>
            </ul>
          </div>
          <div>
            <div className="hn-footer-col-title">Liên Hệ</div>
            <div className="hn-footer-contact">
              <div className="hn-footer-contact-item">
                <span className="hn-footer-contact-icon">📍</span>
                <span>52 Lê Văn Thịnh, Bắc Ninh</span>
              </div>
              <div className="hn-footer-contact-item">
                <span className="hn-footer-contact-icon">📞</span>
                <span>0839 056 090</span>
              </div>
              <div className="hn-footer-contact-item">
                <span className="hn-footer-contact-icon">🕐</span>
                <span>8:00 – 20:00, hàng ngày</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hn-footer-bottom">
          <span className="hn-footer-copy">© 2025 Thủy Linh Nail Studio. All rights reserved.</span>
          <span className="hn-footer-craft">Made with <span>♥</span> in Bắc Ninh</span>
        </div>
      </footer>
    </div>
  );
}
