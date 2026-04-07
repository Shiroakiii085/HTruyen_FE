"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await api.post('/Auth/register', { username, email, password });
      setSuccess("Đăng ký thành công! Đang chuyển hướng đăng nhập...");
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (err: any) {
      setIsLoading(false);
      let errorMsg = 'Đăng ký thất bại.';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (err.response.data.errors && typeof err.response.data.errors === 'object') {
          const firstErr = Object.values(err.response.data.errors)[0] as string[];
          errorMsg = (firstErr && firstErr.length > 0) ? firstErr[0] : err.response.data.title;
        } else if (err.response.data.title) {
          errorMsg = err.response.data.title;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        }
      }
      setError(errorMsg);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out relative">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-30 mix-blend-multiply"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold-ancient/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-jade-light/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-md w-full p-10 md:p-12 bg-paper-warm/90 rounded-[2rem] shadow-premium border-2 border-gold-dim/20 backdrop-blur-xl overflow-hidden">
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-paper-aged/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="w-16 h-16 border-4 border-gold-dim/20 border-t-blood-sect rounded-full animate-spin mb-6"></div>
            <p className="text-blood-sect font-black tracking-[0.2em] uppercase text-sm animate-pulse text-center px-6 font-[family-name:var(--font-heading)]">
              Đang thiết lập tài khoản...<br/>
              <span className="text-mist-gray mt-2 block text-[10px] tracking-widest">Đang tạo hồ sơ người dùng<br/>Xin đợi trong chốc lát!</span>
            </p>
          </div>
        )}

        <div className="text-center mb-10">
          <Link href="/" className="inline-block text-3xl font-black text-white mb-4 font-[family-name:var(--font-heading)] drop-shadow-sm border-b border-gold-dim/30 pb-2">
            HTruyen
          </Link>
          <h2 className="text-3xl font-black text-white tracking-tight uppercase font-[family-name:var(--font-heading)]">Đăng Ký Tài Khoản</h2>
          <p className="text-mist-gray mt-3 font-bold text-xs tracking-[0.2em] uppercase opacity-90 border-l border-gold-dim/40 pl-2 mx-auto w-fit">Tạo tài khoản để trải nghiệm tốt hơn</p>
        </div>
        
        {error && (
          <div className="bg-red-900/10 text-blood-sect p-4 rounded-[4px] mb-6 text-[11px] font-black uppercase tracking-widest text-center border border-blood-sect/30 shadow-sm animate-shake font-[family-name:var(--font-heading)]">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-jade-green/10 text-jade-green p-4 rounded-[4px] mb-6 text-[11px] font-black uppercase tracking-widest text-center border border-jade-green/30 shadow-sm font-[family-name:var(--font-heading)]">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-mist-gray uppercase tracking-[0.3em] ml-2">Tên người dùng</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="w-full bg-paper-aged border border-gold-dim/30 rounded-[4px] px-6 py-4 text-white focus:ring-2 focus:ring-blood-sect/40 focus:border-blood-sect/40 outline-none transition-all placeholder:text-mist-gray/50 text-sm font-medium shadow-inner disabled:opacity-50 font-[family-name:var(--font-heading)]"
              placeholder="Ví dụ: Trần Bình An"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-mist-gray uppercase tracking-[0.3em] ml-2">Địa chỉ Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full bg-paper-aged border border-gold-dim/30 rounded-[4px] px-6 py-4 text-white focus:ring-2 focus:ring-blood-sect/40 focus:border-blood-sect/40 outline-none transition-all placeholder:text-mist-gray/50 text-sm font-medium shadow-inner disabled:opacity-50 font-[family-name:var(--font-heading)]"
              placeholder="user@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-mist-gray uppercase tracking-[0.3em] ml-2">Mật khẩu</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full bg-paper-aged border border-gold-dim/30 rounded-[4px] px-6 py-4 text-white focus:ring-2 focus:ring-blood-sect/40 focus:border-blood-sect/40 outline-none transition-all placeholder:text-mist-gray/50 text-sm font-medium shadow-inner disabled:opacity-50 font-[family-name:var(--font-heading)]"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex justify-center py-5 px-4 rounded-[4px] shadow-md text-sm font-black text-paper-warm bg-blood-sect hover:bg-blood-sect/80 border border-blood-sect/50 transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-[0.3em] font-[family-name:var(--font-heading)] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ NGAY'}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gold-dim/20 text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1 bg-gradient-to-r from-transparent via-gold-dim/40 to-transparent"></div>
          <p className="text-[11px] font-black text-mist-gray uppercase tracking-[0.1em] font-[family-name:var(--font-heading)]">
            Đã có tài khoản?{' '}
            <Link href="/auth/login" className="text-blood-sect hover:text-gold-ancient transition-colors tracking-widest ml-1 border-b border-blood-sect/30 hover:border-gold-ancient/50 pb-0.5">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
