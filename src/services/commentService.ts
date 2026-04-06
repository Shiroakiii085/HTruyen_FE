import api from '@/lib/api';

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: {
    username: string;
    avatar: string;
    level: number;
    role: string;
  };
}

export const commentService = {
  getComments: async (comicSlug: string): Promise<Comment[]> => {
    const res = await api.get(`/Comments/${comicSlug}`);
    return res.data;
  },
  postComment: async (comicSlug: string, content: string): Promise<Comment> => {
    const res = await api.post('/Comments', { comicSlug, content });
    return res.data;
  }
};
