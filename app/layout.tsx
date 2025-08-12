import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';
import './globals.css';
import AppProviders from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';

const raleway = Raleway({
  variable: '--font-raleway',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Task Manager',
    default: 'Task Manager — Organize Your Work Efficiently',
  },
  description:
    'A modern task management app to help you track, prioritize, and complete your tasks seamlessly.',
  keywords: ['task management', 'productivity', 'todo', 'organization'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${raleway.variable} antialiased`}>
        <AppProviders>{children}</AppProviders>
        <Toaster />
      </body>
    </html>
  );
}
