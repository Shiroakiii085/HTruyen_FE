import api from '@/lib/api';

const FORBIDDEN_SLUGS = [
  'dam-my', 'adult', 'soft-yuri', 'shoujo-ai', 'soft-yaoi', 'shounen-ai', 'smut', '16',
  'shoujo', 'romance', 'ngon-tinh', 'ngôn-tình', 'gender-bender', 'shojo'
];

const FORBIDDEN_KEYWORDS = ['ngôn tình', 'đam mỹ', 'romance', 'shoujo', 'gender bender', 'yuri', 'yaoi'];

const COMING_SOON_KEYWORDS = ['coming soon', 'sap ra mat', 'sắp ra mắt', 'upcoming', 'soon'];
const ITEMS_PER_PAGE = 15;
const MAX_SCAN_PAGES = 200;

const filterComics = (items: any[]) => {
  if (!items) return [];
  return items.filter(item => {
    // Check item.category or item.categories
    const categories = item.category || item.categories;
    if (!categories || !Array.isArray(categories)) return true;
    
    return !categories.some((cat: any) => {
      const slug = cat.slug?.toLowerCase() || '';
      const name = cat.name?.toLowerCase() || '';
      
      return FORBIDDEN_SLUGS.includes(slug) || 
             FORBIDDEN_KEYWORDS.some(kw => name.includes(kw) || slug.includes(kw));
    });
  });
};

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

const paginateFilteredItems = async (
  page: number,
  fetchPageData: (sourcePage: number) => Promise<any>,
  itemFilter: (item: any) => boolean
) => {
  const requestedPage = Math.max(1, Number(page) || 1);
  let sourcePage = 1;
  let appDomain = '';
  let lastParams: any = {};
  const allFilteredItems: any[] = [];

  while (sourcePage <= MAX_SCAN_PAGES) {
    const res = await fetchPageData(sourcePage);
    const payload = res?.data || {};
    const rawItems = Array.isArray(payload?.items) ? payload.items : [];
    const pagination = payload?.params?.pagination || {};

    if (!appDomain) {
      appDomain = payload?.APP_DOMAIN_CDN_IMAGE || '';
    }
    lastParams = payload?.params || {};

    const validItems = filterComics(rawItems).filter(itemFilter);
    allFilteredItems.push(...validItems);

    const sourceTotalPages = pagination?.totalPages || (
      pagination?.totalItems && pagination?.totalItemsPerPage
        ? Math.ceil(pagination.totalItems / pagination.totalItemsPerPage)
        : 0
    );

    const reachedEndByTotalPages = sourceTotalPages > 0 && sourcePage >= sourceTotalPages;
    const reachedEndByEmptyPage = rawItems.length === 0;
    if (reachedEndByTotalPages || reachedEndByEmptyPage) break;

    sourcePage += 1;
  }

  const totalItems = allFilteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const safePage = Math.min(requestedPage, totalPages);
  const start = (safePage - 1) * ITEMS_PER_PAGE;
  const items = allFilteredItems.slice(start, start + ITEMS_PER_PAGE);

  return {
    status: 'success',
    data: {
      ...lastParams,
      items,
      APP_DOMAIN_CDN_IMAGE: appDomain,
      params: {
        ...lastParams,
        pagination: {
          ...(lastParams?.pagination || {}),
          currentPage: safePage,
          totalItems,
          totalItemsPerPage: ITEMS_PER_PAGE,
          totalPages
        }
      }
    }
  };
};

export const comicService = {
  getHome: async () => {
    const res = await api.get('/proxy/home');
    if (res.data?.data?.items) {
      res.data.data.items = removeComingSoonComics(filterComics(res.data.data.items));
    }
    return res.data;
  },
  getList: async (type: string, page: number = 1) => {
    const apiType = type === 'sap-ra-mat' ? 'truyen-moi' : type;
    return paginateFilteredItems(
      page,
      async (sourcePage: number) => {
        const res = await api.get(`/proxy/danh-sach/${apiType}?page=${sourcePage}`);
        return res?.data?.data || {};
      },
      (item: any) => type === 'sap-ra-mat' ? isComingSoonComic(item) : !isComingSoonComic(item)
    );
  },
  getCategories: async () => {
    const res = await api.get('/proxy/the-loai');
    if (res.data?.data?.items) {
      res.data.data.items = filterCategories(res.data.data.items);
    }
    return res.data;
  },
  getCategoryDetail: async (slug: string, page: number = 1) => {
    return paginateFilteredItems(
      page,
      async (sourcePage: number) => {
        const res = await api.get(`/proxy/the-loai/${slug}?page=${sourcePage}`);
        return res?.data?.data || {};
      },
      (item: any) => !isComingSoonComic(item)
    );
  },
  getComicDetail: async (slug: string) => {
    const res = await api.get(`/proxy/truyen-tranh/${slug}`);
    return res.data;
  },
  search: async (keyword: string, page: number = 1) => {
    return paginateFilteredItems(
      page,
      async (sourcePage: number) => {
        const res = await api.get(`/proxy/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${sourcePage}`);
        return res?.data?.data || {};
      },
      (item: any) => !isComingSoonComic(item)
    );
  },
  getChapter: async (apiUrl: string) => {
    const res = await api.get(`/proxy/chapter?apiUrl=${encodeURIComponent(apiUrl)}`);
    return res.data;
  }
};
