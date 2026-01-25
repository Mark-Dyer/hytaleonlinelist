'use client';

import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { trackEvent } from '@/components/analytics';

const categories = [
  { name: 'Survival', slug: 'survival' },
  { name: 'PvP', slug: 'pvp' },
  { name: 'Creative', slug: 'creative' },
  { name: 'RPG', slug: 'rpg' },
  { name: 'Minigames', slug: 'minigames' },
  { name: 'Adventure', slug: 'adventure' },
  { name: 'Modded', slug: 'modded' },
];

const resources = [
  { name: 'All Servers', href: '/servers' },
  { name: 'Add Server', href: '/servers/add' },
  { name: 'FAQ', href: '/faq' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const legal = [
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Privacy Policy', href: '/privacy' },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Gamepad2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                Hytale<span className="text-primary">Online</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              The best place to discover and share Hytale servers. Find your perfect
              server and join thousands of players today.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 font-semibold">Categories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/servers/${category.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => trackEvent('footer_link_clicked', { section: 'categories', link: category.slug })}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 font-semibold">Resources</h3>
            <ul className="space-y-2">
              {resources.map((resource) => (
                <li key={resource.href}>
                  <Link
                    href={resource.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => trackEvent('footer_link_clicked', { section: 'resources', link: resource.href })}
                  >
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 font-semibold">Legal</h3>
            <ul className="space-y-2">
              {legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() => trackEvent('footer_link_clicked', { section: 'legal', link: item.href })}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Hytale Online List. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Not affiliated with Hypixel Studios or Hytale.
          </p>
        </div>
      </div>
    </footer>
  );
}
