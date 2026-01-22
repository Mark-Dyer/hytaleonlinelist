'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Server,
  Users,
  ScrollText,
  Shield,
  FileCheck,
  Settings,
  Database,
} from 'lucide-react';

const navItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'MODERATOR'],
  },
  {
    href: '/admin/servers',
    label: 'Servers',
    icon: Server,
    roles: ['ADMIN', 'MODERATOR'],
  },
  {
    href: '/admin/users',
    label: 'Users',
    icon: Users,
    roles: ['ADMIN', 'MODERATOR'],
  },
  {
    href: '/admin/claims',
    label: 'Claims',
    icon: FileCheck,
    roles: ['ADMIN', 'MODERATOR'],
  },
  {
    href: '/admin/audit-log',
    label: 'Audit Log',
    icon: ScrollText,
    roles: ['ADMIN'],
  },
  {
    href: '/admin/import',
    label: 'Data Import',
    icon: Database,
    roles: ['ADMIN'],
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: Settings,
    roles: ['ADMIN'],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const filteredItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border p-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Shield className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold">Admin Panel</span>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border p-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}
