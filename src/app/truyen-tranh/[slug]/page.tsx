"use client";
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { comicService } from '@/services/comicService';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaHeart, FaPlay, FaList, FaShareAlt, FaSearch, FaUserCircle, FaCalendarAlt, FaStar } from 'react-icons/fa';
import CommentSection from '@/components/Comic/CommentSection';

export default function ComicDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [searchChapter, setSearchChapter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['comic', slug],
    queryFn: () => comicService.getComicDetail(slug),
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 space-y-12 animate-pulse">
        <div className="h-[400px] bg-surface-card rounded-3xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-surface-card rounded-3xl"></div>
          <div className="h-64 bg-surface-card rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (!data || data.status !== 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="glass p-12 rounded-3xl space-y-4">
          <h2 className="text-2xl font-black text-white uppercase tracking-widest">Không tìm thấy truyện</h2>
          <Link href="/" className="inline-block bg-accent text-white px-8 py-3 rounded-2xl font-black hover:scale-105 transition-all">VỀ TRANG CHỦ</Link>
        </div>
      </div>
    );
  }

  const comic = data.data.item;
  const imageDomain = data.data.APP_DOMAIN_CDN_IMAGE;
  const chapters = comic.chapters?.[0]?.server_data || [];
  const thumbUrl = `${imageDomain}/uploads/comics/${comic.thumb_url}`;
  
  const firstChapter = chapters.length > 0 ? chapters[0] : null;
  const latestChapter = chapters.length > 0 ? chapters[chapters.length - 1] : null;

  const filteredChapters = chapters.filter((c: any) => 
    c.chapter_name.toLowerCase().includes(searchChapter.toLowerCase())
  ).reverse();

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
      
      {/* Immersive Hero Header (Ancient Scroll Theme) */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-paper-aged shadow-premium mb-12 border-2 border-gold-dim/20 pb-4">
        {/* Blurred Background with Paper Texture */}
        <div className="absolute inset-0 z-0 scale-110 blur-3xl opacity-20 sepia-[0.3]">
           <img src={thumbUrl} className="w-full h-full object-cover" alt="bg blur" />
        </div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-40 mix-blend-multiply z-0 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row p-8 md:p-12 gap-10 bg-gradient-to-t from-paper-warm via-paper-warm/80 to-transparent">
          {/* Cover Image */}
          <div className="relative w-56 h-80 md:w-72 md:h-[420px] shrink-0 mx-auto md:mx-0 rounded-[4px] overflow-hidden shadow-[0_10px_30px_rgba(26,20,16,0.5)] ring-4 ring-gold-dim/30 group">
            <img src={thumbUrl} alt={comic.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 sepia-[0.1]" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            {/* Scroll Border Trims */}
            <div className="absolute top-0 w-full h-2 bg-gradient-to-b from-ink-deep to-transparent opacity-50"></div>
            <div className="absolute bottom-0 w-full h-2 bg-gradient-to-t from-ink-deep to-transparent opacity-50"></div>
          </div>
          
          <div className="flex-1 flex flex-col justify-end space-y-6 text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm backdrop-blur-md shadow-sm font-[family-name:var(--font-heading)] ${comic.status === 'completed' ? 'bg-jade-green/10 text-jade-green border border-jade-green/30' : 'bg-blood-sect/10 text-blood-sect border border-blood-sect/30'}`}>
                {comic.status === 'completed' ? 'Ngọc Giản Hoàn Thành' : 'Đang Cập Nhật'}
              </span>
              {comic.category.slice(0, 4).map((cat: any) => (
                <Link key={cat.id} href={`/the-loai/${cat.slug}`} className="px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm bg-paper-warm text-ink-deep border border-gold-dim/20 hover:bg-gold-ancient/20 hover:text-blood-sect hover:border-blood-sect/30 transition-all font-[family-name:var(--font-heading)] shadow-sm">
                  {cat.name}
                </Link>
              ))}
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black text-ink-black leading-tight drop-shadow-md font-[family-name:var(--font-heading)]">{comic.name}</h1>
              <p className="text-mist-gray font-bold text-sm md:text-base tracking-widest uppercase opacity-80 border-l-2 border-gold-dim/30 pl-3">
                {comic.origin_name?.join(' • ') || 'Kiếm Lai Các Original'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
              {firstChapter && (
                <Link 
                  href={`/doc-truyen/${slug}/${firstChapter.chapter_name}?api=${encodeURIComponent(firstChapter.chapter_api_data)}`} 
                  className="w-full sm:w-auto flex justify-center items-center gap-3 bg-blood-sect hover:bg-blood-sect/80 text-paper-warm px-10 py-5 rounded-md font-black transition-all hover:scale-105 shadow-[0_5px_15px_rgba(139,32,32,0.3)] tracking-widest font-[family-name:var(--font-heading)] border border-blood-sect/50"
                >
                  <FaPlay className="text-xs" /> KHAI TÔNG
                </Link>
              )}
              <button 
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`w-full sm:w-auto flex justify-center items-center gap-3 px-8 py-5 rounded-md font-black transition-all border shadow-sm font-[family-name:var(--font-heading)] tracking-widest ${isBookmarked ? 'bg-jade-green/10 border-jade-green/30 text-jade-green' : 'bg-paper-warm border-gold-dim/30 text-ink-deep hover:bg-gold-ancient/10'}`}
              >
                <FaHeart className={isBookmarked ? 'fill-current' : ''} /> {isBookmarked ? 'ĐÃ LƯU NGỌC GIẢN' : 'TÀNG THƯ'}
              </button>
              <button className="hidden sm:flex items-center justify-center w-14 h-14 rounded-md bg-paper-warm border border-gold-dim/30 text-ink-deep hover:text-blood-sect hover:bg-gold-ancient/10 transition-all shadow-sm">
                <FaShareAlt />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Summary & Chapters */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Summary Section */}
          <section className="bg-paper-warm/80 rounded-[2rem] p-8 border border-gold-dim/20 backdrop-blur-sm shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] bg-gold-ancient/5 rounded-bl-full pointer-events-none"></div>
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-8 h-8 rounded-full bg-gold-ancient/20 flex items-center justify-center border border-gold-dim/30">
                <div className="w-2 h-2 bg-blood-sect rounded-full animate-pulse"></div>
              </div>
              <h2 className="text-2xl font-black text-ink-black tracking-widest font-[family-name:var(--font-heading)]">Khảo Bản</h2>
            </div>
            <div 
              className="text-ink-deep leading-relaxed text-base font-medium prose prose-invert opacity-90 first-letter:text-5xl first-letter:font-[family-name:var(--font-heading)] first-letter:text-blood-sect first-letter:mr-1 first-letter:float-left" 
              dangerouslySetInnerHTML={{ __html: comic.content }} 
            />
          </section>

          {/* Chapter List Section */}
          <section className="bg-paper-warm/80 rounded-[2rem] p-8 border border-gold-dim/20 backdrop-blur-sm shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 border-b border-gold-dim/10 pb-6">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-heaven-blue/10 flex items-center justify-center border border-heaven-blue/30">
                  <FaList className="text-heaven-blue text-xs" />
                </div>
                <h2 className="text-2xl font-black text-ink-black tracking-widest flex items-center gap-3 font-[family-name:var(--font-heading)]">
                  Mục Lục Truyện
                </h2>
                <span className="bg-paper-aged px-3 py-1 rounded-[4px] text-[10px] font-black text-ink-deep border border-gold-dim/20 shadow-inner">{chapters.length}</span>
              </div>
              
              <div className="relative w-full sm:w-64">
                <input 
                  type="text" 
                  placeholder="Tìm kiếm..." 
                  value={searchChapter}
                  onChange={(e) => setSearchChapter(e.target.value)}
                  className="w-full bg-paper-aged border border-gold-dim/30 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blood-sect/30 text-ink-black placeholder:text-mist-gray font-[family-name:var(--font-heading)]"
                />
                <FaSearch className="absolute left-3.5 top-3.5 text-mist-gray" size={12} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredChapters.length > 0 ? filteredChapters.map((chap: any, index: number) => (
                <Link 
                  key={`${chap.chapter_name}-${index}`}
                  href={`/doc-truyen/${slug}/${chap.chapter_name}?api=${encodeURIComponent(chap.chapter_api_data)}`}
                  className="group flex justify-between items-center bg-paper-aged hover:bg-gold-ancient/10 border border-gold-dim/10 hover:border-gold-dim/40 rounded-[2px] px-6 py-5 transition-all duration-300 shadow-sm relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-ancient/0 group-hover:bg-blood-sect transition-colors"></div>
                  <div className="flex flex-col ml-2">
                    <span className="font-black text-ink-deep group-hover:text-blood-sect transition-colors font-[family-name:var(--font-heading)] text-lg">Chương {chap.chapter_name}</span>
                    <span className="text-[9px] text-mist-gray font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">Tiến vào</span>
                  </div>
                  <FaPlay className="text-gold-dim group-hover:text-blood-sect transition-colors scale-75" />
                </Link>
              )) : (
                <div className="col-span-full py-12 text-center text-mist-gray font-bold animate-pulse uppercase tracking-[0.2em] font-[family-name:var(--font-heading)] text-xl">Chưa có thông tin tầng lầu</div>
              )}
            </div>
          </section>

          {/* Comment Section */}
          <CommentSection comicSlug={slug} />
        </div>

        {/* Right Column: Metadata & Extra Info */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-paper-warm/80 rounded-[2rem] p-8 border border-gold-dim/20 sticky top-28 shadow-sm relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] bg-gold-ancient/5 rounded-bl-full pointer-events-none"></div>
            <h3 className="text-xl font-black text-ink-black uppercase tracking-[0.2em] mb-8 border-b-2 border-gold-dim/10 pb-4 font-[family-name:var(--font-heading)]">Hồ Sơ Cổ Tịch</h3>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4 group">
                <div className="w-10 h-10 rounded-[4px] bg-paper-aged flex items-center justify-center shrink-0 border border-gold-dim/30 shadow-inner group-hover:bg-gold-ancient/10 transition-colors">
                  <FaUserCircle className="text-gold-dim" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-mist-gray uppercase tracking-[0.2em] mb-1">Tu sĩ ghi chép</p>
                  <p className="text-ink-black font-bold font-[family-name:var(--font-heading)] text-lg">{comic.author?.[0] || 'Vô Danh'}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="w-10 h-10 rounded-[4px] bg-paper-aged flex items-center justify-center shrink-0 border border-gold-dim/30 shadow-inner group-hover:bg-gold-ancient/10 transition-colors">
                   <FaCalendarAlt className="text-gold-dim" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-mist-gray uppercase tracking-[0.2em] mb-1">Tinh tượng cuối</p>
                  <p className="text-ink-deep font-bold italic">{new Date(comic.updatedAt).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="w-10 h-10 rounded-[4px] bg-paper-aged flex items-center justify-center shrink-0 border border-gold-dim/30 shadow-inner group-hover:bg-gold-ancient/10 transition-colors">
                   <FaStar className="text-blood-sect" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-mist-gray uppercase tracking-[0.2em] mb-1">Cảnh Giới</p>
                  <p className="text-ink-black font-bold uppercase tracking-widest font-[family-name:var(--font-heading)] text-lg">{comic.status === 'completed' ? 'Viên Mãn' : 'Đang Tụ Khí'}</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gold-dim/10">
               <button className="w-full bg-paper-aged hover:bg-blood-sect/10 text-blood-sect py-4 rounded-md font-black text-sm transition-all border border-blood-sect/30 font-[family-name:var(--font-heading)] tracking-widest uppercase">
                 Báo Cáo Tà Ma (Lỗi)
               </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
