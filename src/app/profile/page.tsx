"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getRealmInfo, LEVEL_SYSTEM } from '@/utils/levelSystem';
import { FaUser, FaCamera, FaStar, FaSave, FaShieldAlt, FaCrown, FaGem, FaSignOutAlt } from 'react-icons/fa';
import EvolvingProgressBar from '@/components/Common/EvolvingProgressBar';

export default function ProfilePage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Basic auth check
    const storedUser = localStorage.getItem('user');
    if (!storedUser && !user) {
      router.push('/auth/login');
    } else {
      setLoading(false);
    }
  }, [user, router]);


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
    return <div className="min-h-screen bg-primary-bg flex items-center justify-center text-white font-black italic uppercase tracking-widest animate-pulse">Đang tải hồ sơ...</div>;
  }

  const realmInfo = getRealmInfo(user.level || 1, user.exp || 0);
  const currentRealm = LEVEL_SYSTEM.find(r => r.level === realmInfo.level);
  const isAdmin = user.role?.toLowerCase() === 'admin';

  return (
    <div className="min-h-screen bg-primary-bg pt-24 pb-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header Section */}
        <div className="glass rounded-[2.5rem] p-8 flex flex-col items-center text-center relative overflow-hidden border border-white/10 shadow-2xl backdrop-blur-3xl">
          <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-br from-accent/20 via-indigo-500/10 to-transparent"></div>
          
          <div className="relative group cursor-pointer mt-4" onClick={handleAvatarClick}>
            <div className={`w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-primary-bg shadow-2xl transition-all duration-500 ${uploading ? 'opacity-50 scale-95' : 'group-hover:scale-105 group-hover:rotate-2'}`}>
              <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" />
            </div>
            <div className="absolute inset-0 bg-black/60 rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
               <FaCamera size={28} className="text-white transform group-hover:scale-110 transition-transform" />
            </div>
            {uploading && (
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
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

          <h2 className="text-3xl font-black text-white mt-6 mb-1 tracking-tighter uppercase">{user.username}</h2>
          <p className="text-sm font-medium text-text-dim mb-4 italic">{user.email}</p>

          {/* Role Badge */}
          <div className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl mb-8 text-[10px] font-black uppercase tracking-[0.2em] border transition-all ${
            isAdmin 
              ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]' 
              : 'bg-white/5 text-text-muted border-white/10'
          }`}>
            {isAdmin ? <FaCrown size={12} className="animate-pulse" /> : <FaShieldAlt size={12} />}
            <span>{isAdmin ? 'Quản trị viên' : 'Thành viên'}</span>
          </div>

          {/* Realm Display Box - Tu Tien Aesthetic */}
          {currentRealm && (
            <div className="w-full bg-ink-deep/40 rounded-[2rem] p-6 border border-gold-dim/20 shadow-inner group/realm relative overflow-hidden backdrop-blur-sm">
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-ancient/10 via-transparent to-transparent opacity-0 group-hover/realm:opacity-100 transition-opacity duration-700"></div>
               
               <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="flex items-center space-x-4 text-left">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full blur-2xl opacity-40 animate-pulse" style={{ backgroundColor: currentRealm.color || 'var(--color-jade-green)' }}></div>
                      <img 
                        src={currentRealm.icon} 
                        className="relative w-14 h-14 object-contain animate-float drop-shadow-[0_0_10px_rgba(201,168,76,0.3)] transition-transform duration-700 group-hover/realm:scale-110" 
                        alt={currentRealm.name}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://cdn-icons-png.flaticon.com/512/10331/10331666.png'; // Fallback
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gold-ancient uppercase tracking-[0.2em] leading-none mb-1">Cấp độ tài khoản</p>
                      <p className="text-2xl font-black text-white font-[family-name:var(--font-heading)] group-hover/realm:text-gold-ancient transition-colors tracking-tight drop-shadow-md">{currentRealm.name}</p>
                      <p className="text-[10px] font-bold text-mist-gray group-hover/realm:text-jade-light transition-colors mt-1 underline decoration-gold-dim/30 underline-offset-4">Hạng {currentRealm.level}</p>
                    </div>
                  </div>
               </div>
               
               <div className="space-y-2 relative z-10">
                 <div className="flex justify-between items-end">
                   <span className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em]">Tiến độ thăng cấp</span>
                   <span className="text-xs font-black text-white italic">
                      {realmInfo.isMax ? 'TỐI ĐA' : `${realmInfo.currentExp.toLocaleString()} / ${realmInfo.requiredExp.toLocaleString()} XP`}
                   </span>
                 </div>
                 
                 <EvolvingProgressBar 
                    level={currentRealm.level}
                    progressPercent={realmInfo.progressPercent}
                    tier={currentRealm.tier}
                    color={currentRealm.color}
                    isMax={realmInfo.isMax}
                 />
                 
                 <p className="text-[10px] text-text-dim font-medium italic mt-3 text-center opacity-60">
                    {realmInfo.isMax ? 'Bạn đã đạt tới cấp độ cao nhất.' : `Cần thêm ${(realmInfo.requiredExp - realmInfo.currentExp).toLocaleString()} XP để thăng hạng.`}
                 </p>
               </div>
            </div>
          )}
        </div>


        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => {
              require('js-cookie').default.remove('token');
              localStorage.removeItem('user');
              window.location.href = '/';
            }}
            className="w-full bg-white/5 py-5 rounded-3xl font-black flex items-center justify-center space-x-4 text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-all border border-red-400/10 group active:scale-95 shadow-lg"
          >
            <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs uppercase tracking-[0.3em]">Đăng xuất tài khoản</span>
          </button>
        </div>

      </div>
    </div>
  );
}
