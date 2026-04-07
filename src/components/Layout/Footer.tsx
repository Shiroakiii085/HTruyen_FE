import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="mt-24 bg-[#0a0b14] pt-20 pb-10 relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <span className="text-4xl font-black bg-gradient-to-r from-jade-green to-heaven-blue bg-clip-text text-transparent font-[family-name:var(--font-heading)] drop-shadow-sm">HTruyen</span>
            <p className="text-slate-400 max-w-sm text-sm leading-relaxed font-medium">
              Nền tảng đọc truyện tranh hiện đại, cập nhật nhanh nhất, trải nghiệm mượt mà nhất. Khám phá hàng ngàn siêu phẩm tu tiên, hành động và lãng mạn.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6 font-[family-name:var(--font-heading)]">Khám phá</h4>
            <ul className="space-y-4">
              {['Trang chủ', 'Mới cập nhật', 'Truyện Hot', 'Thể loại'].map((item, i) => (
                <li key={i}>
                  <Link href="#" className="text-slate-400 hover:text-jade-green text-sm transition-colors uppercase tracking-widest font-[family-name:var(--font-heading)]">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6 font-[family-name:var(--font-heading)]">Hỗ trợ</h4>
            <ul className="space-y-4">
              {['Điều khoản', 'Bảo mật', 'DMCA', 'Liên hệ'].map((item, i) => (
                <li key={i}>
                  <Link href="#" className="text-slate-400 hover:text-jade-green text-sm transition-colors uppercase tracking-widest font-[family-name:var(--font-heading)]">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs font-semibold gap-4 tracking-widest uppercase">
          <p>&copy; {new Date().getFullYear()} HTruyen. Toàn bộ nội dung đều được sưu tầm.</p>
          <div className="flex items-center">
            <span>Phát triển với</span>
            <FaHeart className="text-emerald-500 mx-2 animate-pulse" />
            <span>bởi HTruyen Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
