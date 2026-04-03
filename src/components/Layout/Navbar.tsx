"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FaSearch, FaUser, FaSignOutAlt, FaBook, FaBars, FaTimes, FaStar } from 'react-icons/fa';
import { getRealmInfo } from '@/utils/levelSystem';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const realmInfo = user ? getRealmInfo(user.level || 1, user.exp || 0) : null;

  if (pathname?.startsWith('/doc-truyen/')) {
    return null;
  }

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/tim-kiem?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-4 z-50 mx-auto w-[calc(100%-2rem)] max-w-7xl glass rounded-2xl shadow-premium transition-all duration-300 translate-y-0">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center group">
            <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-accent to-indigo-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              HTruyen
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-10">
            {['Trang chủ', 'Mới cập nhật', 'Truyện Hot', 'Thể loại'].map((item, idx) => (
              <Link 
                key={idx}
                href={idx === 0 ? '/' : idx === 3 ? '/the-loai' : `/danh-sach/truyen-${idx === 1 ? 'moi' : 'hot'}`} 
                className="text-text-muted hover:text-accent font-semibold text-sm uppercase tracking-wide transition-all hover:translate-y-[-1px]"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Search & Auth */}
          <div className="hidden md:flex items-center flex-1 justify-end space-x-6">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Tìm truyện..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="bg-white/5 text-text-main border border-white/10 rounded-xl py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all w-48 group-focus-within:w-64 placeholder:text-text-dim text-sm"
              />
              <FaSearch className="absolute right-3 top-2.5 text-text-dim group-focus-within:text-accent transition-colors" size={14} />
            </div>

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-colors">
                  <div className="w-7 h-7 rounded-lg overflow-hidden border border-accent/30 shadow-sm shadow-accent/20">
                    <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" />
                  </div>
                  <span className="text-xs font-bold text-text-muted group-hover:text-text-main transition-colors">{user.username}</span>
                </button>
                
                <div className="absolute right-0 top-full mt-2 w-52 glass rounded-2xl shadow-2xl py-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 border border-white/5 origin-top-right transform scale-95 group-hover:scale-100 backdrop-blur-2xl">
                  <div className="px-4 py-2 border-b border-white/5 mb-1">
                    <p className="text-xs text-text-dim font-medium uppercase tracking-tighter">Tài khoản</p>
                    <p className="text-sm text-text-main font-bold truncate">{user.username}</p>
                    {realmInfo && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-black text-accent uppercase tracking-widest">{realmInfo.name}</span>
                          <span className="text-[10px] text-text-muted">{realmInfo.isMax ? 'MAX' : `${realmInfo.currentExp}/${realmInfo.requiredExp}`}</span>
                        </div>
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-accent transition-all duration-300" style={{ width: `${realmInfo.progressPercent}%` }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <Link href="/profile" className="flex items-center px-4 py-2.5 hover:bg-white/5 text-sm text-text-muted hover:text-accent transition-colors">
                    <FaUser className="mr-3 opacity-70" /> Hồ sơ cá nhân
                  </Link>
                  <Link href="/lich-su" className="flex items-center px-4 py-2.5 hover:bg-white/5 text-sm text-text-muted hover:text-accent transition-colors">
                    <FaBook className="mr-3 opacity-70" /> Truyện đã đọc
                  </Link>
                  <div className="mx-2 my-1 border-t border-white/5"></div>
                  <button onClick={logout} className="w-full flex items-center px-4 py-2.5 text-sm text-red-400/80 hover:text-red-400 hover:bg-red-400/5 transition-all">
                    <FaSignOutAlt className="mr-3" /> Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/auth/login" className="bg-accent text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                Đăng nhập
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className={`p-2 rounded-xl transition-colors ${isMenuOpen ? 'bg-accent/10 text-accent' : 'text-text-muted hover:bg-white/5'}`}
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'max-h-[32rem] opacity-100 border-t border-white/5' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 py-6 space-y-5 bg-surface-bg/50 backdrop-blur-xl">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Tìm kiếm truyện..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full bg-white/5 text-white py-3 px-5 rounded-2xl border border-white/10 focus:ring-2 focus:ring-accent/50 outline-none placeholder:text-text-dim text-sm" 
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {['Trang chủ', 'Mới cập nhật', 'Truyện Hot', 'Thể loại'].map((item, idx) => (
              <Link key={idx} href={idx === 0 ? '/' : idx === 3 ? '/the-loai' : `/danh-sach/truyen-${idx === 1 ? 'moi' : 'hot'}`} className="bg-white/5 py-3 px-4 rounded-xl text-sm font-medium text-text-muted hover:text-accent hover:bg-accent/5 text-center transition-all">
                {item}
              </Link>
            ))}
          </div>
          {user ? (
             <div className="pt-4 border-t border-white/5">
                <div className="flex items-center space-x-4 mb-3 p-3 bg-white/5 rounded-2xl">
                  <img src={user.avatar} className="w-12 h-12 rounded-xl border-2 border-accent/30 shadow-lg object-cover" alt="avatar" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold truncate">{user.username}</p>
                    <p className="text-xs text-text-dim truncate">{user.email}</p>
                  </div>
                </div>
                
                {realmInfo && (
                  <div className="bg-white/5 p-4 rounded-xl mb-4 border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                       <div className="flex items-center space-x-2">
                         <FaStar className="text-accent" size={12} />
                         <span className="text-xs font-black text-accent uppercase tracking-widest">{realmInfo.name}</span>
                       </div>
                       <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white font-bold">{realmInfo.isMax ? 'MAX' : `${realmInfo.currentExp}/${realmInfo.requiredExp} XP`}</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-accent to-indigo-500 transition-all duration-500" style={{ width: `${realmInfo.progressPercent}%` }}></div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center w-full py-3 px-4 bg-white/5 rounded-xl text-sm text-text-muted hover:text-white transition-colors"><FaUser className="mr-3 text-accent" /> Hồ sơ cá nhân</Link>
                  <Link href="/lich-su" onClick={() => setIsMenuOpen(false)} className="flex items-center w-full py-3 px-4 bg-white/5 rounded-xl text-sm text-text-muted hover:text-white transition-colors"><FaBook className="mr-3 text-accent" /> Truyện đã đọc</Link>
                  <button onClick={logout} className="w-full flex items-center py-3 px-4 bg-red-400/5 text-red-400 rounded-xl text-sm font-bold"><FaSignOutAlt className="mr-3" /> Đăng xuất</button>
                </div>
             </div>
          ) : (
            <Link href="/auth/login" className="block w-full text-center bg-accent text-white py-4 rounded-2xl font-black shadow-xl shadow-accent/20">
              BẮT ĐẦU ĐỌC NGAY
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
