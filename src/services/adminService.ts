import api from '@/lib/api';

export interface MostReadStatistic {
  comicSlug: string;
  comicName: string;
  thumbUrl: string;
  readCount: number;
  lastReadAt: string;
}

export interface StatPoint {
  label: string;
  count: number;
}

export interface ReaderCounts {
  daily: StatPoint[];
  monthly: StatPoint[];
  yearly: StatPoint[];
}

export const adminService = {
  getMostReadStatistics: async (): Promise<MostReadStatistic[]> => {
    const res = await api.get('/Admin/statistics/most-read');
    return res.data;
  },
  getReaderCounts: async (): Promise<ReaderCounts> => {
    const res = await api.get('/Admin/statistics/reader-counts');
    return res.data;
  }
};
