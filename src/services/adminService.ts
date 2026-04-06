import api from '@/lib/api';

export interface MostReadStatistic {
  comicSlug: string;
  comicName: string;
  thumbUrl: string;
  readCount: number;
  lastReadAt: string;
}

export const adminService = {
  getMostReadStatistics: async (): Promise<MostReadStatistic[]> => {
    const res = await api.get('/Admin/statistics/most-read');
    return res.data;
  }
};
