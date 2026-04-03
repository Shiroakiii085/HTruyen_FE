"use client";
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { comicService } from '@/services/comicService';
import Link from 'next/link';
import { FaShapes, FaArrowRight } from 'react-icons/fa';

export default function CategoriesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: comicService.getCategories,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        <div className="h-10 w-64 bg-surface-card rounded-xl mb-12 animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
            <div key={i} className="h-20 bg-surface-card rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const categories = data?.data?.items || [];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
      <div className="flex items-center space-x-3 mb-16">
        <div className="w-1.5 h-10 bg-accent rounded-full shadow-lg shadow-accent/50"></div>
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-text-main uppercase tracking-[0.2em] flex items-center gap-4">
            <FaShapes className="text-accent text-2xl md:text-4xl" /> Khám Phá Thể Loại
          </h1>
          <p className="text-[10px] md:text-xs text-text-dim font-black uppercase tracking-widest mt-2">{categories.length} THỂ LOẠI KHÁC NHAU</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((cat: any) => (
          <Link 
            key={cat.id || cat.slug}
            href={`/the-loai/${cat.slug}`}
            className="group relative h-24 sm:h-32 flex flex-col items-center justify-center bg-surface-card border border-white/5 rounded-3xl overflow-hidden shadow-premium hover:shadow-accent/20 hover:-translate-y-1 transition-all duration-300"
          >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 rounded-full transform translate-x-1/2 -translate-y-1/2 group-hover:scale-[3] transition-transform duration-700"></div>
            
            <div className="relative z-10 flex flex-col items-center space-y-2">
              <span className="text-xs sm:text-base font-black text-text-main group-hover:text-accent transition-colors uppercase tracking-widest text-center px-4 line-clamp-1">
                {cat.name}
              </span>
              <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                <FaArrowRight className="text-accent text-[10px]" />
              </div>
            </div>

            {/* Gloss Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
          </Link>
        ))}
      </div>

      <div className="mt-20 p-12 bg-surface-card/30 rounded-[3rem] border border-white/5 text-center space-y-6">
         <h2 className="text-xl font-black text-text-main uppercase tracking-widest">Không tìm thấy thể loại yêu thích?</h2>
         <p className="text-text-muted max-w-lg mx-auto">
           HTruyen liên tục cập nhật thêm nhiều đầu truyện và đa dạng hóa thể loại mỗi ngày để đáp ứng nhu cầu của mọi độc giả.
         </p>
         <div className="pt-4">
           <button className="glass px-8 py-3 rounded-2xl text-xs font-black text-accent uppercase tracking-widest">GỢI Ý THÊM THỂ LOẠI</button>
         </div>
      </div>
    </div>
  );
}
