'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Film, Search, UserCircle, Menu, X, LogOut, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore' },
  ];

  if (user) {
      navLinks.push({ href: '/profile', label: 'Profile' });
  }

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchQuery = formData.get('search') as string;
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
    router.push('/');
  }

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Film className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold font-headline text-white">CineMatch AI</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={cn(
                "transition-colors hover:text-primary font-medium",
                pathname === link.href ? "text-primary" : "text-white"
            )}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Input name="search" type="search" placeholder="Search..." className="h-9 w-40 lg:w-64 pr-8 bg-black/20" />
              <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </form>
          {user ? (
            <>
              <Link href="/profile">
                  <Avatar className="h-8 w-8 cursor-pointer border-2 border-transparent hover:border-primary transition-colors">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                      <AvatarFallback>{user.displayName?.[0] || <UserCircle className="h-5 w-5" />}</AvatarFallback>
                  </Avatar>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
                  <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button asChild variant="outline">
                <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden bg-background border-t border-border"
          >
            <nav className="flex flex-col items-start gap-4 p-4">
              {navLinks.map((link) => (
                 <Link key={link.href} href={link.href} className={cn(
                    "transition-colors hover:text-primary w-full p-2 rounded-md",
                    pathname === link.href ? "text-primary bg-primary/10" : "text-white"
                 )} onClick={() => setIsMobileMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
               <form onSubmit={handleSearch} className="w-full px-2">
                <div className="relative w-full">
                  <Input name="search" type="search" placeholder="Search..." className="h-9 w-full pr-8 bg-black/20" />
                  <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
               </form>
              <div className="w-full px-2 mt-2">
                 {user ? (
                    <Button variant="destructive" onClick={handleLogout} className="w-full">
                        <LogOut className="mr-2" /> Logout
                    </Button>
                 ) : (
                    <Button asChild className="w-full" variant="outline">
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                            <LogIn className="mr-2" /> Login
                        </Link>
                    </Button>
                 )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
