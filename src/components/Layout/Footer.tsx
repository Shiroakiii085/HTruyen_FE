import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5 bg-surface-bg/30 backdrop-blur-md pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <span className="text-3xl font-black bg-gradient-to-r from-accent to-indigo-400 bg-clip-text text-transparent">HTruyen</span>
            <p className="text-text-muted mt-5 max-w-sm text-sm leading-relaxed font-medium">
              Nền tảng đọc truyện tranh trực tuyến hiện đại, nhanh chóng và mượt mà. Đưa thế giới truyện tranh vào túi của bạn với trải nghiệm hình ảnh sắc nét nhất.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-text-main font-bold text-sm uppercase tracking-widest mb-6">Khám phá</h4>
            <ul className="space-y-4">
              {['Trang chủ', 'Mới cập nhật', 'Truyện Hot', 'Thể loại'].map((item, i) => (
                <li key={i}>
                  <Link href="#" className="text-text-dim hover:text-accent text-sm transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-text-main font-bold text-sm uppercase tracking-widest mb-6">Hỗ trợ</h4>
            <ul className="space-y-4">
              {['Điều khoản', 'Bảo mật', 'DMCA', 'Liên hệ'].map((item, i) => (
                <li key={i}>
                  <Link href="#" className="text-text-dim hover:text-accent text-sm transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-text-dim text-xs font-semibold gap-4">
          <p>&copy; {new Date().getFullYear()} HTruyen Platform. All rights reserved.</p>
          <div className="flex items-center">
            <span>Made with</span>
            <FaHeart className="text-accent mx-2 animate-pulse" />
            <span>by HTruyen Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
