import Link from 'next/link';

export interface ComicItem {
  _id: string;
  name: string;
  slug: string;
  origin_name: string[];
  status: string;
  thumb_url: string;
  sub_docquyen: boolean;
  category: { id: string; name: string; slug: string }[];
  updatedAt: string;
  chaptersLatest?: { filename: string; chapter_name: string; chapter_title: string; chapter_api_data: string }[];
}

interface StoryCardProps {
  comic: ComicItem;
  imageDomain: string; // From APP_DOMAIN_CDN_IMAGE
}

export default function StoryCard({ comic, imageDomain }: StoryCardProps) {
  const safeImageDomain = imageDomain || '';
  const imageUrl = safeImageDomain ? `${safeImageDomain}/uploads/comics/${comic.thumb_url}` : '';
  const latestChapter = comic.chaptersLatest && comic.chaptersLatest.length > 0 ? comic.chaptersLatest[0].chapter_name : '';

  return (
    <Link 
      href={`/truyen-tranh/${comic.slug}`} 
      className="anime-stagger-item group relative block w-full aspect-[2/3] overflow-hidden rounded-xl bg-surface-card border border-white/5 hover:border-jade-green/50 hover:shadow-2xl hover:shadow-jade-green/20 transition-all duration-500 ease-out hover:-translate-y-2"
    >
      {/* Background Image Container with vignette overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={imageUrl}
          alt={comic.name}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b14] via-[#0a0b14]/20 to-transparent"></div>
      </div>
      
      {/* Hot Badge */}
      {comic.sub_docquyen && (
        <div className="absolute top-2 left-2 z-30">
          <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg">Hot</span>
        </div>
      )}
      
      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 space-y-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
        <div className="flex flex-wrap gap-1 mb-1">
          {comic.status === 'completed' && (
            <span className="text-[9px] font-black uppercase bg-jade-green/20 text-jade-green border border-jade-green/30 px-1.5 py-0.5 rounded">Full</span>
          )}
        </div>

        <h3 className="font-bold text-white text-sm md:text-base leading-tight line-clamp-2 transition-colors group-hover:text-jade-green font-[family-name:var(--font-heading)]">
          {comic.name}
        </h3>
        
        <div className="flex justify-between items-center pt-1 border-t border-white/10">
          {latestChapter && (
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">
              Chương {latestChapter}
            </span>
          )}
          <span className="text-[9px] text-slate-500 font-bold italic">
            {comic.updatedAt ? new Date(comic.updatedAt).toLocaleDateString('vi-VN') : ''}
          </span>
        </div>
      </div>

      {/* Modern Glow Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-jade-green/0 via-jade-green/0 to-jade-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </Link>
  );
}
