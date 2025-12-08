import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { SmoothScroll } from '@/components/providers/smooth-scroll';
import LayoutWrapper from '@/components/layout-wrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VidioX AI - AI-Powered Video Enhancement',
  description: 'Transform your low-quality videos into stunning HD and 4K with our AI-powered video enhancement technology.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <SmoothScroll>
              <LayoutWrapper>{children}</LayoutWrapper>

            </SmoothScroll>
            <SonnerToaster visibleToasts={4} expand={true} />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html >
  );
}