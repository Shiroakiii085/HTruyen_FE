"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FaSearch, FaUser, FaSignOutAlt, FaBook, FaBars, FaTimes, FaStar, FaChartLine } from 'react-icons/fa';
import { animate } from 'animejs';
import { getRealmInfo, LEVEL_SYSTEM } from '@/utils/levelSystem';
import EvolvingProgressBar from '../Common/EvolvingProgressBar';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const realmInfo = user ? getRealmInfo(user.level || 1, user.exp || 0) : null;
  const currentRealm = realmInfo ? LEVEL_SYSTEM.find(r => r.level === realmInfo.level) : null;

  if (pathname?.startsWith('/doc-truyen/')) {
    return null;
  }

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/tim-kiem?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  };

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('div');
    ripple.className = 'absolute rounded-full bg-ink-deep/60 pointer-events-none mix-blend-multiply z-50';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.left = `${x - 10}px`;
    ripple.style.top = `${y - 10}px`;
    
    el.appendChild(ripple);

    animate(ripple, {
      scale: [0, 15],
      opacity: [0.6, 0],
      duration: 600,
      easing: 'easeOutQuart'
    }).then(() => {
      ripple.remove();
    });
  };

  return (
    <nav className="sticky top-4 z-50 mx-auto w-[calc(100%-2rem)] max-w-7xl bg-ink-deep/90 backdrop-blur-xl rounded-[4px] shadow-[0_4px_20px_rgba(26,20,16,0.7)] transition-all duration-300 translate-y-0 border border-gold-dim/40 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-20 pointer-events-none mix-blend-multiply"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/5 to-transparent pointer-events-none opacity-30 mask-image-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxwYXRoIGQ9Ik0wLDEwMCBMMjAsODAgTDQwLDkwIEw2MCw1MCBMODAsNzAgTDEwMCw0MCBMMTAwLDEwMCBaIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==')]"></div>
      <div className="px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center group">
            <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-jade-green to-heaven-blue bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(16,185,129,0.3)] group-hover:drop-shadow-[0_0_15px_rgba(16,185,129,0.6)] transition-all duration-300 font-[family-name:var(--font-heading)] tracking-wider">
              HTruyen
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-10">
            {['Trang chủ', 'Mới cập nhật', 'Truyện Hot', 'Thể loại'].map((item, idx) => (
              <Link 
                key={idx}
                href={idx === 0 ? '/' : idx === 3 ? '/the-loai' : `/danh-sach/truyen-${idx === 1 ? 'moi' : 'hot'}`} 
                className="relative text-paper-warm hover:text-gold-ancient font-semibold text-sm uppercase tracking-[0.15em] transition-colors py-1.5 font-[family-name:var(--font-heading)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gold-ancient after:origin-left after:[clip-path:inset(0_100%_0_0)] hover:after:[clip-path:inset(0_0_0_0)] after:transition-[clip-path] after:duration-500 after:ease-out"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Search & Auth */}
          <div className="hidden md:flex items-center flex-1 justify-end space-x-6">
            <div className="relative group">
              <div className="relative group before:content-[''] before:absolute before:left-[-10px] before:top-[-4px] before:bottom-[-4px] before:w-[20px] before:bg-gold-dim before:rounded-full before:z-0 after:content-[''] after:absolute after:right-[-10px] after:top-[-4px] after:bottom-[-4px] after:w-[20px] after:bg-gold-dim after:rounded-full after:z-0">
                <input 
                  type="text" 
                  placeholder="Tìm truyện..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="relative z-10 bg-[#e8dbbf] text-ink-deep border-y-2 border-gold-ancient py-2 pl-4 pr-10 focus:outline-none focus:bg-paper-warm transition-all w-48 group-focus-within:w-64 placeholder:text-ink-deep/60 text-sm font-[family-name:var(--font-heading)] rounded-none shadow-[inset_0_2px_4px_rgba(26,20,16,0.3)]"
                />
                <FaSearch className="absolute right-2 top-3 z-20 text-ink-deep group-focus-within:text-blood-sect transition-colors cursor-pointer" size={14} />
              </div>
            </div>

            {user ? (
              <div className="relative">
                <button 
                  onClick={(e) => { handleRipple(e); setIsUserMenuOpen(!isUserMenuOpen); }} 
                  className={`relative overflow-hidden flex items-center space-x-2 px-3 py-1.5 rounded-[4px] border transition-colors ${isUserMenuOpen ? 'bg-gold-ancient/30 border-gold-ancient' : 'bg-paper-aged/10 hover:bg-gold-ancient/20 border-gold-dim/30'}`}
                >
                  <div className="w-7 h-7 rounded-[2px] overflow-hidden border border-gold-dim/50 shadow-sm">
                    <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" />
                  </div>
                  <span className={`text-xs font-bold font-[family-name:var(--font-heading)] transition-colors ${isUserMenuOpen ? 'text-gold-ancient' : 'text-mist-gray'}`}>{user.username}</span>
                </button>
                
                <div 
                  className={`absolute right-0 top-full mt-2 w-52 bg-ink-deep/95 rounded-[4px] shadow-md py-2 border border-gold-dim/30 origin-top-right transform transition-all duration-200 backdrop-blur-xl z-[100] ${
                    isUserMenuOpen ? 'visible opacity-100 scale-100' : 'invisible opacity-0 scale-95'
                  }`}
                >
                  <div className="px-4 py-3 border-b border-gold-dim/20 mb-1">
                    <p className="text-[10px] text-mist-gray font-black uppercase tracking-[0.2em] font-[family-name:var(--font-heading)]">Tài khoản</p>
                    <p className="text-sm text-paper-warm font-bold truncate font-[family-name:var(--font-heading)]">{user.username}</p>
                    
                    {realmInfo && currentRealm && (
                      <div className="mt-4 p-3 bg-white/5 rounded-2xl border border-white/5 group/realm relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover/realm:opacity-100 transition-opacity"></div>
                        <div className="flex items-center space-x-3 mb-3 relative z-10">
                          <div className="relative w-10 h-10 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full blur-lg opacity-20" style={{ backgroundColor: currentRealm.color }}></div>
                            <img 
                              src={currentRealm.icon} 
                              className="relative w-8 h-8 object-contain animate-float" 
                              alt={currentRealm.name}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://cdn-icons-png.flaticon.com/512/10331/10331666.png'; // Fallback
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black text-accent uppercase tracking-widest leading-none mb-1">Cấp độ</p>
                            <p className="text-xs font-black text-text-main truncate">{currentRealm.name}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-1.5 relative z-10">
                          <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-text-dim uppercase tracking-tighter">Tiến độ</span>
                            <span className="text-text-muted">{realmInfo.isMax ? 'MAX' : `${realmInfo.currentExp}/${realmInfo.requiredExp} XP`}</span>
                          </div>
                          <EvolvingProgressBar 
                            level={currentRealm.level}
                            progressPercent={realmInfo.progressPercent}
                            tier={currentRealm.tier}
                            color={currentRealm.color}
                            isMax={realmInfo.isMax}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <Link href="/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center px-4 py-2.5 hover:bg-gold-ancient/20 text-sm text-mist-gray hover:text-gold-ancient transition-colors font-[family-name:var(--font-heading)]">
                    <FaUser className="mr-3 opacity-70" /> Hồ sơ cá nhân
                  </Link>
                  <Link href="/lich-su" onClick={() => setIsUserMenuOpen(false)} className="flex items-center px-4 py-2.5 hover:bg-gold-ancient/20 text-sm text-mist-gray hover:text-gold-ancient transition-colors font-[family-name:var(--font-heading)]">
                    <FaBook className="mr-3 opacity-70" /> Truyện đã đọc
                  </Link>
                  {user.role?.toLowerCase() === 'admin' && (
                    <Link href="/admin" onClick={() => setIsUserMenuOpen(false)} className="flex items-center px-4 py-2.5 hover:bg-gold-ancient/20 text-sm text-mist-gray hover:text-gold-ancient transition-colors font-[family-name:var(--font-heading)]">
                      <FaChartLine className="mr-3 opacity-70" /> Trang quản trị
                    </Link>
                  )}
                  <div className="mx-2 my-1 border-t border-gold-dim/20"></div>
                  <button onClick={() => { logout(); setIsUserMenuOpen(false); }} className="w-full flex items-center px-4 py-2.5 text-sm text-blood-sect hover:text-blood-sect/80 hover:bg-blood-sect/10 transition-all font-[family-name:var(--font-heading)]">
                    <FaSignOutAlt className="mr-3" /> Đăng xuất (Thoát)
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/auth/login" onClick={handleRipple} className="relative overflow-hidden bg-blood-sect text-paper-warm px-5 py-2.5 rounded-[4px] text-sm font-black border border-blood-sect/50 shadow-sm shadow-blood-sect/20 hover:shadow-blood-sect/40 hover:-translate-y-0.5 active:translate-y-0 transition-all font-[family-name:var(--font-heading)] tracking-widest uppercase">
                Đăng nhập
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className={`p-2 rounded-[4px] transition-colors border border-transparent ${isMenuOpen ? 'bg-gold-ancient/10 text-gold-ancient border-gold-dim/30' : 'text-mist-gray hover:bg-gold-ancient/10 hover:text-gold-ancient hover:border-gold-dim/30'}`}
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'max-h-[36rem] opacity-100 border-t border-gold-dim/30' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 py-6 space-y-5 bg-ink-deep/95 backdrop-blur-xl">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Tìm kiếm truyện..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full bg-paper-aged text-white py-3 px-5 rounded-[4px] border border-gold-dim/30 focus:ring-2 focus:ring-blood-sect/50 outline-none placeholder:text-mist-gray text-sm font-[family-name:var(--font-heading)]" 
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {['Trang chủ', 'Mới cập nhật', 'Truyện Hot', 'Thể loại'].map((item, idx) => (
              <Link key={idx} href={idx === 0 ? '/' : idx === 3 ? '/the-loai' : `/danh-sach/truyen-${idx === 1 ? 'moi' : 'hot'}`} className="bg-paper-aged/10 py-3 px-4 rounded-[4px] text-sm font-medium text-mist-gray hover:text-gold-ancient hover:bg-gold-ancient/20 border border-gold-dim/20 text-center transition-all font-[family-name:var(--font-heading)] tracking-widest uppercase">
                {item}
              </Link>
            ))}
          </div>
          {user ? (
             <div className="pt-4 border-t border-gold-dim/20">
                <div className="flex items-center space-x-4 mb-3 p-4 bg-paper-aged/10 border border-gold-dim/30 rounded-[4px]">
                  <img src={user.avatar} className="w-12 h-12 rounded-[2px] border border-gold-ancient/40 shadow-sm object-cover" alt="avatar" />
                  <div className="flex-1 min-w-0">
                    <p className="text-paper-warm font-bold truncate font-[family-name:var(--font-heading)]">{user.username}</p>
                    <p className="text-xs text-mist-gray truncate">{user.email}</p>
                  </div>
                </div>
                
                {realmInfo && currentRealm && (
                  <div className="bg-white/5 p-4 rounded-xl mb-4 border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                       <div className="flex items-center space-x-3">
                          <img 
                            src={currentRealm.icon} 
                            className="w-8 h-8 object-contain animate-float" 
                            alt="icon" 
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://cdn-icons-png.flaticon.com/512/10331/10331666.png'; // Fallback
                            }}
                          />
                          <span className="text-xs font-black text-accent uppercase tracking-widest">{currentRealm.name}</span>
                       </div>
                       <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white font-bold">{realmInfo.isMax ? 'MAX' : `${realmInfo.currentExp}/${realmInfo.requiredExp} XP`}</span>
                    </div>
                    <EvolvingProgressBar 
                      level={currentRealm.level}
                      progressPercent={realmInfo.progressPercent}
                      tier={currentRealm.tier}
                      color={currentRealm.color}
                      isMax={realmInfo.isMax}
                    />
                  </div>
                )}

                <div className="space-y-2 mt-4">
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center w-full py-4 px-4 bg-paper-aged/10 border border-gold-dim/20 rounded-[4px] text-sm text-mist-gray hover:text-gold-ancient hover:bg-gold-ancient/20 transition-colors font-[family-name:var(--font-heading)] uppercase tracking-wider"><FaUser className="mr-3 text-gold-ancient" /> Hồ sơ cá nhân</Link>
                  <Link href="/lich-su" onClick={() => setIsMenuOpen(false)} className="flex items-center w-full py-4 px-4 bg-paper-aged/10 border border-gold-dim/20 rounded-[4px] text-sm text-mist-gray hover:text-gold-ancient hover:bg-gold-ancient/20 transition-colors font-[family-name:var(--font-heading)] uppercase tracking-wider"><FaBook className="mr-3 text-gold-ancient" /> Truyện đã đọc</Link>
                  {user.role?.toLowerCase() === 'admin' && (
                    <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center w-full py-4 px-4 bg-paper-aged/10 border border-gold-dim/20 rounded-[4px] text-sm text-mist-gray hover:text-gold-ancient hover:bg-gold-ancient/20 transition-colors font-[family-name:var(--font-heading)] uppercase tracking-wider"><FaChartLine className="mr-3 text-gold-ancient" /> Trang quản trị</Link>
                  )}
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full flex items-center py-4 px-4 bg-blood-sect/10 border border-blood-sect/30 text-blood-sect rounded-[4px] text-sm font-black font-[family-name:var(--font-heading)] uppercase tracking-widest hover:bg-blood-sect hover:text-paper-warm transition-all"><FaSignOutAlt className="mr-3" /> Đăng xuất (Thoát)</button>
                </div>
             </div>
          ) : (
            <Link href="/auth/login" className="block w-full text-center bg-blood-sect border border-blood-sect/50 text-paper-warm py-4 rounded-[4px] font-black shadow-sm font-[family-name:var(--font-heading)] tracking-widest uppercase hover:bg-blood-sect/80 transition-colors">
              ĐĂNG NHẬP NGAY
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
