import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileQuestion, Home, Server } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center py-12 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <FileQuestion className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="mb-2 text-2xl font-bold">Page Not Found</h1>
          <p className="mb-6 text-muted-foreground">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/">
              <Button className="gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </Link>
            <Link href="/servers">
              <Button variant="outline" className="gap-2">
                <Server className="h-4 w-4" />
                Browse Servers
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
