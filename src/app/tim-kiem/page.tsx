"use client";
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { comicService } from '@/services/comicService';
import StoryCard, { ComicItem } from '@/components/Story/StoryCard';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';

function SearchResults() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', keyword, page],
    queryFn: () => comicService.search(keyword, page),
    enabled: !!keyword,
  });

  if (!keyword) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-6 bg-surface-card/30 rounded-3xl border border-white/5">
        <FaSearch className="text-4xl text-text-dim mb-4" />
        <h2 className="text-xl font-black text-text-main uppercase tracking-widest">Gõ gì đó để tìm kiếm</h2>
        <p className="text-text-muted mt-2">Nhập tên truyện, tác giả hoặc thể loại vào thanh tìm kiếm ở trên.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
          <div key={i} className="aspect-[2/3.2] bg-surface-card rounded-2xl"></div>
        ))}
      </div>
    );
  }

  if (error || !data || data.status !== 'success') {
    return (
      <div className="text-center py-20 bg-surface-card/30 rounded-3xl border border-white/5">
        <p className="text-red-400 font-bold">Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  const { items, APP_DOMAIN_CDN_IMAGE, params } = data.data;
  const totalPages = Math.ceil(params.pagination.totalItems / params.pagination.totalItemsPerPage);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-6 bg-surface-card/30 rounded-3xl border border-white/5">
        <h2 className="text-xl font-black text-text-main uppercase tracking-widest">Không tìm thấy kết quả</h2>
        <p className="text-text-muted mt-2">Chúng tôi không tìm thấy truyện nào với từ khóa "{keyword}".</p>
        <Link href="/" className="mt-6 text-accent font-black hover:underline tracking-widest">QUAY LẠI TRANG CHỦ</Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
        {items.map((comic: ComicItem, index: number) => (
          <StoryCard key={`${comic._id}-${index}`} comic={comic} imageDomain={APP_DOMAIN_CDN_IMAGE} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 pt-8">
          {page > 1 && (
            <Link 
              href={`/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page - 1}`}
              className="p-4 rounded-xl bg-white/5 hover:bg-white/10 text-text-main transition-all"
            >
              <FaChevronLeft />
            </Link>
          )}
          <span className="glass px-6 py-2.5 rounded-xl font-black text-accent text-sm tracking-widest">
            TRANG {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link 
              href={`/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page + 1}`}
              className="p-4 rounded-xl bg-white/5 hover:bg-white/10 text-text-main transition-all"
            >
              <FaChevronRight />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
      <div className="flex items-center space-x-3 mb-12">
        <div className="w-1.5 h-8 bg-accent rounded-full shadow-lg shadow-accent/50"></div>
        <h1 className="text-2xl md:text-4xl font-black text-text-main uppercase tracking-[0.2em]">Kết Quả Tìm Kiếm</h1>
      </div>

      <Suspense fallback={<div className="animate-pulse h-96 bg-surface-card rounded-3xl"></div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
