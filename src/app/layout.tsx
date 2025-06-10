import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Wellingborough.ai - Your Local Business AI Platform',
    template: '%s | Wellingborough.ai'
  },
  description: 'Discover local businesses, events, and community news in Wellingborough with our AI-powered platform. Connect with your community like never before.',
  keywords: [
    'Wellingborough',
    'local business',
    'community',
    'events',
    'AI',
    'business directory',
    'leaflet distribution',
    'local news',
    'Northamptonshire'
  ],
  authors: [{ name: 'Wellingborough.ai Team' }],
  creator: 'Wellingborough.ai',
  publisher: 'Wellingborough.ai',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://wellingborough.ai'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'Wellingborough.ai',
    title: 'Wellingborough.ai - Your Local Business AI Platform',
    description: 'Discover local businesses, events, and community news in Wellingborough with our AI-powered platform.',
    url: 'https://wellingborough.ai',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Wellingborough.ai - Connecting Local Business with AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@WellingboroughAI',
    creator: '@WellingboroughAI',
    title: 'Wellingborough.ai - Your Local Business AI Platform',
    description: 'Discover local businesses, events, and community news in Wellingborough with our AI-powered platform.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <Providers>
          <div className="flex min-h-full flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
} 