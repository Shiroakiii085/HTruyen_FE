import api from '@/lib/api';

export const comicService = {
  getHome: async () => {
    const res = await api.get('/proxy/home');
    return res.data;
  },
  getList: async (type: string, page: number = 1) => {
    const res = await api.get(`/proxy/danh-sach/${type}?page=${page}`);
    return res.data;
  },
  getCategories: async () => {
    const res = await api.get('/proxy/the-loai');
    return res.data;
  },
  getCategoryDetail: async (slug: string, page: number = 1) => {
    const res = await api.get(`/proxy/the-loai/${slug}?page=${page}`);
    return res.data;
  },
  getComicDetail: async (slug: string) => {
    const res = await api.get(`/proxy/truyen-tranh/${slug}`);
    return res.data;
  },
  search: async (keyword: string, page: number = 1) => {
    const res = await api.get(`/proxy/tim-kiem?keyword=${keyword}&page=${page}`);
    return res.data;
  },
  getChapter: async (apiUrl: string) => {
    const res = await api.get(`/proxy/chapter?apiUrl=${encodeURIComponent(apiUrl)}`);
    return res.data;
  }
};
