'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Search,
  Menu,
  ChevronDown,
  Shield,
  ShieldAlert,
  Swords,
  Brush,
  Scroll,
  Gamepad2,
  Map,
  Puzzle,
  Plus,
  User,
  LogOut,
  Settings,
  Server,
  Loader2,
} from 'lucide-react';
import { authApi } from '@/lib/auth-api';

const categories = [
  { name: 'Survival', slug: 'survival', icon: Shield },
  { name: 'PvP', slug: 'pvp', icon: Swords },
  { name: 'Creative', slug: 'creative', icon: Brush },
  { name: 'RPG', slug: 'rpg', icon: Scroll },
  { name: 'Minigames', slug: 'minigames', icon: Gamepad2 },
  { name: 'Adventure', slug: 'adventure', icon: Map },
  { name: 'Modded', slug: 'modded', icon: Puzzle },
];

export function Navbar() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [registrationEnabled, setRegistrationEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    // Only check registration status if user is not authenticated
    if (!isAuthenticated && !isLoading) {
      const checkRegistrationStatus = async () => {
        try {
          const status = await authApi.getRegistrationStatus();
          setRegistrationEnabled(status.registrationEnabled);
        } catch {
          // If we can't check status, assume it's enabled
          setRegistrationEnabled(true);
        }
      };
      checkRegistrationStatus();
    }
  }, [isAuthenticated, isLoading]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getUserInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Gamepad2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                Hytale<span className="text-primary">Online</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-1 md:flex">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  Home
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1">
                    Servers
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/servers" className="cursor-pointer">
                      All Servers
                    </Link>
                  </DropdownMenuItem>
                  <div className="my-1 h-px bg-border" />
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <DropdownMenuItem key={category.slug} asChild>
                        <Link
                          href={`/servers/${category.slug}`}
                          className="flex cursor-pointer items-center gap-2"
                        >
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          {category.name}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/servers/add">
                <Button variant="ghost" size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Add Server
                </Button>
              </Link>
            </div>
          </div>

          {/* Search and Auth */}
          <div className="flex items-center gap-4">
            {/* Desktop Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search servers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-9"
              />
            </div>

            {/* Auth Buttons */}
            <div className="hidden items-center gap-2 md:flex">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={user.avatarUrl || undefined} alt={user.username} />
                        <AvatarFallback className="text-xs">
                          {getUserInitials(user.username)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="max-w-24 truncate">{user.username}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <Server className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/servers" className="cursor-pointer">
                        <Server className="mr-2 h-4 w-4" />
                        My Servers
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    {(user.role === 'ADMIN' || user.role === 'MODERATOR') && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer">
                            <ShieldAlert className="mr-2 h-4 w-4" />
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  {registrationEnabled === false ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            <Button size="sm" disabled>
                              Register
                            </Button>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Registration is currently disabled. Please check back later.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <Link href="/register">
                      <Button size="sm">Register</Button>
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-6 pt-6">
                  {/* Mobile Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search servers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  {/* Mobile Navigation */}
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="ghost" className="w-full justify-start">
                        Home
                      </Button>
                    </Link>
                    <Link
                      href="/servers"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="ghost" className="w-full justify-start">
                        All Servers
                      </Button>
                    </Link>
                    <Link
                      href="/servers/add"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <Plus className="h-4 w-4" />
                        Add Server
                      </Button>
                    </Link>
                  </div>

                  {/* Mobile Categories */}
                  <div className="flex flex-col gap-1">
                    <p className="px-4 text-sm font-semibold text-muted-foreground">
                      Categories
                    </p>
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <Link
                          key={category.slug}
                          href={`/servers/${category.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-2"
                          >
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            {category.name}
                          </Button>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Mobile Auth */}
                  <div className="flex flex-col gap-2 border-t border-border pt-4">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      </div>
                    ) : isAuthenticated && user ? (
                      <>
                        <div className="flex items-center gap-3 px-4 py-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatarUrl || undefined} alt={user.username} />
                            <AvatarFallback>{getUserInitials(user.username)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{user.username}</p>
                            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                        <Link
                          href="/profile"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Button variant="ghost" className="w-full justify-start gap-2">
                            <User className="h-4 w-4" />
                            Profile
                          </Button>
                        </Link>
                        <Link
                          href="/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Button variant="ghost" className="w-full justify-start gap-2">
                            <Server className="h-4 w-4" />
                            Dashboard
                          </Button>
                        </Link>
                        <Link
                          href="/dashboard/servers"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Button variant="ghost" className="w-full justify-start gap-2">
                            <Server className="h-4 w-4" />
                            My Servers
                          </Button>
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Button variant="ghost" className="w-full justify-start gap-2">
                            <Settings className="h-4 w-4" />
                            Settings
                          </Button>
                        </Link>
                        {(user.role === 'ADMIN' || user.role === 'MODERATOR') && (
                          <Link
                            href="/admin"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Button variant="ghost" className="w-full justify-start gap-2">
                              <ShieldAlert className="h-4 w-4" />
                              Admin Panel
                            </Button>
                          </Link>
                        )}
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Button variant="outline" className="w-full">
                            Sign In
                          </Button>
                        </Link>
                        {registrationEnabled === false ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="w-full">
                                  <Button className="w-full" disabled>
                                    Register
                                  </Button>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Registration is currently disabled. Please check back later.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <Link
                            href="/register"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Button className="w-full">Register</Button>
                          </Link>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
