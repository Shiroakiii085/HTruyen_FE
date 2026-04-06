import api from '@/lib/api';

const FORBIDDEN_SLUGS = ['dam-my', 'adult', 'soft-yuri', 'shoujo-ai', 'soft-yaoi', 'shounen-ai', 'smut', '16'];

const filterComics = (items: any[]) => {
  if (!items) return [];
  return items.filter(item => {
    // Check item.category or item.categories
    const categories = item.category || item.categories;
    if (!categories || !Array.isArray(categories)) return true;
    
    return !categories.some((cat: any) => 
      FORBIDDEN_SLUGS.includes(cat.slug) || 
      FORBIDDEN_SLUGS.some(slug => cat.name?.toLowerCase().includes(slug))
    );
  });
};

const filterCategories = (items: any[]) => {
  if (!items) return [];
  return items.filter(cat => !FORBIDDEN_SLUGS.includes(cat.slug));
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
    if (res.data?.data?.items) {
      res.data.data.items = filterCategories(res.data.data.items);
    }
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
