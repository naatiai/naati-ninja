import '../styles/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Anek_Bangla } from 'next/font/google';
import { PHProvider } from './providers';
import dynamic from 'next/dynamic';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

const anek = Anek_Bangla({
  subsets: ['latin'],
  display: 'swap',
});

const title =
  'NAATI Ninja | Master Your NAATI CCL Exam with the Best Mock Tests';
const description =
  'NAATI Ninja is your ultimate companion for NAATI CCL preparation. Ace your test with high-quality mock tests, AI-driven feedback, and real-time grading.';
const ogImage = '/logo.png'; // '/images/og-image.png';
const favicon = '/favicon.ico';
const appleTouchIcon = '/favicons/apple-touch-icon.png';
const favicon32 = '/favicons/favicon-32x32.png';
const favicon16 = '/favicons/favicon-16x16.png';
const manifest = '/site.webmanifest';
const url = 'https://app.naatininja.com';
const siteName = 'NAATI Ninja';

const PostHogPageView = dynamic(() => import('./PostHogPageView'), {
  ssr: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: favicon,
  },
  openGraph: {
    title,
    description,
    url,
    siteName,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [ogImage],
  },
  keywords: [
    'NAATI CCL',
    'NAATI Ninja',
    'NAATI CCL exam preparation',
    'NAATI mock tests',
    'NAATI AI grading',
    'NAATI CCL test companion',
    'NAATI practice platform',
    'CCL exam tips',
    'NAATI online test prep',
    'Australia PR',
    '5 Points',
  ],
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
          <head>
            {/* GA */}
            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-Y1EMQE876X"
            ></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-Y1EMQE876X');
              `,
              }}
            />

            {/* Primary Meta Tags */}
            <meta name="title" content={String(title)} />
            <meta name="description" content={String(description)} />
            <meta
              name="keywords"
              content={
                Array.isArray(metadata.keywords)
                  ? metadata.keywords.join(', ')
                  : String(metadata.keywords || '')
              }
            />
            <meta name="author" content="NAATI Ninja" />
            <meta name="robots" content="index, follow" />
            <meta
              name="viewport"
              content={String('width=device-width, initial-scale=1')}
            />

            {/* Favicon */}
            <link rel="icon" href={favicon} />
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href={appleTouchIcon}
            />
            <link rel="icon" type="image/png" sizes="32x32" href={favicon32} />
            <link rel="icon" type="image/png" sizes="16x16" href={favicon16} />
            <link rel="manifest" href={manifest} />

            {/* Open Graph Meta Tags */}
            <meta property="og:type" content="website" />
            <meta
              property="og:title"
              content={String(metadata.openGraph?.title || '')}
            />
            <meta
              property="og:description"
              content={String(metadata.openGraph?.description || '')}
            />
            <meta
              property="og:url"
              content={String(metadata.openGraph?.url || '')}
            />
            <meta
              property="og:site_name"
              content={String(metadata.openGraph?.siteName || '')}
            />
            <meta property="og:image" content={ogImage || ''} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta
              property="og:image:alt"
              content="NAATI Ninja - Master Your NAATI CCL Exam"
            />
            <meta property="og:image:type" content="image/png" />

            {/* Additional SEO Enhancements */}
            <link rel="canonical" href={url} />
          </head>
          <body>
            <PostHogPageView />
            {children}

            {/* VERCEL ANALYTICS */}
            <SpeedInsights />
            <Analytics />
          </body>
        </PHProvider>
      </html>
    </ClerkProvider>
  );
}
