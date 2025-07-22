
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { MovieCarousel } from "@/components/movie-carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Movie } from "@/lib/types";
import { Settings, LogOut, User, Loader2 } from "lucide-react";
import { PersonalizedSuggestions } from '@/components/personalized-suggestions';
import { getUserMovieList } from '@/lib/firestore';


// Mock user data, to be replaced by auth user
const userDetails = {
    favoriteGenres: ["Sci-Fi", "Thriller", "Animation"],
};

export default function ProfilePage() {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();
    const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
    const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);
    const [listLoading, setListLoading] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            const fetchLists = async () => {
                setListLoading(true);
                const favs = await getUserMovieList(user.uid, 'favorites');
                const watched = await getUserMovieList(user.uid, 'watched');
                setFavoriteMovies(favs);
                setWatchedMovies(watched);
                setListLoading(false);
            };
            fetchLists();
        }
    }, [user]);

    if (loading || !user) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    const handleLogout = async () => {
        await signOut();
        router.push('/');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 bg-card/50 backdrop-blur-sm p-8 rounded-xl border border-primary/20">
                <Avatar className="h-32 w-32 border-4 border-primary shadow-lg shadow-primary/30 flex-shrink-0">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} data-ai-hint="futuristic portrait"/>
                    <AvatarFallback><User className="h-16 w-16" /></AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left flex-grow">
                    <h1 className="text-4xl font-headline font-bold">{user.displayName || "Anonymous User"}</h1>
                    <p className="text-muted-foreground mt-1">{user.email}</p>
                    <p className="text-sm text-muted-foreground mt-2">Joined on {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}</p>
                    <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                        {userDetails.favoriteGenres.map(genre => (
                            <Badge key={genre} variant="secondary" className="bg-primary/20 text-primary-foreground/80 border-primary/30">{genre}</Badge>
                        ))}
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon"><Settings /></Button>
                    <Button variant="destructive" size="icon" onClick={handleLogout}><LogOut /></Button>

                </div>
            </div>

            <PersonalizedSuggestions favoriteMovies={favoriteMovies} watchedMovies={watchedMovies} />
            
            <Separator className="my-12 bg-border/50" />

            {listLoading ? (
                 <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <>
                    <MovieCarousel title="My Favorite Movies" movies={favoriteMovies} />
                    <MovieCarousel title="Watched History" movies={watchedMovies} />
                </>
            )}
        </div>
    );
}
