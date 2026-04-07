import api from '@/lib/api';

const FORBIDDEN_SLUGS = [
  'dam-my', 'adult', 'soft-yuri', 'shoujo-ai', 'soft-yaoi', 'shounen-ai', 'smut', '16',
  'shoujo', 'romance', 'ngon-tinh', 'ngôn-tình', 'gender-bender', 'shojo'
];

const FORBIDDEN_KEYWORDS = ['ngôn tình', 'đam mỹ', 'romance', 'shoujo', 'gender bender', 'yuri', 'yaoi'];

const COMING_SOON_KEYWORDS = ['coming soon', 'sap ra mat', 'sắp ra mắt', 'upcoming', 'soon'];

const filterCategories = (items: any[]) => {
  if (!items) return [];
  return items.filter(cat => {
    const slug = cat.slug?.toLowerCase() || '';
    const name = cat.name?.toLowerCase() || '';
    return !FORBIDDEN_SLUGS.includes(slug) && 
           !FORBIDDEN_KEYWORDS.some(kw => name.includes(kw) || slug.includes(kw));
  });
};

const isComingSoonComic = (item: any) => {
  if (!item) return false;

  const status = String(item.status || '').toLowerCase().trim();
  return COMING_SOON_KEYWORDS.some(keyword => status.includes(keyword));
};

const removeComingSoonComics = (items: any[]) => {
  if (!items) return [];
  return items.filter(item => !isComingSoonComic(item));
};

export const comicService = {
  getHome: async () => {
    const res = await api.get('/proxy/home');
    if (res.data?.data?.items) {
      res.data.data.items = removeComingSoonComics(res.data.data.items);
    }
    return res.data;
  },
  getList: async (type: string, page: number = 1) => {
    const apiType = type === 'sap-ra-mat' ? 'truyen-moi' : type;
    const res = await api.get(`/proxy/danh-sach/${apiType}?page=${page}`);
    if (res.data?.data?.items) {
      const items = res.data.data.items;
      res.data.data.items = type === 'sap-ra-mat'
        ? items.filter(isComingSoonComic)
        : removeComingSoonComics(items);
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
      res.data.data.items = removeComingSoonComics(res.data.data.items);
    }
    return res.data;
  },
  getComicDetail: async (slug: string) => {
    const res = await api.get(`/proxy/truyen-tranh/${slug}`);
    return res.data;
  },
  search: async (keyword: string, page: number = 1) => {
    const res = await api.get(`/proxy/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}`);
    if (res.data?.data?.items) {
      res.data.data.items = removeComingSoonComics(res.data.data.items);
    }
    return res.data;
  },
  getChapter: async (apiUrl: string) => {
    const res = await api.get(`/proxy/chapter?apiUrl=${encodeURIComponent(apiUrl)}`);
    return res.data;
  }
};
