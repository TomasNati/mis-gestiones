import * as React from 'react';
import { Layout } from '@/components/Layout/Layout';
import { SpeedInsights } from '@vercel/speed-insights/next';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';

export const metadata = {
  title: 'Mis gestiones',
  description: 'Mis gestiones diarias',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <Layout>{children}</Layout>
        </ThemeRegistry>
        <SpeedInsights />
      </body>
    </html>
  );
}
