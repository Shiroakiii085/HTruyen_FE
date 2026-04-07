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

export interface FeaturedComicItem {
  slug: string;
  name: string;
  thumb_url: string;
}

export interface FeaturedComicConfig {
  comicSlug: string;
  comicName: string;
  thumbUrl: string;
}

export const adminService = {
  getMostReadStatistics: async (): Promise<MostReadStatistic[]> => {
    const res = await api.get('/Admin/statistics/most-read');
    return res.data;
  },
  getReaderCounts: async (): Promise<ReaderCounts> => {
    const res = await api.get('/Admin/statistics/reader-counts');
    return res.data;
  },
  searchComicsForFeatured: async (keyword: string): Promise<FeaturedComicItem[]> => {
    const res = await api.get(`/Featured/search?keyword=${encodeURIComponent(keyword)}&page=1`);
    return res.data?.items || [];
  },
  getFeaturedComic: async (): Promise<FeaturedComicConfig | null> => {
    const res = await api.get('/Featured/current');
    if (!res.data || !res.data.comicSlug) return null;
    return res.data;
  },
  setFeaturedComic: async (payload: FeaturedComicConfig): Promise<FeaturedComicConfig> => {
    const res = await api.post('/Featured/set', payload);
    return res.data;
  }
};
