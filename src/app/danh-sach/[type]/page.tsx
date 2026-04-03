"use client";
import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { comicService } from '@/services/comicService';
import StoryCard, { ComicItem } from '@/components/Story/StoryCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';

export default function ComicList() {
  const params = useParams();
  const searchParams = useSearchParams();
  const type = params.type as string;
  const page = parseInt(searchParams.get('page') || '1');

  const { data, isLoading, error } = useQuery({
    queryKey: ['list', type, page],
    queryFn: () => comicService.getList(type, page),
  });

  const getPageTitle = (type: string) => {
    switch (type) {
      case 'truyen-moi': return 'Mới Cập Nhật';
      case 'truyen-hot': return 'Truyện Hot';
      case 'hoan-thanh': return 'Đã Hoàn Thành';
      case 'sap-ra-mat': return 'Sắp Ra Mắt';
      default: return 'Danh Sách Truyện';
    }
  };

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
            <h2 className="text-xl font-black text-text-main">Không Thể Tải Dữ Liệu</h2>
            <p className="text-text-muted">Chúng tôi gặp sự cố khi lấy danh sách truyện cho mục này.</p>
            <Link href="/" className="block bg-accent px-8 py-3 rounded-2xl font-black text-white hover:scale-105 transition-all">VỀ TRANG CHỦ</Link>
          </div>
       </div>
    );
  }

  const { items, APP_DOMAIN_CDN_IMAGE, params: apiParams } = data.data;
  const totalItems = apiParams.pagination.totalItems;
  const totalPages = Math.ceil(totalItems / apiParams.pagination.totalItemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex items-center space-x-3">
          <div className="w-1.5 h-10 bg-accent rounded-full shadow-lg shadow-accent/50"></div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-text-main uppercase tracking-[0.2em]">{getPageTitle(type)}</h1>
            <p className="text-[10px] md:text-xs text-text-dim font-black uppercase tracking-widest mt-2">{totalItems.toLocaleString()} TRUYỆN ĐƯỢC TÌM THẤY</p>
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
                href={`/danh-sach/${type}?page=${page - 1}`}
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
                href={`/danh-sach/${type}?page=${page + 1}`}
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
          <p className="text-[10px] text-text-dim font-bold uppercase tracking-[0.2em] animate-pulse">Khám phá nội dung đỉnh cao cùng HTruyen</p>
        </div>
      )}
    </div>
  );
}
