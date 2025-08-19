import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';
import './globals.css';
import AppProviders from '@/components/providers';

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
  metadataBase: new URL('https://task-management-app.example.com'),
  openGraph: {
    title: 'Task Manager — Organize Your Work Efficiently',
    description:
      'Track, prioritize, and complete your tasks seamlessly with a modern task management app.',
    url: 'https://task-management-app.example.com',
    siteName: 'Task Manager',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'Task Manager Logo' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Task Manager — Organize Your Work Efficiently',
    description:
      'Track, prioritize, and complete your tasks seamlessly with a modern task management app.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${raleway.variable} antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
