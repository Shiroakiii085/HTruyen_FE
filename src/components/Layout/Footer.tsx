import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="mt-24 bg-[#0d0a08] pt-20 pb-10 relative overflow-hidden shadow-[inset_0_20px_50px_rgba(0,0,0,0.8),inset_0_-10px_20px_rgba(0,0,0,0.8)] border-t border-ink-deep">
      {/* Decorative Cloud Pattern Border at the very top */}
      <div className="absolute top-0 left-0 w-full h-4 bg-repeat-x z-20" style={{ 
        backgroundImage: 'radial-gradient(circle at 10px 0, transparent 10px, rgba(201,168,76,0.3) 11px, #0d0a08 12px)',
        backgroundSize: '20px 12px'
      }}></div>
      
      {/* Mystical background element */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(201,168,76,0.05)_0%,_transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')] opacity-20 pointer-events-none mix-blend-multiply"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <span className="text-4xl font-black bg-gradient-to-r from-gold-ancient to-blood-sect bg-clip-text text-transparent font-[family-name:var(--font-heading)] drop-shadow-sm">Kiếm Lai Các</span>
            <p className="text-mist-gray mt-5 max-w-sm text-sm leading-relaxed font-medium">
              Thư các tàng kinh vạn quyển, nét bút thủy mặc lưu truyền kim cổ. Khám phá thế giới tu tiên qua từng trang sách.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-paper-warm font-black text-sm uppercase tracking-widest mb-6 font-[family-name:var(--font-heading)]">Khám phá</h4>
            <ul className="space-y-4">
              {['Trang chủ', 'Mới cập nhật', 'Truyện Hot', 'Thể loại'].map((item, i) => (
                <li key={i}>
                  <Link href="#" className="text-mist-gray hover:text-gold-ancient text-sm transition-colors uppercase tracking-widest font-[family-name:var(--font-heading)]">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-paper-warm font-black text-sm uppercase tracking-widest mb-6 font-[family-name:var(--font-heading)]">Hỗ trợ</h4>
            <ul className="space-y-4">
              {['Điều khoản', 'Bảo mật', 'DMCA', 'Liên hệ'].map((item, i) => (
                <li key={i}>
                  <Link href="#" className="text-mist-gray hover:text-gold-ancient text-sm transition-colors uppercase tracking-widest font-[family-name:var(--font-heading)]">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gold-dim/20 flex flex-col md:flex-row justify-between items-center text-mist-gray text-xs font-semibold gap-4 tracking-widest uppercase">
          <p>&copy; {new Date().getFullYear()} Kiếm Lai Các. Lưu truyền vạn giới.</p>
          <div className="flex items-center">
            <span>Khắc họa với</span>
            <FaHeart className="text-blood-sect mx-2 animate-pulse" />
            <span>bởi Tụ Khí Tu Sĩ</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
