import type { Metadata } from 'next';
import { Noto_Serif, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';

const notoSerif = Noto_Serif({ 
  subsets: ['latin', 'vietnamese'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-body-family',
});

const cormorantGaramond = Cormorant_Garamond({ 
  subsets: ['latin', 'vietnamese'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading-family',
});

export const metadata: Metadata = {
  title: 'HTruyen - Đọc truyện tranh webtoon miễn phí',
  description: 'Nền tảng đọc truyện tranh miễn phí chất lượng cao, cập nhật nhanh chóng & giao diện siêu mượt.',
};

import PageTransition from '@/components/Layout/PageTransition';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${notoSerif.variable} ${cormorantGaramond.variable} ${notoSerif.className} min-h-screen flex flex-col antialiased selection:bg-blood-sect selection:text-paper-warm bg-ink-black text-paper-warm`}>
        <Providers>
          <PageTransition>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </PageTransition>
        </Providers>
      </body>
    </html>
  );
}
