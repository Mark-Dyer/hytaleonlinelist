import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navbar, Footer } from '@/components/layout';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Hytale Online List - Find the Best Hytale Servers',
    template: '%s | Hytale Online List',
  },
  description:
    'Discover and join the best Hytale servers. Browse survival, PvP, RPG, minigames, and more. Vote for your favorites and find your perfect server.',
  keywords: [
    'Hytale',
    'Hytale servers',
    'Hytale server list',
    'Hytale multiplayer',
    'Hytale survival',
    'Hytale PvP',
  ],
  openGraph: {
    title: 'Hytale Online List - Find the Best Hytale Servers',
    description:
      'Discover and join the best Hytale servers. Browse survival, PvP, RPG, minigames, and more.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Hytale Online List',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hytale Online List - Find the Best Hytale Servers',
    description:
      'Discover and join the best Hytale servers. Browse survival, PvP, RPG, minigames, and more.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
