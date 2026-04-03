import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';

const inter = Inter({ subsets: ['latin', 'vietnamese'], weight: ['300', '400', '500', '600', '700', '900'] });

export const metadata: Metadata = {
  title: 'HTruyen - Đọc truyện tranh webtoon miễn phí',
  description: 'Nền tảng đọc truyện tranh miễn phí chất lượng cao, cập nhật nhanh chóng & giao diện siêu mượt.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col antialiased selection:bg-accent selection:text-white bg-primary-bg`}>
        <Providers>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
