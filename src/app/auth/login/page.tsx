"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/Auth/login', { email, password });
      login(res.data.token, res.data);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data || 'Đăng nhập thất bại.');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/30 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/30 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-md w-full p-10 md:p-12 glass rounded-[2.5rem] shadow-premium border border-white/5 backdrop-blur-2xl">
        <div className="text-center mb-12">
          <Link href="/" className="inline-block text-3xl font-black bg-gradient-to-r from-accent to-indigo-400 bg-clip-text text-transparent mb-6">HTruyen</Link>
          <h2 className="text-3xl font-black text-text-main tracking-tight uppercase">Chào mừng trở lại</h2>
          <p className="text-text-muted mt-3 font-bold text-sm tracking-wide uppercase opacity-70">Đăng nhập để tiếp tục hành trình</p>
        </div>
        
        {error && (
          <div className="bg-red-400/10 text-red-400 p-4 rounded-2xl mb-8 text-xs font-black uppercase tracking-widest text-center border border-red-400/20 shadow-inner animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
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
            <div className="flex justify-between items-center px-2">
              <label className="block text-[10px] font-black text-text-dim uppercase tracking-[0.2em]">Mật khẩu</label>
              <Link href="#" className="text-[10px] font-black text-accent hover:text-indigo-400 uppercase tracking-widest">Quên mật khẩu?</Link>
            </div>
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
            className="w-full flex justify-center py-5 px-4 rounded-2xl shadow-xl text-sm font-black text-white bg-accent hover:bg-indigo-500 shadow-accent/20 hover:shadow-accent/40 transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-[0.2em]"
          >
            ĐĂNG NHẬP NGAY
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-sm font-medium text-text-muted">
            Chưa có tài khoản?{' '}
            <Link href="/auth/register" className="font-black text-accent hover:text-indigo-400 transition-colors uppercase tracking-widest ml-1">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
