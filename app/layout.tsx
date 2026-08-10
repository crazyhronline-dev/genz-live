import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://genz-live.com'),
  title: 'GenZ Live | The Voice of GenZ — Digital News & Media Platform',
  description: 'GenZ Live is a global digital news and media platform covering World, India, Technology, AI, Business, Markets, Entertainment, Sports, Culture and Trending news for the new generation.',
  keywords: ['GenZ Live', 'The Voice of GenZ', 'Technology News', 'AI News', 'India News', 'World News', 'Business', 'Markets', 'Trending'],
  authors: [{ name: 'GenZ Live Media' }],
  openGraph: {
    title: 'GenZ Live | The Voice of GenZ',
    description: 'Global digital news and media platform covering World, India, Technology, AI, Business, Markets, Entertainment, Sports, Culture and Trending news.',
    url: 'https://genz-live.com',
    siteName: 'GenZ Live',
    images: [
      {
        url: '/brand/MASTER_SQUARE_2000x2000.png',
        width: 1200,
        height: 1200,
        alt: 'GenZ Live Master Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/brand/08_Website_Logo_300x100.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${jakarta.variable}`}>
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans selection:bg-purple-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
