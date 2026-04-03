"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getRealmInfo } from '@/utils/levelSystem';
import { FaUser, FaCamera, FaStar, FaSave } from 'react-icons/fa';

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
    return <div className="min-h-screen bg-primary-bg flex items-center justify-center text-white">Đang tải...</div>;
  }

  const realmInfo = getRealmInfo(user.level || 1, user.exp || 0);

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
          <p className="text-sm font-medium text-text-dim mb-6">{user.email}</p>

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

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button className="w-full glass py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 text-text-muted hover:text-white hover:bg-white/10 transition-all border border-white/5">
            <FaUser />
            <span>Thống kê truyện đọc</span>
          </button>
        </div>

      </div>
    </div>
  );
}
