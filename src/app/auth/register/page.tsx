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
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/Auth/register', { username, email, password });
      setSuccess("Đăng ký thành công! Đang chuyển hướng đăng nhập...");
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (err: any) {
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
    <div className="min-h-[90vh] flex items-center justify-center p-6 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/30 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/30 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-md w-full p-10 md:p-12 glass rounded-[2.5rem] shadow-premium border border-white/5 backdrop-blur-2xl">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block text-3xl font-black bg-gradient-to-r from-accent to-indigo-400 bg-clip-text text-transparent mb-6">HTruyen</Link>
          <h2 className="text-3xl font-black text-text-main tracking-tight uppercase">Gia nhập ngay</h2>
          <p className="text-text-muted mt-3 font-bold text-sm tracking-wide uppercase opacity-70">Tạo tài khoản để khám phá thêm</p>
        </div>
        
        {error && (
          <div className="bg-red-400/10 text-red-400 p-4 rounded-2xl mb-6 text-xs font-black uppercase tracking-widest text-center border border-red-400/20 shadow-inner animate-shake">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-400/10 text-emerald-400 p-4 rounded-2xl mb-6 text-xs font-black uppercase tracking-widest text-center border border-emerald-400/20 shadow-inner">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-text-dim uppercase tracking-[0.2em] ml-2">Tên hiển thị</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-text-main focus:ring-2 focus:ring-accent/50 focus:border-transparent outline-none transition-all placeholder:text-text-dim/50 text-sm font-medium shadow-inner"
              placeholder="VD: OtakuVN"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-text-dim uppercase tracking-[0.2em] ml-2">Địa chỉ Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-text-main focus:ring-2 focus:ring-accent/50 focus:border-transparent outline-none transition-all placeholder:text-text-dim/50 text-sm font-medium shadow-inner"
              placeholder="name@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-text-dim uppercase tracking-[0.2em] ml-2">Mật khẩu</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-text-main focus:ring-2 focus:ring-accent/50 focus:border-transparent outline-none transition-all placeholder:text-text-dim/50 text-sm font-medium shadow-inner"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            className="w-full flex justify-center py-5 px-4 rounded-2xl shadow-xl text-sm font-black text-white bg-accent hover:bg-indigo-500 shadow-accent/20 hover:shadow-accent/40 transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-[0.2em] mt-4"
          >
            ĐĂNG KÝ TÀI KHOẢN
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <p className="text-sm font-medium text-text-muted">
            Đã có tài khoản?{' '}
            <Link href="/auth/login" className="font-black text-accent hover:text-indigo-400 transition-colors uppercase tracking-widest ml-1">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
