import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Gamepad2, ArrowLeft, Home } from 'lucide-react';

export default function CategoryNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center py-12 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <Gamepad2 className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="mb-2 text-2xl font-bold">Category Not Found</h1>
          <p className="mb-6 text-muted-foreground">
            The category you're looking for doesn't exist.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/servers">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                All Servers
              </Button>
            </Link>
            <Link href="/">
              <Button className="gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
