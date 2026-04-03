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
      className="group relative block w-full aspect-[2/3.2] overflow-hidden rounded-2xl bg-surface-card shadow-premium hover:shadow-accent/20 transition-all duration-500 ease-out hover:-translate-y-2"
    >
      {/* Background Image */}
      <img
        src={imageUrl}
        alt={comic.name}
        loading="lazy"
        className="absolute inset-0 object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-out brightness-[0.85] group-hover:brightness-100"
      />
      
      {/* Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
      
      {/* Content */}
      <div className="absolute inset-0 p-3 md:p-4 flex flex-col justify-end z-20">
        {/* Badges Hub */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
           {comic.status === 'completed' && (
            <span className="glass px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#10b981] border-[#10b981]/30">Full</span>
          )}
        </div>

        <div className="space-y-1.5">
           <h3 className="font-bold text-text-main text-sm md:text-base leading-tight line-clamp-2 transition-colors group-hover:text-accent drop-shadow-lg">
            {comic.name}
          </h3>
          
          <div className="flex items-center justify-between gap-2 overflow-hidden">
            {latestChapter && (
              <span className="text-[10px] md:text-xs font-black text-accent bg-accent/10 px-2 py-0.5 rounded-md border border-accent/20 backdrop-blur-md uppercase tracking-tighter shrink-0">
                Ch. {latestChapter}
              </span>
            )}
            <span className="text-[10px] text-text-dim font-bold truncate opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {comic.updatedAt ? new Date(comic.updatedAt).toLocaleDateString('vi-VN') : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Border Glow on Hover */}
      <div className="absolute inset-0 border-2 border-accent/0 group-hover:border-accent/40 rounded-2xl transition-all duration-500 pointer-events-none"></div>
    </Link>
  );
}
