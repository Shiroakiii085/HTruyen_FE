"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { commentService, Comment } from '@/services/commentService';
import { getFullRankName } from '@/utils/levelSystem';
import { FaCommentAlt, FaPaperPlane, FaShieldAlt, FaStar, FaBookmark } from 'react-icons/fa';

interface CommentSectionProps {
  comicSlug: string;
  chapterName?: string; // If provided, only shows/posts for this chapter
}

export default function CommentSection({ comicSlug, chapterName }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const data = await commentService.getComments(comicSlug, chapterName);
        setComments(data);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [comicSlug, chapterName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!content.trim()) return;

    try {
      setSubmitting(true);
      const newComment = await commentService.postComment(comicSlug, content, chapterName);
      setComments([newComment, ...comments]);
      setContent('');
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
           <div className="w-1 h-8 bg-accent rounded-full shadow-lg shadow-accent/50"></div>
           <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter flex items-center">
             <FaCommentAlt className="mr-3 text-accent" /> 
             {chapterName ? `Bình luận Chương ${chapterName}` : "Thảo luận bộ truyện"} ({comments.length})
           </h3>
        </div>
      </div>

      {/* Input Section */}
      <div className="glass rounded-[2rem] p-6 border border-white/5 shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-indigo-500 opacity-30"></div>
         {user ? (
           <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-start space-x-4">
                 <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover border border-white/10 shadow-lg" alt="me" />
                 <div className="flex-1 space-y-4">
                    <textarea 
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder={chapterName ? `Bạn nghĩ gì về chương ${chapterName}?` : "Chia sẻ cảm nghĩ của bạn về bộ truyện này..."}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-text-main placeholder:text-text-dim focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all min-h-[100px] resize-none"
                    />
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-text-dim font-bold uppercase tracking-widest px-2">
                       <span className="opacity-70">Nghiêm cấm ngôn từ chửi tục & xúc phạm người khác</span>
                       <button 
                         type="submit"
                         disabled={submitting || !content.trim()}
                         className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-accent hover:bg-accent-light text-white px-8 py-3 rounded-xl font-black transition-all disabled:opacity-50 disabled:scale-95 hover:scale-105 shadow-lg shadow-accent/20"
                       >
                         {submitting ? (
                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                         ) : (
                           <>
                             <FaPaperPlane />
                             <span>GỬI BÌNH LUẬN</span>
                           </>
                         )}
                       </button>
                    </div>
                 </div>
              </div>
           </form>
         ) : (
           <div className="py-8 text-center space-y-4 bg-white/5 rounded-2xl border border-dashed border-white/10">
              <p className="text-text-dim font-bold uppercase tracking-widest text-xs">Bạn cần đăng nhập để tham gia bình luận</p>
              <button 
                onClick={() => window.location.href = '/auth/login'}
                className="bg-accent hover:bg-accent-light px-8 py-3 rounded-2xl text-xs font-black text-white uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:scale-105"
              >
                ĐĂNG NHẬP NGAY
              </button>
           </div>
         )}
      </div>

      {/* List Section */}
      <div className="space-y-6">
         {loading ? (
           [1,2,3].map(i => (
             <div key={i} className="glass p-6 rounded-3xl border border-white/5 animate-pulse flex space-x-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                   <div className="h-4 bg-white/10 rounded w-24"></div>
                   <div className="h-3 bg-white/10 rounded w-full"></div>
                </div>
             </div>
           ))
         ) : comments.length > 0 ? (
           comments.map(comment => (
             <div key={comment.id} className="group glass p-6 rounded-[2rem] border border-white/5 hover:border-accent/20 transition-all hover:bg-white/5 flex items-start space-x-4 relative overflow-hidden">
                <div className="relative shrink-0">
                   <img src={comment.user.avatar} className="w-12 h-12 rounded-2xl object-cover border border-white/10 shadow-lg" alt="user" />
                   {comment.user.role?.toLowerCase() === 'admin' && (
                     <div className="absolute -top-1 -right-2 bg-yellow-500 text-[8px] font-black text-white px-1.5 py-0.5 rounded-md shadow-lg flex items-center gap-1 border border-yellow-400">
                        <FaShieldAlt /> AD
                     </div>
                   )}
                </div>
                
                <div className="flex-1 space-y-3 min-w-0">
                   <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <span className={`text-sm font-black uppercase tracking-tight ${comment.user.role?.toLowerCase() === 'admin' ? 'text-yellow-400' : 'text-white'}`}>
                        {comment.user.username}
                      </span>
                      
                      <div className="flex items-center space-x-2 bg-accent/10 px-2.5 py-1 rounded-lg border border-accent/20">
                         <FaStar className="text-accent" size={10} />
                         <span className="text-[10px] font-black text-accent uppercase tracking-widest">
                           {getFullRankName(comment.user.level)}
                         </span>
                      </div>

                      {/* Chapter Badge for aggregated view */}
                      {!chapterName && comment.chapterName && (
                        <div className="flex items-center space-x-2 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 group-hover:border-accent/30 group-hover:bg-accent/5 transition-all">
                           <FaBookmark className="text-text-dim group-hover:text-accent" size={8} />
                           <span className="text-[10px] font-black text-text-muted group-hover:text-text-main uppercase tracking-widest">
                             Chương {comment.chapterName}
                           </span>
                        </div>
                      )}

                      <span className="text-[10px] text-text-dim font-medium ml-auto hidden sm:block">
                         {new Date(comment.createdAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                      </span>
                   </div>
                   
                   <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap">
                      {comment.content}
                   </p>
                   
                   <div className="sm:hidden text-[9px] text-text-dim font-medium uppercase tracking-widest pt-2 border-t border-white/5">
                      {new Date(comment.createdAt).toLocaleString('vi-VN')}
                   </div>
                </div>
             </div>
           ))
         ) : (
           <div className="py-20 text-center glass rounded-[3rem] border border-dashed border-white/10 bg-white/5">
              <FaCommentAlt className="mx-auto text-white/5 mb-4" size={48} />
              <p className="text-text-dim font-black uppercase tracking-[0.2em] text-xs">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
           </div>
         )}
      </div>
    </div>
  );
}
