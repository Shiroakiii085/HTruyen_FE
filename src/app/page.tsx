"use client";
import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { comicService } from '@/services/comicService';
import StoryCard, { ComicItem } from '@/components/Story/StoryCard';
import { FaBolt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Home() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || '1');

  const { data, isLoading, error } = useQuery({
    queryKey: ['homeComicsLatest', page],
    queryFn: () => comicService.getList('truyen-moi', page),
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        <div className="h-10 w-72 bg-surface-card rounded-xl mb-12 animate-pulse"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
            <div key={i} className="aspect-[2/3.2] bg-surface-card rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data || data.status !== 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="glass p-12 rounded-3xl space-y-6 max-w-md">
          <div className="w-20 h-20 bg-red-400/10 rounded-full flex items-center justify-center mx-auto">
            <FaBolt className="text-red-400 text-3xl" />
          </div>
          <h2 className="text-2xl font-black text-text-main uppercase tracking-widest">Mất kết nối</h2>
          <p className="text-text-muted text-sm font-medium">Chúng tôi không thể lấy dữ liệu từ máy chủ. Vui lòng kiểm tra lại đường truyền của bạn.</p>
          <button onClick={() => window.location.reload()} className="bg-accent text-white px-8 py-3 rounded-2xl font-black hover:scale-105 transition-all">THỬ LẠI</button>
        </div>
      </div>
    );
  }

  const items: ComicItem[] = Array.isArray(data?.data?.items) ? data.data.items : [];
  const APP_DOMAIN_CDN_IMAGE = data?.data?.APP_DOMAIN_CDN_IMAGE || '';
  const pagination = data?.data?.params?.pagination;
  const totalItems = pagination?.totalItems || 0;
  const totalPages = pagination?.totalItemsPerPage
    ? Math.ceil(totalItems / pagination.totalItemsPerPage)
    : 1;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex items-center space-x-3">
          <div className="w-1.5 h-10 bg-accent rounded-full shadow-lg shadow-accent/50"></div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-text-main uppercase tracking-[0.2em]">Tất Cả Truyện</h1>
            <p className="text-[10px] md:text-xs text-text-dim font-black uppercase tracking-widest mt-2">Sắp xếp theo truyện mới cập nhật</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
          <FaBolt className="text-accent" />
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{totalItems.toLocaleString()} truyện</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
        {items.map((comic: ComicItem, index: number) => (
          <StoryCard key={`${comic._id}-${index}`} comic={comic} imageDomain={APP_DOMAIN_CDN_IMAGE} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-16 flex flex-col items-center space-y-6">
          <div className="flex items-center space-x-4">
            {page > 1 ? (
              <Link href={`/?page=${page - 1}`} className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 text-text-main transition-all border border-white/5">
                <FaChevronLeft />
              </Link>
            ) : (
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 opacity-20 text-text-muted border border-white/5 cursor-not-allowed">
                <FaChevronLeft />
              </div>
            )}

            <div className="glass px-10 py-4 rounded-2xl flex flex-col items-center">
              <span className="text-[10px] font-black text-text-dim uppercase tracking-[0.3em] mb-1">Trang</span>
              <span className="text-lg font-black text-accent tracking-widest">{page} / {totalPages}</span>
            </div>

            {page < totalPages ? (
              <Link href={`/?page=${page + 1}`} className="w-14 h-14 flex items-center justify-center rounded-2xl bg-accent text-white shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all border border-accent/20">
                <FaChevronRight />
              </Link>
            ) : (
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 opacity-20 text-text-muted border border-white/5 cursor-not-allowed">
                <FaChevronRight />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
