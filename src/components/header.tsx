
'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { LogIn, Mic, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Link from 'next/link';
import { useAuth } from './auth-provider';

export function Header() {
  const { user, signIn, loading } = useAuth();
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
        <SidebarTrigger />
      
      <div className="relative ml-auto flex-1 md:grow-0 max-w-sm w-full">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-full bg-muted pl-8 pr-10"
        />
        <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full">
          <Mic className="h-4 w-4" />
        </Button>
      </div>

      {loading ? (
        <div className="h-9 w-24 bg-muted rounded-md animate-pulse" />
      ) : user ? (
        <Link href="/profile" passHref>
          <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className='h-9 w-9'>
                  <AvatarImage src={user.photoURL || `https://placehold.co/40x40.png`} alt={user.displayName || "User"} data-ai-hint="user avatar"/>
                  <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
              </Avatar>
          </Button>
        </Link>
      ) : (
        <Button onClick={signIn}>
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      )}
    </header>
  );
}
