import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navbar, Footer } from '@/components/layout';
import { JsonLd, createOrganizationSchema, createWebSiteSchema } from '@/components/seo/JsonLd';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const year = new Date().getFullYear();
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hytaleonlinelist.com';

export const metadata: Metadata = {
  title: {
    default: `Hytale Server List ${year} - Find the Best Hytale Servers`,
    template: '%s | Hytale Online List',
  },
  description: `Discover and join the best Hytale servers in ${year}. Browse 100+ survival, PvP, RPG, minigames, and more. Vote for your favorites and find your perfect server.`,
  keywords: [
    'Hytale',
    'Hytale servers',
    'Hytale server list',
    'Hytale multiplayer',
    'Hytale survival',
    'Hytale PvP',
    `Hytale servers ${year}`,
    'best Hytale servers',
  ],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: `Hytale Server List ${year} - Find the Best Hytale Servers`,
    description: `Discover and join the best Hytale servers in ${year}. Browse survival, PvP, RPG, minigames, and more.`,
    type: 'website',
    locale: 'en_US',
    siteName: 'Hytale Online List',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: `Hytale Server List ${year} - Find the Best Hytale Servers`,
    description: `Discover and join the best Hytale servers in ${year}. Browse survival, PvP, RPG, minigames, and more.`,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <JsonLd data={createOrganizationSchema()} />
        <JsonLd data={createWebSiteSchema()} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
