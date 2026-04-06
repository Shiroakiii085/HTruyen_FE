import api from '@/lib/api';

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  chapterName?: string;
  user: {
    username: string;
    avatar: string;
    level: number;
    role: string;
  };
}

export const commentService = {
  getComments: async (comicSlug: string, chapterName?: string): Promise<Comment[]> => {
    let url = `/Comments/${comicSlug}`;
    if (chapterName) {
      url += `?chapterName=${encodeURIComponent(chapterName)}`;
    }
    const res = await api.get(url);
    return res.data;
  },

  postComment: async (comicSlug: string, content: string, chapterName?: string): Promise<Comment> => {
    const res = await api.post('/Comments', { comicSlug, content, chapterName });
    return res.data;
  }
};
