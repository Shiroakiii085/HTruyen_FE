"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { comicService } from '@/services/comicService';
import { FaChevronLeft, FaHome, FaListUl, FaArrowUp, FaCog, FaExpand, FaCompress, FaSearch, FaChevronDown } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

export default function Reader() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;
  const chapterName = params.chapter as string;
  const apiUrl = searchParams.get('api');
  const { user, refreshUser, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  
  const [images, setImages] = useState<any[]>([]);
  const [imageDomain, setImageDomain] = useState('');
  const [chapterPath, setChapterPath] = useState('');
  const [loading, setLoading] = useState(true);   
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [chapterList, setChapterList] = useState<any[]>([]);
  const [comicInfo, setComicInfo] = useState<any>(null);
  const [loadedImagesCount, setLoadedImagesCount] = useState(0);
  const [isChapterMenuOpen, setIsChapterMenuOpen] = useState(false);
  const [chapterSearch, setChapterSearch] = useState('');
  const lastScrollY = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const expRecorded = useRef(false);

  useEffect(() => {
    const fetchFullComic = async () => {
      try {
        const res = await comicService.getComicDetail(slug);
        if (res.status === 'success') {
          const allChapters = res.data.item.chapters?.[0]?.server_data || [];
          setChapterList(allChapters);
          setComicInfo({ ...res.data.item, APP_DOMAIN_CDN_IMAGE: res.data.APP_DOMAIN_CDN_IMAGE });
        }
      } catch (err) {
        console.error('Error fetching chapter list:', err);
      }
    };
    fetchFullComic();
  }, [slug]);

  useEffect(() => {
    const fetchChapter = async () => {
      if (!apiUrl) return;
      try {
        setLoading(true);
        const res = await comicService.getChapter(apiUrl);
        if (res.status === 'success') {
          setImages(res.data.item.chapter_image);
          setImageDomain(res.data.domain_cdn || res.data.APP_DOMAIN_CDN_IMAGE);
          setChapterPath(res.data.item.chapter_path);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChapter();
    expRecorded.current = false;
    setLoadedImagesCount(0); // Reset for new chapter
  }, [apiUrl]);
  
  // Record reading history and grant EXP when chapter is fully loaded
  useEffect(() => {
    if (!user || !slug || !chapterName || !apiUrl || expRecorded.current || images.length === 0) return;
    
    // Only call history API when all images in the chapter are loaded
    if (loadedImagesCount >= images.length) {
      expRecorded.current = true;

      const domain = comicInfo?.APP_DOMAIN_CDN_IMAGE || 'https://img.otruyenapi.com';
      const fullThumbUrl = comicInfo?.thumb_url ? 
        (comicInfo.thumb_url.startsWith('http') ? comicInfo.thumb_url : `${domain}/uploads/comics/${comicInfo.thumb_url}`) : '';

      api.post('/History', {
        comicSlug: slug,
        comicName: comicInfo?.name || slug,
        thumbUrl: fullThumbUrl,
        chapterName: chapterName,
        chapterApiData: apiUrl,
        scrollPosition: 0
      })
      .then(res => {
        if (res.data.expAdded > 0) {
          // Success notification for gaining EXP
          console.log(`Chúc mừng! Bạn đã nhận ${res.data.expAdded} EXP`);
          refreshUser(); // Sync the UI level/exp bar
        }
      })
      .catch(err => console.error('History API error:', err));
    }
  }, [user, slug, chapterName, apiUrl, comicInfo, images.length, loadedImagesCount]);

  const currentIndex = chapterList.findIndex(c => c.chapter_name === chapterName);
  
  // Detect if the chapter list is ascending or descending based on first and last available chapters
  const isAscending = chapterList.length > 1 && 
    (parseFloat(chapterList[chapterList.length - 1].chapter_name) || 0) > (parseFloat(chapterList[0].chapter_name) || 0);

  // If ascending: next is i+1, prev is i-1. If descending: next is i-1, prev is i+1.
  const nextChapter = isAscending 
    ? (currentIndex < chapterList.length - 1 ? chapterList[currentIndex + 1] : null)
    : (currentIndex > 0 ? chapterList[currentIndex - 1] : null);

  const prevChapter = isAscending
    ? (currentIndex > 0 ? chapterList[currentIndex - 1] : null)
    : (currentIndex < chapterList.length - 1 ? chapterList[currentIndex + 1] : null);

  const navigateToChapter = (chapter: any) => {
    if (!chapter) return;
    setIsChapterMenuOpen(false);
    router.push(`/doc-truyen/${slug}/${chapter.chapter_name}?api=${encodeURIComponent(chapter.chapter_api_data)}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollable = docHeight - winHeight;
      const currentProgress = scrollable > 0 ? (currentScrollY / scrollable) * 100 : 0;
      
      setProgress(currentProgress);
      setIsScrolled(currentScrollY > 500);

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setShowControls(false);
        setIsChapterMenuOpen(false);
      } else {
        setShowControls(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsChapterMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleContainerTap = () => {
    setShowControls(prev => !prev);
  };

  const filteredChapters = chapterList.filter(c => 
    c.chapter_name.toLowerCase().includes(chapterSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-primary-bg space-y-6">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="text-text-dim font-black uppercase tracking-[0.3em] animate-pulse">Đang tải chương truyện...</p>
      </div>
    );
  }

  // Handle login requirement after mounting and ensuring auth rehydration is complete
  if (mounted && !isLoading && !user) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center p-4">
        <div className="glass p-10 rounded-3xl space-y-6 max-w-sm text-center">
           <h2 className="text-xl font-black text-white uppercase tracking-widest">YÊU CẦU ĐĂNG NHẬP</h2>
           <p className="text-text-muted text-sm font-medium">Bạn cần đăng nhập để có thể đọc truyện và tích lũy Cảnh giới!</p>
           <button onClick={() => router.push('/auth/login')} className="w-full bg-accent text-white py-4 rounded-2xl font-black hover:scale-105 transition-all shadow-xl shadow-accent/20">ĐĂNG NHẬP NGAY</button>
           <button onClick={() => router.back()} className="w-full bg-white/5 text-text-muted py-3 rounded-2xl font-black hover:bg-white/10 transition-all">QUAY LẠI</button>
        </div>
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-primary-bg space-y-8 p-6 text-center">
        <div className="glass p-10 rounded-3xl space-y-6 max-w-sm">
          <h2 className="text-xl font-black text-white uppercase tracking-widest">Không thể tải nội dung</h2>
          <p className="text-text-muted text-sm font-medium">Chúng tôi gặp sự cố khi lấy hình ảnh cho chương này.</p>
          <button onClick={() => router.back()} className="w-full bg-accent text-white py-4 rounded-2xl font-black hover:scale-105 transition-all">QUAY LẠI</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary-bg min-h-screen">
      
      {/* Dynamic Top Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${showControls ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
        <div className="mx-auto max-w-5xl mt-4 px-4">
          <div className="glass rounded-2xl px-4 py-3 flex justify-between items-center shadow-premium ring-1 ring-white/5 relative">
            <div className="flex items-center gap-2 flex-1">
              <Link href="/" className="flex items-center group ml-1 p-2 bg-white/5 hover:bg-accent/10 rounded-xl border border-white/5 hover:border-accent/30 transition-all duration-300" title="Về trang chủ">
                <FaHome className="text-xl md:text-2xl text-accent group-hover:scale-110 transition-transform duration-300" />
              </Link>
            </div>

            {/* Central Navigation Group */}
            <div className="flex items-center gap-4 sm:gap-12">
              {/* Left button = Prev chapter (i-1) */}
              <button 
                onClick={() => navigateToChapter(prevChapter)}
                disabled={!prevChapter}
                className={`p-3 sm:p-4 rounded-xl transition-all shadow-sm ${!prevChapter ? 'opacity-10 cursor-not-allowed text-white/20 bg-white/5' : 'text-white/70 hover:text-white bg-white/10 hover:bg-white/15'}`}
                title="Chương trước"
              >
                <FaChevronLeft size={18} />
              </button>

              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setIsChapterMenuOpen(!isChapterMenuOpen)}
                  className="glass-bright px-4 sm:px-6 py-3 rounded-xl flex items-center gap-3 group hover:border-accent/40 transition-all border border-white/10"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-black text-accent uppercase tracking-[0.2em] leading-none mb-1">Chương</span>
                    <span className="text-text-main font-black text-sm sm:text-base tracking-tighter leading-none">{chapterName}</span>
                  </div>
                  <FaChevronDown size={10} className={`text-text-dim group-hover:text-accent transition-transform duration-300 ${isChapterMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Chapter Dropdown Menu */}
                {isChapterMenuOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 sm:w-80 glass rounded-3xl shadow-2xl border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-4 bg-white/5 border-b border-white/5">
                      <div className="relative">
                        <input 
                          type="text"
                          placeholder="Tìm nhanh chương..."
                          value={chapterSearch}
                          onChange={(e) => setChapterSearch(e.target.value)}
                          className="w-full bg-primary-bg/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                        />
                        <FaSearch size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" />
                      </div>
                    </div>
                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                       {filteredChapters.length > 0 ? (
                         filteredChapters.map((chapter, idx) => (
                           <button
                             key={idx}
                             onClick={() => navigateToChapter(chapter)}
                             className={`w-full text-left px-4 py-3 rounded-xl transition-all flex justify-between items-center group ${chapter.chapter_name === chapterName ? 'bg-accent/20 border border-accent/20' : 'hover:bg-white/5 border border-transparent'}`}
                           >
                             <span className={`font-bold text-sm ${chapter.chapter_name === chapterName ? 'text-accent' : 'text-text-muted group-hover:text-text-main'}`}>
                                Chương {chapter.chapter_name}
                             </span>
                             {chapter.chapter_name === chapterName && (
                               <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
                             )}
                           </button>
                         ))
                       ) : (
                         <div className="py-10 text-center">
                            <p className="text-text-dim text-xs font-bold uppercase tracking-widest">Không tìm thấy chương</p>
                         </div>
                       )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right button = Next chapter (i+1) */}
              <button 
                onClick={() => navigateToChapter(nextChapter)}
                disabled={!nextChapter}
                className={`p-3 sm:p-4 rounded-xl transition-all shadow-sm ${!nextChapter ? 'opacity-10 cursor-not-allowed text-white/20 bg-white/5' : 'text-white/70 hover:text-white bg-white/10 hover:bg-white/15'}`}
                title="Chương sau"
              >
                <FaChevronLeft size={18} className="rotate-180" />
              </button>
            </div>

            <div className="flex-1 flex justify-end">
              {/* Spacer or additional controls like settings/expand could go here */}
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mx-auto max-w-5xl px-6 mt-2">
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-300 ease-out shadow-[0_0_8px_rgba(239,68,68,0.5)]" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </nav>

      {/* Reader (Image Thread) */}
      <div 
        className="max-w-3xl mx-auto flex flex-col items-center select-none pt-4 cursor-pointer"
        onClick={handleContainerTap}
      >
        {images.map((img, idx) => {
          let host = imageDomain;
          if (host && !host.startsWith('http')) host = `https://${host}`;
          const src = `${host}/${chapterPath}/${img.image_file}`;
          return (
            <div key={idx} className="relative w-full max-w-[800px] mx-auto group min-h-[400px] flex items-center justify-center bg-surface-bg/50">
              <img 
                src={src} 
                alt={`Page ${img.image_page}`}
                loading={idx < 3 ? "eager" : "lazy"}
                className="w-full max-w-[800px] mx-auto h-auto shadow-2xl transition-opacity duration-700"
                onLoad={() => {
                   setLoadedImagesCount(prev => prev + 1);
                }}
                style={{ opacity: 1 }}
              />
              <div className="absolute bottom-4 right-4 glass px-3 py-1 rounded-lg text-[10px] font-black text-text-dim opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                P. {img.image_page}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Navigation */}
      <div className="max-w-3xl mx-auto px-4 py-20 flex flex-col items-center gap-8">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        <div className="flex items-center gap-4 w-full">
          {prevChapter ? (
            <button 
              onClick={() => navigateToChapter(prevChapter)}
              className="flex-1 glass group hover:bg-white/10 p-6 rounded-3xl transition-all border border-white/5 flex flex-col items-start gap-2"
            >
              <span className="text-[10px] font-black text-text-dim uppercase tracking-widest">← Chương trước</span>
              <span className="text-text-main font-black group-hover:text-accent transition-colors">Chương {prevChapter.chapter_name}</span>
            </button>
          ) : (
             <div className="flex-1 glass p-6 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center opacity-40">
              <span className="text-[10px] font-black text-text-dim uppercase tracking-widest">Không có chương trước</span>
            </div>
          )}

          {nextChapter ? (
            <button 
              onClick={() => navigateToChapter(nextChapter)}
              className="flex-[2] bg-accent group hover:scale-[1.02] p-6 rounded-3xl transition-all border border-white/10 flex flex-col items-end gap-2 shadow-xl shadow-accent/20"
            >
              <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Chương sau →</span>
              <span className="text-white font-black">Chương {nextChapter.chapter_name}</span>
            </button>
          ) : (
            <div className="flex-1 glass p-6 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-black text-accent uppercase tracking-widest">Đã hết chương</span>
              <span className="text-text-dim font-bold text-xs">Hãy quay lại sau!</span>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className={`fixed right-8 flex flex-col gap-3 transition-all duration-500 z-[60] ${showControls ? 'bottom-20' : 'bottom-8'} ${isScrolled ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-5 rounded-2xl bg-accent text-white shadow-xl shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-1 transition-all group"
        >
          <FaArrowUp className="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Bottom Quick Info */}
      <div className={`fixed bottom-0 left-0 right-0 p-4 transition-all duration-500 z-50 ${showControls ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
         <div className="mx-auto max-w-md glass px-6 py-2 rounded-full flex justify-between items-center text-[10px] font-black text-text-muted shadow-premium border border-white/5">
            <span className="uppercase tracking-widest">Tiến độ đọc</span>
            <span className="text-accent">{Math.round(progress)}%</span>
         </div>
      </div>

    </div>
  );
}
