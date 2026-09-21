import * as React from 'react';
import { Layout } from '@/components/Layout/Layout';
import { SpeedInsights } from '@vercel/speed-insights/next';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';
import ClientProviders from '@/components/Providers/ClientProviders';
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import '../components/ThemeRegistry/theme-tokens.css';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '500', '600'],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500', '600'],
});

export const metadata = {
  title: 'Mis gestiones',
  description: 'Mis gestiones diarias',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <ThemeRegistry>
          <ClientProviders>
            <Layout>{children}</Layout>
          </ClientProviders>
        </ThemeRegistry>
        <SpeedInsights />
      </body>
    </html>
  );
}
