"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { adminService, FeaturedComicConfig, FeaturedComicItem, MostReadStatistic, ReaderCounts } from '@/services/adminService';
import { FaChartLine, FaFire, FaHistory, FaCalendarAlt, FaCalendarCheck, FaCalendarPlus, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [mostRead, setMostRead] = useState<MostReadStatistic[]>([]);
  const [readerCounts, setReaderCounts] = useState<ReaderCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'day' | 'month' | 'year'>('day');
  const [featured, setFeatured] = useState<FeaturedComicConfig | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<FeaturedComicItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    if (!user || user.role?.toLowerCase() !== 'admin') {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [mostReadData, readerData, featuredData] = await Promise.all([
          adminService.getMostReadStatistics(),
          adminService.getReaderCounts(),
          adminService.getFeaturedComic()
        ]);
        setMostRead(mostReadData);
        setReaderCounts(readerData);
        setFeatured(featuredData);
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [user, router]);

  const getFullThumbUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `https://img.otruyenapi.com/uploads/comics/${url}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-primary-bg space-y-6">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="text-text-dim font-black uppercase tracking-[0.3em] animate-pulse">Đang tải dữ liệu quản trị...</p>
      </div>
    );
  }

  const currentStats = readerCounts ? (activeTab === 'day' ? readerCounts.daily : activeTab === 'month' ? readerCounts.monthly : readerCounts.yearly) : [];
  const maxCount = Math.max(...currentStats.map(s => s.count), 1);

  const handleSearch = async () => {
    if (!searchKeyword.trim()) return;
    setSearching(true);
    try {
      const items = await adminService.searchComicsForFeatured(searchKeyword.trim());
      setSearchResults(items);
    } catch (err) {
      console.error('Search featured comics error:', err);
    } finally {
      setSearching(false);
    }
  };

  const saveFeaturedComic = async (item: FeaturedComicItem) => {
    await adminService.setFeaturedComic({
      comicSlug: item.slug,
      comicName: item.name,
      thumbUrl: item.thumb_url
    });
    setFeatured({
      comicSlug: item.slug,
      comicName: item.name,
      thumbUrl: item.thumb_url
    });
    setSavedMessage('Đã lưu truyện đề cử.');
    setTimeout(() => setSavedMessage(''), 2500);
  };

  return (
    <div className="min-h-screen bg-primary-bg pb-20 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <Link href="/profile" className="flex items-center gap-2 text-text-dim hover:text-white transition-colors mb-4 group w-fit">
               <FaArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
               <span className="text-xs font-bold uppercase tracking-widest">Quay lại hồ sơ</span>
            </Link>
            <div className="flex items-center gap-3 text-accent mb-2">
              <FaChartLine size={24} />
              <span className="text-sm font-black uppercase tracking-[0.3em]">Hệ thống quản trị</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">
              BẢNG <span className="text-accent underline decoration-accent/30 underline-offset-8">THỐNG KÊ</span>
            </h1>
            <p className="text-text-dim font-medium max-w-xl">Theo dõi hiệu suất đọc truyện và tăng trưởng của cộng đồng HTruyen.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Reader Growth Chart Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-[2.5rem] p-8 border border-white/5 shadow-2xl space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
                    <FaCalendarAlt size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Lượng người đọc</h3>
                    <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest">Phân tích theo thời gian</p>
                  </div>
                </div>

                <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
                  {(['day', 'month', 'year'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        activeTab === tab ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-text-dim hover:text-white'
                      }`}
                    >
                      {tab === 'day' ? 'Ngày' : tab === 'month' ? 'Tháng' : 'Năm'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bar Chart Container */}
              <div className="relative h-64 flex items-end gap-2 sm:gap-4 px-2 mt-8">
                {currentStats.length > 0 ? (
                  currentStats.map((stat, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                      <div 
                        className="w-full bg-gradient-to-t from-accent/40 to-accent rounded-t-lg transition-all duration-1000 ease-out group-hover:brightness-125 group-hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]"
                        style={{ height: `${(stat.count / maxCount) * 100}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-card px-2 py-1 rounded text-[10px] font-black text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                          {stat.count}
                        </div>
                      </div>
                      <span className="absolute -bottom-8 text-[8px] font-black text-text-dim uppercase tracking-tighter whitespace-nowrap rotate-45 sm:rotate-0 origin-left">
                        {activeTab === 'day' ? stat.label.slice(5) : stat.label}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="w-full h-full flex items-center justify-center border border-dashed border-white/10 rounded-2xl">
                    <span className="text-text-dim text-[10px] font-black uppercase tracking-[0.2em]">Chưa có dữ liệu thống kê</span>
                  </div>
                )}
              </div>
              <div className="h-8"></div> {/* Spacer for rotated labels */}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
               {[
                 { title: 'Hôm nay', icon: <FaCalendarPlus />, value: readerCounts?.daily.slice(-1)[0]?.count || 0, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                 { title: 'Tháng này', icon: <FaCalendarCheck />, value: readerCounts?.monthly.slice(-1)[0]?.count || 0, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
                 { title: 'Tổng cộng', icon: <FaFire />, value: readerCounts?.yearly.reduce((acc, s) => acc + s.count, 0) || 0, color: 'text-accent', bg: 'bg-accent/10' },
               ].map((stat, i) => (
                 <div key={i} className="glass p-6 rounded-[2rem] border border-white/5 flex items-center gap-4">
                    <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl shadow-inner`}>
                       {stat.icon}
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{stat.title}</p>
                       <p className="text-2xl font-black text-white">{stat.value.toLocaleString()}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Top Comics Side Section */}
          <div className="space-y-6">
            <div className="glass rounded-[2.5rem] p-8 border border-white/5 shadow-2xl space-y-5">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Quản lý truyện đề cử</h3>
              <p className="text-xs text-text-dim">Tìm truyện theo tên rồi chọn làm truyện đề cử trang chủ.</p>
              {featured && (
                <div className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                  Đang đề cử: <span className="font-bold">{featured.comicName}</span>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Nhập tên truyện..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent"
                />
                <button
                  onClick={handleSearch}
                  className="bg-accent text-white px-4 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all"
                >
                  {searching ? 'Đang tìm' : 'Tìm'}
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {searchResults.map((item) => (
                  <button
                    key={item.slug}
                    onClick={() => saveFeaturedComic(item)}
                    className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                  >
                    <p className="text-sm font-bold text-white">{item.name}</p>
                    <p className="text-[11px] text-text-dim">{item.slug}</p>
                  </button>
                ))}
              </div>
              {savedMessage && <p className="text-xs text-emerald-400 font-bold">{savedMessage}</p>}
            </div>

            <div className="glass rounded-[2.5rem] p-8 border border-white/5 shadow-2xl space-y-6">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="p-3 bg-accent/20 rounded-2xl text-accent">
                        <FaFire size={20} />
                     </div>
                     <h3 className="text-xl font-black text-white uppercase tracking-tight">Top Truyện</h3>
                  </div>
                  <span className="text-[10px] bg-white/5 px-3 py-1 rounded-full border border-white/5 font-black text-text-dim tracking-widest">TOP 10</span>
               </div>

               <div className="space-y-4">
                  {mostRead.map((stat, idx) => (
                    <div key={stat.comicSlug} className="group relative flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-transparent hover:border-accent/30 hover:bg-white/10 transition-all duration-300">
                       <div className="relative w-14 h-20 rounded-xl overflow-hidden shadow-lg border border-white/10">
                          <img 
                            src={getFullThumbUrl(stat.thumbUrl)} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                            alt={stat.comicName} 
                          />
                          <div className="absolute top-0 left-0 w-6 h-6 bg-accent text-[10px] font-black text-white flex items-center justify-center rounded-br-lg shadow-lg">
                            {idx + 1}
                          </div>
                       </div>
                       
                       <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-black text-white truncate group-hover:text-accent transition-colors uppercase tracking-tight">{stat.comicName}</h4>
                          <div className="flex items-center gap-3 mt-1.5">
                             <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-dim capitalize">
                                <FaFire size={10} className="text-orange-500" />
                                <span>{stat.readCount} lượt đọc</span>
                             </div>
                             <div className="w-1 h-1 rounded-full bg-white/10"></div>
                             <div className="text-[10px] font-medium text-text-muted">
                                {new Date(stat.lastReadAt).toLocaleDateString('vi-VN')}
                             </div>
                          </div>
                       </div>

                       <div className="opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                          <button 
                            onClick={() => router.push(`/truyen-tranh/${stat.comicSlug}`)}
                            className="p-3 bg-accent text-white rounded-xl shadow-lg shadow-accent/20 transition-all hover:scale-110"
                          >
                             <FaHistory size={12} />
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
