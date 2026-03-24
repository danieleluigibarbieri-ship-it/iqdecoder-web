import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'IQDecoder - Test del Quoziente Intellettivo',
  description: 'Scopri il tuo IQ con un test scientifico di 5 domande. Ottieni il punteggio immediato e sblocca il report completo.',
  keywords: ['IQ test', 'quoziente intellettivo', 'test cognitivo', 'valutazione IQ'],
  openGraph: {
    title: 'IQDecoder - Test del Quoziente Intellettivo',
    description: 'Scopri il tuo IQ con un test scientifico di 5 domande.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${inter.className} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
