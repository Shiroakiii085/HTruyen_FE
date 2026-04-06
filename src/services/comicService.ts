import api from '@/lib/api';

const FORBIDDEN_SLUGS = ['dam-my', 'adult', 'soft-yuri', 'shoujo-ai', 'soft-yaoi', 'shounen-ai', 'smut', '16'];

const filterComics = (items: any[]) => {
  if (!items) return [];
  return items.filter(item => {
    if (!item.category) return true;
    return !item.category.some((cat: any) => FORBIDDEN_SLUGS.includes(cat.slug));
  });
};

export const comicService = {
  getHome: async () => {
    const res = await api.get('/proxy/home');
    if (res.data?.data?.items) {
      res.data.data.items = filterComics(res.data.data.items);
    }
    return res.data;
  },
  getList: async (type: string, page: number = 1) => {
    const res = await api.get(`/proxy/danh-sach/${type}?page=${page}`);
    if (res.data?.data?.items) {
      res.data.data.items = filterComics(res.data.data.items);
    }
    return res.data;
  },
  getCategories: async () => {
    const res = await api.get('/proxy/the-loai');
    return res.data;
  },
  getCategoryDetail: async (slug: string, page: number = 1) => {
    const res = await api.get(`/proxy/the-loai/${slug}?page=${page}`);
    if (res.data?.data?.items) {
      res.data.data.items = filterComics(res.data.data.items);
    }
    return res.data;
  },
  getComicDetail: async (slug: string) => {
    const res = await api.get(`/proxy/truyen-tranh/${slug}`);
    return res.data;
  },
  search: async (keyword: string, page: number = 1) => {
    const res = await api.get(`/proxy/tim-kiem?keyword=${keyword}&page=${page}`);
    if (res.data?.data?.items) {
      res.data.data.items = filterComics(res.data.data.items);
    }
    return res.data;
  },
  getChapter: async (apiUrl: string) => {
    const res = await api.get(`/proxy/chapter?apiUrl=${encodeURIComponent(apiUrl)}`);
    return res.data;
  }
};
