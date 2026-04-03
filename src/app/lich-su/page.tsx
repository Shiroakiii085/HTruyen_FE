"use client";
import React, { useEffect, useState } from 'react';
import { historyService, ReadingHistory } from '@/services/historyService';
import { FaTrash, FaBookOpen, FaClock, FaCalendarAlt, FaChevronRight, FaHistory } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const [histories, setHistories] = useState<ReadingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const loadHistory = async () => {
      setLoading(true);
      const data = await historyService.getHistories();
      setHistories(data);
      setLoading(false);
    };

    loadHistory();
  }, [user]);

  const handleDelete = async (slug: string) => {
    try {
      await historyService.deleteHistory(slug);
      setHistories(prev => prev.filter(h => h.comicSlug !== slug));
    } catch (err) {
      console.error('Failed to delete history:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-primary-bg space-y-6">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="text-text-dim font-black uppercase tracking-[0.3em] animate-pulse">Đang tải lịch sử...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg pb-20 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-accent mb-2">
              <FaHistory size={20} />
              <span className="text-xs font-black uppercase tracking-[0.3em]">Cá nhân</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
              TRUYỆN ĐÃ <span className="text-accent underline decoration-accent/30 underline-offset-8">ĐỌC</span>
            </h1>
            <p className="text-text-dim font-medium max-w-md">Lịch sử hành trình tu luyện và khám phá các thế giới của bạn.</p>
          </div>
          
          <div className="glass px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-4">
             <div className="text-right">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Tổng cộng</p>
                <p className="text-xl font-black text-white leading-none">{histories.length} Truyện</p>
             </div>
             <div className="w-px h-8 bg-white/10"></div>
             <FaBookOpen className="text-accent" size={24} />
          </div>
        </div>

        {histories.length === 0 ? (
          <div className="glass rounded-[3rem] p-16 text-center border border-white/5 space-y-8 max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto ring-1 ring-white/10">
              <FaBookOpen className="text-text-dim" size={40} />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-white">CHƯA CÓ LỊCH SỬ</h3>
              <p className="text-text-dim font-medium">Bắt đầu khám phá những bộ truyện hấp dẫn ngay hôm nay để lưu lại hành trình của bạn.</p>
            </div>
            <Link href="/" className="inline-block bg-accent text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-accent/20 hover:scale-105 transition-all">
              KHÁM PHÁ NGAY
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {histories.map((item) => (
              <div 
                key={item.id} 
                className="group relative bg-surface-bg rounded-[2rem] overflow-hidden border border-white/5 hover:border-accent/30 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5 hover:-translate-y-2 flex flex-col"
              >
                {/* Image Section */}
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img 
                    src={item.thumbUrl} 
                    alt={item.comicName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-bg via-transparent to-transparent opacity-60"></div>
                  
                  {/* Actions Overlay */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <button 
                      onClick={() => handleDelete(item.comicSlug)}
                      className="p-3 bg-red-500/90 hover:bg-red-500 text-white rounded-xl shadow-lg backdrop-blur-md transition-all hover:scale-110"
                      title="Xóa khỏi lịch sử"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>

                  {/* Last read chapter overlay */}
                  <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    <div className="glass-bright py-2.5 px-4 rounded-xl flex items-center justify-between border border-white/10 group-hover:border-accent/40">
                       <span className="text-[10px] font-black text-white truncate max-w-[120px]">Chương {item.chapterName}</span>
                       <FaChevronRight className="text-accent group-hover:translate-x-1 transition-transform" size={10} />
                    </div>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-6 flex flex-col flex-1 gap-3">
                  <Link href={`/truyen-tranh/${item.comicSlug}`} className="block">
                    <h3 className="text-lg font-black text-white hover:text-accent transition-colors line-clamp-2 leading-tight uppercase tracking-tight">
                      {item.comicName}
                    </h3>
                  </Link>
                  
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-text-dim">
                      <FaClock size={10} className="text-accent/60" />
                      <span className="text-[10px] font-bold uppercase tracking-tighter truncate">
                        {formatDate(item.readAt)}
                      </span>
                    </div>
                    <Link 
                      href={`/doc-truyen/${item.comicSlug}/${item.chapterName}?api=${encodeURIComponent(item.chapterApiData)}`}
                      className="text-xs font-black text-accent hover:text-white transition-colors flex items-center gap-1 group/link"
                    >
                      TIẾP TỤC <FaChevronRight size={8} className="group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
