import api from '@/lib/api';

export interface MostReadStatistic {
  comicSlug: string;
  comicName: string;
  thumbUrl: string;
  readCount: number;
  lastReadAt: string;
}

export const statsService = {
  getMostRead: async (): Promise<MostReadStatistic[]> => {
    const res = await api.get('/Stats/most-read');
    return res.data;
  }
};
