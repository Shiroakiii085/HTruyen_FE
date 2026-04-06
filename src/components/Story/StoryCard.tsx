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
      className="anime-stagger-item group relative block w-full aspect-[2/3.2] overflow-hidden rounded-sm bg-paper-aged bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] shadow-[2px_4px_10px_rgba(26,20,16,0.3)] hover:shadow-[0_0_20px_rgba(201,168,76,0.4)] transition-all duration-300 ease-out hover:-translate-y-1 !bg-none border border-transparent hover:border-gold-ancient/50"
      style={{
        background: 'linear-gradient(225deg, transparent 15px, var(--paper-aged) 0)',
        boxShadow: 'inset 0 0 10px rgba(201,168,76,0.2)'
      }}
    >
      {/* Corner Fold Effect */}
      <div className="absolute top-0 right-0 w-[21px] h-[21px] bg-gold-ancient/40 z-30" style={{ background: 'linear-gradient(225deg, transparent 50%, rgba(201,168,76,0.4) 50%)', boxShadow: '-1px 1px 2px rgba(0,0,0,0.1)' }}></div>

      {/* Background Image */}
      {/* Background Image Container with vignette overlay */}
      <div className="absolute top-0 left-0 right-0 bottom-16 overflow-hidden mx-1 mt-1 rounded-sm shadow-[inset_0_0_30px_rgba(26,20,16,0.8)] z-10 border border-gold-dim/10">
        <img
          src={imageUrl}
          alt={comic.name}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.8] group-hover:brightness-100 sepia-[0.3] group-hover:sepia-[0.1]"
          style={{ mixBlendMode: 'multiply' }}
        />
        {/* Ink blur vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(26,20,16,0.8)_100%)] pointer-events-none"></div>
      </div>
      
      {/* Red Wax Seal Badge for Hot (we'll just use sub_docquyen or always show for demonstration) */}
      {comic.sub_docquyen && (
        <div className="absolute -top-1 -left-1 w-8 h-8 rounded-full bg-blood-sect shadow-[0_2px_4px_rgba(139,32,32,0.6),inset_0_-2px_4px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.3)] z-40 flex items-center justify-center transform rotate-[-15deg] group-hover:rotate-0 transition-transform">
           <span className="text-[8px] font-black text-[#e8dbbf] font-[family-name:var(--font-heading)] uppercase">Hot</span>
        </div>
      )}
      
      {/* Content Placed on Parchment bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 p-2 flex flex-col justify-center z-20 bg-paper-aged bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] border-t border-gold-dim/30">
        {/* Badges Hub */}
        <div className="absolute top-0 right-0 p-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 origin-top-right scale-90 group-hover:scale-100">
           {comic.status === 'completed' && (
             <div className="relative overflow-hidden border border-jade-green/50 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] bg-paper-aged px-2 py-1 shadow-sm">
               <span className="relative z-10 text-[9px] font-black uppercase tracking-widest text-jade-green drop-shadow-sm font-[family-name:var(--font-heading)]">Hoàn</span>
             </div>
          )}
        </div>

        <div className="space-y-1 pl-1 border-l-[3px] border-blood-sect/60 group-hover:border-blood-sect transition-colors">
           <h3 className="font-bold text-ink-black text-[12px] md:text-[14px] leading-tight line-clamp-2 transition-colors group-hover:text-blood-sect font-[family-name:var(--font-heading)] pr-1">
            {comic.name}
          </h3>
          
          <div className="flex justify-between items-center pr-1">
            {latestChapter && (
               <span className="text-[10px] md:text-[11px] font-black text-ink-deep bg-gold-ancient/20 px-1 py-0.5 rounded-[1px] uppercase tracking-tighter shrink-0 font-[family-name:var(--font-heading)] border border-gold-dim/30">
                Ch. {latestChapter}
              </span>
            )}
            <span className="text-[9px] text-ink-deep/60 font-bold italic opacity-70">
              {comic.updatedAt ? new Date(comic.updatedAt).toLocaleDateString('vi-VN') : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Decorative Corner Trim */}

    </Link>
  );
}
