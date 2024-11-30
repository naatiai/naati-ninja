// app/layout.tsx
import '../styles/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Anek_Bangla } from 'next/font/google';
import { PHProvider } from './providers';
import dynamic from 'next/dynamic';

const anek = Anek_Bangla({
  subsets: ['latin'],
  display: 'swap',
});

let title = 'NAATI Ninja | Master Your NAATI CCL Exam with the best Mock Tests';
let description = 'Your NAATI CCL Test Companion';
let ogimage = 'https://naatininja.com/og-image.png';
let url = 'https://naatininja.com';
let sitename = 'naatininja.com';

const PostHogPageView = dynamic(() => import('./PostHogPageView'), {
  ssr: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={anek.className}>
        <PHProvider>
          <body>
            <PostHogPageView />
            {children}
          </body>
        </PHProvider>
      </html>
    </ClerkProvider>
  );
}
