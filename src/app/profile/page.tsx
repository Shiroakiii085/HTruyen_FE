"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getRealmInfo } from '@/utils/levelSystem';
import { FaUser, FaCamera, FaStar, FaSave, FaShieldAlt, FaCrown, FaChartLine, FaFire, FaHistory, FaCheckCircle } from 'react-icons/fa';
import { adminService, MostReadStatistic } from '@/services/adminService';

export default function ProfilePage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [adminStats, setAdminStats] = useState<MostReadStatistic[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    // Basic auth check
    const storedUser = localStorage.getItem('user');
    if (!storedUser && !user) {
      router.push('/auth/login');
    } else {
      setLoading(false);
    }
  }, [user, router]);

  useEffect(() => {
    if (user?.role?.toLowerCase() === 'admin') {
      const fetchStats = async () => {
        try {
          setStatsLoading(true);
          const data = await adminService.getMostReadStatistics();
          setAdminStats(data);
        } catch (err) {
          console.error("Failed to fetch admin stats:", err);
        } finally {
          setStatsLoading(false);
        }
      };
      fetchStats();
    }
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const token = require('js-cookie').default.get('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/profile/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        // Update context & local storage
        if (user && token) {
           const fullUrl = data.avatarUrl.startsWith('http') ? data.avatarUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${data.avatarUrl}`;
           const updatedUser = { ...user, avatar: fullUrl };
           login(token, updatedUser);
        }
        alert("Cập nhật ảnh đại diện thành công!");
      } else {
        alert("Lỗi khi tải ảnh lên. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi hệ thống.");
    } finally {
      setUploading(false);
    }
  };

  if (loading || !user) {
    return <div className="min-h-screen bg-primary-bg flex items-center justify-center text-white">Đang tải...</div>;
  }

  const realmInfo = getRealmInfo(user.level || 1, user.exp || 0);
  const isAdmin = user.role?.toLowerCase() === 'admin';

  return (
    <div className="min-h-screen bg-primary-bg pt-24 pb-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header Section */}
        <div className="glass rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden border border-white/5 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-accent/20 to-indigo-500/20"></div>
          
          <div className="relative group cursor-pointer mt-4" onClick={handleAvatarClick}>
            <div className={`w-28 h-28 rounded-3xl overflow-hidden border-4 border-primary-bg shadow-xl transition-all duration-300 ${uploading ? 'opacity-50 scale-95' : 'group-hover:scale-105'}`}>
              <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" />
            </div>
            <div className="absolute inset-0 bg-black/50 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <FaCamera size={24} className="text-white" />
            </div>
            {uploading && (
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
               </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <h2 className="text-2xl font-black text-white mt-4 mb-1">{user.username}</h2>
          <p className="text-sm font-medium text-text-dim mb-3">{user.email}</p>

          {/* Role Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-xs font-black uppercase tracking-widest border ${
            isAdmin 
              ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-lg shadow-yellow-500/10' 
              : 'bg-white/5 text-text-muted border-white/10'
          }`}>
            {isAdmin ? <FaCrown size={12} /> : <FaShieldAlt size={12} />}
            <span>{isAdmin ? 'Quản trị viên' : 'Thành viên'}</span>
          </div>

          {/* Realm Display Box */}
          <div className="w-full bg-white/5 rounded-2xl p-5 border border-white/10 shadow-inner">
             <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-accent/20 rounded-lg">
                    <FaStar className="text-accent" size={14} />
                  </div>
                  <span className="text-sm font-black text-white uppercase tracking-widest">{realmInfo.name}</span>
                </div>
                <div className="text-xs font-bold bg-white/10 px-3 py-1 rounded-lg text-text-muted">
                  Cấp {realmInfo.level}
                </div>
             </div>
             
             <div className="mb-2 flex justify-between items-end">
               <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Tiến trình tu luyện</span>
               <span className="text-xs font-black text-accent">{realmInfo.isMax ? 'MAX' : `${realmInfo.currentExp} / ${realmInfo.requiredExp} XP`}</span>
             </div>
             
             <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-accent to-indigo-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                     style={{ width: `${realmInfo.progressPercent}%` }}></div>
             </div>
          </div>
        </div>

        {/* Admin Statistics Section */}
        {isAdmin && (
          <div className="glass rounded-[2rem] p-6 border border-white/5 shadow-2xl space-y-6">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-accent/20 rounded-xl">
                      <FaChartLine className="text-accent" size={18} />
                   </div>
                   <h3 className="text-lg font-black text-white uppercase tracking-tighter">Thống kê hệ thống</h3>
                </div>
                <span className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em] bg-white/5 px-3 py-1 rounded-full border border-white/5">TOP 10 TRUYỆN</span>
             </div>

             <div className="space-y-3">
                {statsLoading ? (
                  <div className="py-10 flex flex-col items-center justify-center gap-3">
                     <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                     <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest">Đang tính toán dữ liệu...</span>
                  </div>
                ) : adminStats.length > 0 ? (
                  adminStats.map((stat, idx) => (
                    <div key={stat.comicSlug} className="group relative flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-transparent hover:border-accent/30 hover:bg-white/10 transition-all duration-300">
                       <div className="relative w-12 h-16 rounded-xl overflow-hidden shadow-lg">
                          <img src={stat.thumbUrl} className="w-full h-full object-cover" alt={stat.comicName} />
                          <div className="absolute top-0 left-0 w-5 h-5 bg-accent text-[10px] font-black text-white flex items-center justify-center rounded-br-lg">{idx + 1}</div>
                       </div>
                       
                       <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-black text-white truncate group-hover:text-accent transition-colors uppercase tracking-tight">{stat.comicName}</h4>
                          <div className="flex items-center gap-3 mt-1">
                             <div className="flex items-center gap-1 text-[10px] font-bold text-text-dim capitalize">
                                <FaFire size={10} className="text-orange-500" />
                                <span>{stat.readCount} lượt đọc</span>
                             </div>
                             <div className="w-1 h-1 rounded-full bg-white/10"></div>
                             <div className="text-[10px] font-medium text-text-muted truncate">
                                {new Date(stat.lastReadAt).toLocaleDateString('vi-VN')}
                             </div>
                          </div>
                       </div>

                       <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => router.push(`/truyen-tranh/${stat.comicSlug}`)}
                            className="p-2 bg-accent/20 hover:bg-accent text-accent hover:text-white rounded-lg transition-all"
                          >
                             <FaHistory size={12} />
                          </button>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center glass rounded-2xl border border-dashed border-white/10">
                     <p className="text-text-dim text-xs font-bold uppercase tracking-widest">Chưa có dữ liệu thống kê</p>
                  </div>
                )}
             </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => require('js-cookie').default.remove('token') || window.location.reload()}
            className="w-full glass py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-all border border-red-400/10"
          >
            <FaShieldAlt />
            <span>ĐĂNG XUẤT TÀI KHOẢN</span>
          </button>
        </div>

      </div>
    </div>
  );
}
