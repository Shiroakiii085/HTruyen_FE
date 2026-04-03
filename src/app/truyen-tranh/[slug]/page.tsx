"use client";
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { comicService } from '@/services/comicService';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaHeart, FaPlay, FaList, FaShareAlt, FaSearch, FaUserCircle, FaCalendarAlt, FaStar } from 'react-icons/fa';

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
      
      {/* Immersive Hero Header */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-surface-bg shadow-premium mb-12 border border-white/5">
        {/* Blurred Background */}
        <div className="absolute inset-0 z-0 scale-110 blur-3xl opacity-30">
           <img src={thumbUrl} className="w-full h-full object-cover" alt="bg blur" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row p-8 md:p-12 gap-10 bg-gradient-to-t from-primary-bg via-primary-bg/70 to-transparent">
          {/* Cover Image */}
          <div className="relative w-56 h-80 md:w-72 md:h-[420px] shrink-0 mx-auto md:mx-0 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 group">
            <img src={thumbUrl} alt={comic.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          
          <div className="flex-1 flex flex-col justify-end space-y-6 text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl backdrop-blur-md ${comic.status === 'completed' ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' : 'bg-accent/10 text-accent border border-accent/20'}`}>
                {comic.status === 'completed' ? 'Đã hoàn thành' : 'Đang ra mắt'}
              </span>
              {comic.category.slice(0, 4).map((cat: any) => (
                <Link key={cat.id} href={`/the-loai/${cat.slug}`} className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl bg-white/5 text-text-dim border border-white/5 hover:bg-accent hover:text-white hover:border-accent transition-all">
                  {cat.name}
                </Link>
              ))}
            </div>
            
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-black text-text-main leading-tight drop-shadow-lg">{comic.name}</h1>
              <p className="text-text-dim font-bold text-sm md:text-base tracking-wide uppercase opacity-70">
                {comic.origin_name?.join(' • ') || 'HTruyen Original'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              {firstChapter && (
                <Link 
                  href={`/doc-truyen/${slug}/${firstChapter.chapter_name}?api=${encodeURIComponent(firstChapter.chapter_api_data)}`} 
                  className="w-full sm:w-auto flex justify-center items-center gap-3 bg-accent hover:bg-indigo-500 text-white px-10 py-5 rounded-2xl font-black transition-all hover:scale-105 hover:shadow-xl hover:shadow-accent/30 tracking-widest"
                >
                  <FaPlay className="text-xs" /> ĐỌC TỪ ĐẦU
                </Link>
              )}
              <button 
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`w-full sm:w-auto flex justify-center items-center gap-3 px-8 py-5 rounded-2xl font-black transition-all border-2 ${isBookmarked ? 'bg-emerald-400/10 border-emerald-400/30 text-emerald-400' : 'bg-white/5 border-white/5 text-text-main hover:bg-white/10'}`}
              >
                <FaHeart className={isBookmarked ? 'fill-current' : ''} /> {isBookmarked ? 'ĐÃ LƯU' : 'LƯU TRUYỆN'}
              </button>
              <button className="hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/5 text-text-dim hover:text-text-main hover:bg-white/10 transition-all">
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
          <section className="bg-surface-card/50 rounded-3xl p-8 border border-white/5 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-1.5 h-6 bg-accent rounded-full"></div>
              <h2 className="text-xl font-black text-text-main uppercase tracking-widest">Nội Dung Truyện</h2>
            </div>
            <div 
              className="text-text-muted leading-relaxed text-base font-medium prose prose-invert max-w-none opacity-90" 
              dangerouslySetInnerHTML={{ __html: comic.content }} 
            />
          </section>

          {/* Chapter List Section */}
          <section className="bg-surface-card/50 rounded-3xl p-8 border border-white/5 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
              <div className="flex items-center space-x-3">
                <div className="w-1.5 h-6 bg-accent rounded-full"></div>
                <h2 className="text-xl font-black text-text-main uppercase tracking-widest flex items-center gap-3">
                  <FaList className="text-accent text-sm" /> Danh Sách Chương
                </h2>
                <span className="glass px-3 py-1 rounded-lg text-[10px] font-black text-text-dim">{chapters.length}</span>
              </div>
              
              <div className="relative w-full sm:w-64">
                <input 
                  type="text" 
                  placeholder="Tìm chương..." 
                  value={searchChapter}
                  onChange={(e) => setSearchChapter(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 text-text-main"
                />
                <FaSearch className="absolute left-3.5 top-3.5 text-text-dim" size={12} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredChapters.length > 0 ? filteredChapters.map((chap: any, index: number) => (
                <Link 
                  key={`${chap.chapter_name}-${index}`}
                  href={`/doc-truyen/${slug}/${chap.chapter_name}?api=${encodeURIComponent(chap.chapter_api_data)}`}
                  className="group flex justify-between items-center bg-white/5 hover:bg-accent/10 border border-white/5 hover:border-accent/30 rounded-2xl px-6 py-5 transition-all duration-300"
                >
                  <div className="flex flex-col">
                    <span className="font-black text-text-main group-hover:text-accent transition-colors">Chương {chap.chapter_name}</span>
                    <span className="text-[10px] text-text-dim font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Khám phá ngay</span>
                  </div>
                  <FaPlay className="text-text-dim group-hover:text-accent transition-colors scale-75" />
                </Link>
              )) : (
                <div className="col-span-full py-12 text-center text-text-dim font-bold animate-pulse uppercase tracking-[0.2em]">Không tìm thấy chương nào</div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Metadata & Extra Info */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-surface-card rounded-3xl p-8 border border-white/5 sticky top-28 shadow-premium">
            <h3 className="text-sm font-black text-text-dim uppercase tracking-[0.2em] mb-8 border-b border-white/5 pb-4">Thông Tin Chi Tiết</h3>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                  <FaUserCircle className="text-text-muted" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-text-dim uppercase tracking-tighter mb-1">Tác giả</p>
                  <p className="text-text-main font-bold">{comic.author?.[0] || 'Đang cập nhật'}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                   <FaCalendarAlt className="text-text-muted" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-text-dim uppercase tracking-tighter mb-1">Cập nhật cuối</p>
                  <p className="text-text-main font-bold">{new Date(comic.updatedAt).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                   <FaStar className="text-accent" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-text-dim uppercase tracking-tighter mb-1">Tình trạng</p>
                  <p className="text-text-main font-bold uppercase tracking-wide">{comic.status === 'completed' ? 'Hoàn thành' : 'Đang ra mắt'}</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5">
               <button className="w-full bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-black text-sm transition-all border border-white/5">
                 BÁO LỖI TRUYỆN
               </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
