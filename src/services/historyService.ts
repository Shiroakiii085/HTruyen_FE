import api from '@/lib/api';

export interface ReadingHistory {
  id: number;
  comicSlug: string;
  comicName: string;
  thumbUrl: string;
  chapterName: string;
  chapterApiData: string;
  readAt: string;
}

export const historyService = {
  getHistories: async () => {
    try {
      const res = await api.get('/History');
      return res.data;
    } catch (err) {
      console.error('Error fetching history:', err);
      return [];
    }
  },

  deleteHistory: async (slug: string) => {
    try {
      const res = await api.delete(`/History/${slug}`);
      return res.data;
    } catch (err) {
      console.error('Error deleting history:', err);
      throw err;
    }
  }
};
