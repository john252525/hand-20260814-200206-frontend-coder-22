import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/lib/providers/query-provider';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { CommandPalette } from '@/components/layout/command-palette';
import { Hotkeys } from '@/components/layout/hotkeys';
import { RealtimeProvider } from '@/components/providers/realtime-provider';
import { ErrorBoundary } from '@/components/error-boundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Тендерный Конвейер',
  description: 'Автоматизированная система управления тендерами',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ErrorBoundary>
            <QueryProvider>
              <RealtimeProvider>
                {children}
                <CommandPalette />
                <Hotkeys />
                <Toaster richColors position="top-right" />
              </RealtimeProvider>
            </QueryProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}