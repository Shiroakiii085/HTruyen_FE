"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { comicService } from '@/services/comicService';
import { FaChevronLeft, FaHome, FaListUl, FaArrowUp, FaCog, FaExpand, FaCompress, FaSearch, FaChevronDown, FaMoon, FaSun } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import CommentSection from '@/components/Comic/CommentSection';
import AmbientDust from '@/components/Reader/AmbientDust';
import ReadingContainer from '@/components/Reader/ReadingContainer';
import ReaderSidebar from '@/components/Reader/ReaderSidebar';
import ScrollChapterList from '@/components/Reader/ScrollChapterList';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CULTIVATION_TERMS = [
  'Thập Nhị Cảnh', 'Nguyên Anh', 'Kiếm Tiên', 'Luyện Khí', 'Trúc Cơ', 'Kim Đan', 
  'Hóa Thần', 'Luyện Thần', 'Tiên Cảnh', 'Thánh Nhân', 'Kiếm Khí', 'Linh Khí', 
  'Trảm Tiên', 'Phàm Nhân', 'Kiếm Khí Trường Hà', 'Phù Lục', 'Linh Trận'
];

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [theme, setTheme] = useState<'paper' | 'night' | 'bamboo'>('paper');
  const [fontSize, setFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [isNovel, setIsNovel] = useState(false);
  const [textContent, setTextContent] = useState<string>('');

  const lastScrollY = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const historySaved = useRef(false);
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
          const item = res.data.item;
          if (item.chapter_image && item.chapter_image.length > 0) {
            setImages(item.chapter_image);
            setImageDomain(res.data.domain_cdn || res.data.APP_DOMAIN_CDN_IMAGE);
            setChapterPath(item.chapter_path);
            setIsNovel(false);
          } else if (item.content) {
            setTextContent(item.content);
            setIsNovel(true);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChapter();
    historySaved.current = false;
    expRecorded.current = false;
    setLoadedImagesCount(0); 
  }, [apiUrl]);
  
  // 1. Record Reading History Immediately (Persistence/Navigation Fix)
  useEffect(() => {
    if (!user || !slug || !chapterName || !apiUrl || historySaved.current || !comicInfo) return;
    
    historySaved.current = true;
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
    .catch(err => console.error('History API error:', err));
  }, [user, slug, chapterName, apiUrl, comicInfo]);

  // 2. Grant EXP Reward (Reward - remains tied to full load)
  useEffect(() => {
    if (!user || !slug || expRecorded.current || images.length === 0) return;
    
    if (loadedImagesCount >= images.length) {
      expRecorded.current = true;
      api.post('/History', {
        comicSlug: slug,
        chapterName: chapterName,
        chapterApiData: apiUrl
      })
      .then(res => {
        if (res.data.expAdded > 0) {
          refreshUser();
        }
      })
      .catch(err => console.error('Reward API error:', err));
    }
  }, [user, images.length, loadedImagesCount, slug, chapterName, apiUrl, refreshUser]);

  const currentIndex = chapterList.findIndex(c => c.chapter_name === chapterName);
  
  const goToNext = () => {
    if (currentIndex > 0) {
      setIsTransitioning(true);
      const nextChapter = chapterList[currentIndex - 1];
      setTimeout(() => {
        router.push(`/doc-truyen/${slug}/${nextChapter.chapter_name}?api=${nextChapter.chapter_api_data}`);
        setIsTransitioning(false);
      }, 500);
    }
  };

  const goToPrev = () => {
    if (currentIndex < chapterList.length - 1) {
      setIsTransitioning(true);
      const prevChapter = chapterList[currentIndex + 1];
      setTimeout(() => {
        router.push(`/doc-truyen/${slug}/${prevChapter.chapter_name}?api=${prevChapter.chapter_api_data}`);
        setIsTransitioning(false);
      }, 500);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalHeight) * 100;
      setProgress(currentProgress);
      setIsScrolled(window.scrollY > 100);

      if (window.scrollY > lastScrollY.current + 10) {
        setShowControls(false);
        setIsChapterMenuOpen(false);
      } else if (window.scrollY < lastScrollY.current - 10) {
        setShowControls(true);
      }
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
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

  const highlightTerms = (text: string) => {
    let highlighted = text;
    CULTIVATION_TERMS.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlighted = highlighted.replace(regex, '<span class="cultivation-highlight">$1</span>');
    });
    return highlighted;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center pt-40 space-y-4">
           <div className="w-16 h-16 border-4 border-gold-ancient/10 border-t-gold-ancient rounded-full animate-spin"></div>
           <p className="text-xs font-black text-gold-dim uppercase tracking-widest animate-pulse">Đang triệu hồi linh ảnh...</p>
        </div>
      );
    }

    if (isNovel) {
      return (
        <div 
          style={{ fontSize: `${fontSize}px` }} 
          className={fontFamily === 'serif' ? 'font-serif' : 'font-sans'}
        >
          {textContent.split('\n').map((para, i) => {
            const trimmed = para.trim();
            if (!trimmed) return <br key={i} />;
            
            let content = trimmed;
            const isDialogue = trimmed.startsWith('「') || trimmed.startsWith('“') || trimmed.startsWith('"') || trimmed.startsWith('-');
            
            return (
              <p 
                key={i} 
                className={`mb-6 text-justify leading-relaxed ${isDialogue ? 'dialogue-line mb-8' : ''}`}
                dangerouslySetInnerHTML={{ 
                  __html: i === 0 ? `<span class="drop-cap">${content.charAt(0)}</span>${highlightTerms(content.slice(1))}` : highlightTerms(content)
                }}
              />
            );
          })}
        </div>
      );
    }

    return (
      <div className="flex flex-col chapter-reveal-container gap-0">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={`${imageDomain}/${chapterPath}/${img.image_file}`}
            alt={`Trang ${idx + 1}`}
            className="w-full h-auto object-contain select-none pointer-events-none opacity-0 translate-x-[20px] chapter-image-item"
            loading={idx < 3 ? "eager" : "lazy"}
            onLoad={(e) => {
              setLoadedImagesCount(prev => prev + 1);
              const target = e.target as HTMLImageElement;
              gsap.to(target, {
                translateX: 0,
                opacity: 1,
                duration: 0.6,
                delay: (idx % 10) * 0.06,
                ease: "power2.out"
              });
            }}
          />
        ))}
      </div>
    );
  };

  if (!mounted || isLoading || !user) {
    return (
      <div className="min-h-screen bg-paper-warm flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold-dim border-t-transparent rounded-full animate-spin opacity-50"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative transition-opacity duration-700 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      {/* Absolute Top Progress - Sword Qi */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-ink-deep/10 z-[100] pointer-events-none overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-gold-ancient via-white to-gold-ancient shadow-[0_0_15px_rgba(201,168,76,0.8)] transition-transform duration-150 origin-left"
          style={{ transform: `scaleX(${progress / 100})`, width: '100%' }}
        ></div>
      </div>

      <AmbientDust />
      
      <ReaderSidebar 
        fontSize={fontSize} setFontSize={setFontSize}
        theme={theme} setTheme={setTheme}
        fontFamily={fontFamily} setFontFamily={setFontFamily}
      />

      <ScrollChapterList 
        isOpen={isChapterMenuOpen}
        onClose={() => setIsChapterMenuOpen(false)}
        chapters={chapterList}
        currentChapter={chapterName}
        slug={slug}
        theme={theme}
      />

      {/* Top Simple Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showControls ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      } px-6 pt-4`}>
         <div className="flex items-center justify-between max-w-7xl mx-auto">
            <Link href={`/truyen-tranh/${slug}`} className="p-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-mist-gray hover:text-gold-ancient hover:bg-white/10 transition-all">
               <FaChevronLeft />
            </Link>
            <div className="flex items-center gap-3">
               <button 
                 onClick={() => setIsChapterMenuOpen(true)}
                 className="px-6 py-2 bg-ink-deep/80 backdrop-blur-md rounded-full border border-gold-dim/30 text-gold-ancient font-black text-xs font-[family-name:var(--font-heading)] uppercase tracking-[0.2em] hover:bg-ink-deep transition-all shadow-lg"
               >
                 Vạn Quyển Thư
               </button>
            </div>
            <Link href="/" className="p-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-mist-gray hover:text-gold-ancient hover:bg-white/10 transition-all">
               <FaHome />
            </Link>
         </div>
      </nav>

      <ReadingContainer 
        title={comicInfo?.name || slug} 
        chapterName={chapterName}
        theme={theme}
      >
        {renderContent()}
      </ReadingContainer>

      {/* Comment Section Extension */}
      <div className={`py-20 transition-colors duration-700 ${theme === 'night' ? 'bg-ink-black' : theme === 'bamboo' ? 'bg-[#eef1ec]' : 'bg-paper-aged'}`}>
        <div className="max-w-4xl mx-auto px-4">
          <CommentSection comicSlug={slug} chapterName={chapterName} />
        </div>
      </div>

      {/* Bottom Bronze Navigation */}
      <div className={`fixed bottom-0 left-0 right-0 z-[60] transition-all duration-500 pb-8 flex justify-center ${
        showControls ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
      }`}>
         <div className="flex items-center gap-6 p-1.5 bg-bronze-ancient/10 backdrop-blur-2xl rounded-full border-2 border-bronze-ancient/30 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
            
            <button 
              onClick={goToPrev}
              disabled={currentIndex === chapterList.length - 1}
              className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-bronze-ancient to-gold-dim text-white shadow-xl hover:scale-105 active:scale-95 disabled:grayscale disabled:opacity-50 transition-all"
            >
              <FaChevronLeft className="text-xl" />
            </button>

            <div className="px-6 text-center">
               <p className="text-[10px] font-black text-gold-ancient uppercase tracking-widest font-[family-name:var(--font-heading)]">Trang</p>
               <p className="text-lg font-black text-white font-[family-name:var(--font-heading)]">{Math.round(progress)}%</p>
            </div>

            <button 
              onClick={goToNext}
              disabled={currentIndex === 0}
              className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-bronze-ancient to-gold-dim text-white shadow-xl hover:scale-105 active:scale-95 disabled:grayscale disabled:opacity-50 transition-all"
            >
              <FaChevronLeft className="text-xl rotate-180" />
            </button>
         </div>
      </div>
    </div>
  );
}
