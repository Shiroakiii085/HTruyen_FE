"use client";
import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { comicService } from '@/services/comicService';
import StoryCard, { ComicItem } from '@/components/Story/StoryCard';
import { FaChevronLeft, FaChevronRight, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function CategoryDetail() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const page = parseInt(searchParams.get('page') || '1');

  const { data, isLoading, error } = useQuery({
    queryKey: ['category', slug, page],
    queryFn: () => comicService.getCategoryDetail(slug, page),
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        <div className="h-10 w-64 bg-surface-card rounded-xl mb-12 animate-pulse"></div>
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
       <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-primary-bg">
          <div className="glass p-12 rounded-3xl space-y-6 max-w-sm">
            <h2 className="text-xl font-black text-text-main uppercase tracking-widest">Không Thể Tải Thể Loại</h2>
            <p className="text-text-muted">Chúng tôi gặp sự cố khi lấy danh sách truyện cho thể loại này.</p>
            <Link href="/the-loai" className="block bg-accent px-8 py-3 rounded-2xl font-black text-white hover:scale-105 transition-all uppercase tracking-widest">QUAY LẠI THỂ LOẠI</Link>
          </div>
       </div>
    );
  }

  const { items, APP_DOMAIN_CDN_IMAGE, params: apiParams, titlePage } = data.data;
  const totalItems = apiParams.pagination.totalItems;
  const totalPages = Math.ceil(totalItems / apiParams.pagination.totalItemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 animate-in fade-in duration-1000">
      
      {/* Dynamic Header */}
      <div className="flex flex-col space-y-6 mb-16">
        <Link href="/the-loai" className="flex items-center space-x-2 text-text-muted hover:text-accent font-black text-[10px] uppercase tracking-widest transition-all">
          <FaArrowLeft /> <span>QUAY LẠI THỂ LOẠI</span>
        </Link>
        <div className="flex items-center space-x-3">
          <div className="w-1.5 h-10 bg-accent rounded-full shadow-lg shadow-accent/50"></div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-text-main uppercase tracking-[0.2em]">{titlePage || 'Thể Loại'}</h1>
            <p className="text-[10px] md:text-xs text-text-dim font-black uppercase tracking-widest mt-2">KHÁM PHÁ CÁC ĐẦU TRUYỆN ĐỈNH CAO</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
        {items.map((comic: ComicItem, index: number) => (
          <StoryCard key={`${comic._id}-${index}`} comic={comic} imageDomain={APP_DOMAIN_CDN_IMAGE} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-16 flex flex-col items-center space-y-6">
          <div className="flex items-center space-x-4">
            {page > 1 ? (
              <Link 
                href={`/the-loai/${slug}?page=${page - 1}`}
                className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 text-text-main transition-all border border-white/5"
              >
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
              <Link 
                href={`/the-loai/${slug}?page=${page + 1}`}
                className="w-14 h-14 flex items-center justify-center rounded-2xl bg-accent text-white shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all border border-accent/20"
              >
                <FaChevronRight />
              </Link>
            ) : (
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 opacity-20 text-text-muted border border-white/5 cursor-not-allowed">
                <FaChevronRight />
              </div>
            )}
          </div>
          <p className="text-[10px] text-text-dim font-bold uppercase tracking-[0.2em] animate-bounce">Cuộn xuống để khám phá thêm nữa</p>
        </div>
      )}
    </div>
  );
}
