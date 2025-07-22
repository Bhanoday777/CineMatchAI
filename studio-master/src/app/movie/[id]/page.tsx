
'use client';

import { useState, useEffect, use } from 'react';
import Image from "next/image";
import { Star, Clock, Calendar, Film, Heart, CheckCircle, Loader2, Play, VideoOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MovieCarousel } from "@/components/movie-carousel";
import { allMovies } from '@/lib/movie-data';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { addMovieToList, removeMovieFromList, isMovieInList } from '@/lib/firestore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Movie } from "@/lib/types";


export default function MovieDetailPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const { toast } = useToast();
    const { user } = useAuth();
    
    const movieId = parseInt(id, 10);
    const movieDetails = allMovies.find(m => m.id === movieId);
    
    const [isFavorite, setIsFavorite] = useState(false);
    const [isWatched, setIsWatched] = useState(false);
    const [loading, setLoading] = useState({ fav: false, watch: false, check: true });
    
    useEffect(() => {
        if (!user || !movieDetails) return;

        const checkIfInLists = async () => {
            setLoading(prev => ({ ...prev, check: true }));
            const fav = await isMovieInList(user.uid, 'favorites', movieDetails.id);
            const watched = await isMovieInList(user.uid, 'watched', movieDetails.id);
            setIsFavorite(fav);
            setIsWatched(watched);
            setLoading(prev => ({ ...prev, check: false }));
        };

        checkIfInLists();
    }, [user, movieDetails]);


    const similarMovies = allMovies.filter(m => m.genres.some(g => movieDetails?.genres.includes(g)) && m.id !== movieDetails?.id).slice(0, 10);

    const handleToggleFavorite = async () => {
        if (!user || !movieDetails) {
            toast({ variant: 'destructive', title: 'Login Required', description: 'Please log in to add movies to your list.'});
            return;
        }
        setLoading(prev => ({ ...prev, fav: true }));
        try {
            if (isFavorite) {
                await removeMovieFromList(user.uid, 'favorites', movieDetails.id);
                toast({ title: 'Removed from Favorites' });
            } else {
                await addMovieToList(user.uid, 'favorites', movieDetails.id);
                toast({ title: 'Added to Favorites!' });
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not update your list.'});
        } finally {
            setLoading(prev => ({ ...prev, fav: false }));
        }
    }

    const handleToggleWatched = async () => {
        if (!user || !movieDetails) {
            toast({ variant: 'destructive', title: 'Login Required', description: 'Please log in to mark movies as watched.'});
            return;
        }
        setLoading(prev => ({ ...prev, watch: true }));
         try {
            if (isWatched) {
                await removeMovieFromList(user.uid, 'watched', movieDetails.id);
                toast({ title: 'Removed from Watch History' });
            } else {
                await addMovieToList(user.uid, 'watched', movieDetails.id);
                toast({ title: 'Marked as Watched!' });
            }
            setIsWatched(!isWatched);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not update your list.'});
        } finally {
            setLoading(prev => ({ ...prev, watch: false }));
        }
    }

    if (!movieDetails) {
        return <div className="text-center py-16">Movie not found.</div>;
    }

    const VideoPlayerDialog = ({ trigger, title, videoId }: { trigger: React.ReactNode, title: string, videoId: string }) => (
         <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="bg-black border-primary/50 max-w-3xl p-0">
                <DialogHeader className="p-4">
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="aspect-video">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        allowFullScreen>
                    </iframe>
                </div>
            </DialogContent>
        </Dialog>
    );

    const UnavailableDialog = ({ trigger }: { trigger: React.ReactNode }) => (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="bg-card border-primary/50 max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <VideoOff className="text-destructive"/>
                        Trailer Unavailable
                    </DialogTitle>
                     <DialogDescription className="pt-4 text-left">
                        We couldn&apos;t find a trailer for this movie. Please check back later.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );


    return (
        <div className="text-white">
            <div className="relative h-[60vh] w-full">
                <Image
                    src={movieDetails.backdrop_path}
                    alt={movieDetails.title}
                    fill
                    className="object-cover opacity-20"
                    data-ai-hint="movie scene"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>

            <div className="container mx-auto -mt-48 relative z-10 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    <div className="md:col-span-1">
                        <Image
                            src={movieDetails.poster_path}
                            alt={movieDetails.title}
                            width={790}
                            height={1000}
                            className="rounded-xl shadow-2xl shadow-primary/20 border-2 border-primary/50 object-cover"
                            data-ai-hint={`${movieDetails.title} poster`}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <h1 className="text-4xl md:text-6xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-white">{movieDetails.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 mt-4 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-accent" />
                                <span className="text-xl font-bold text-white">{movieDetails.vote_average.toFixed(1)}</span>
                            </div>
                            <Separator orientation="vertical" className="h-6" />
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                <span>{`${Math.floor(movieDetails.runtime / 60)}h ${movieDetails.runtime % 60}m`}</span>
                            </div>
                            <Separator orientation="vertical" className="h-6" />
                             <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                <span>{new Date(movieDetails.release_date).getFullYear()}</span>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {movieDetails.genres.map(genre => (
                                <Badge key={genre} variant="secondary">{genre}</Badge>
                            ))}
                        </div>

                        <p className="mt-8 text-lg text-primary-foreground/80">{movieDetails.overview}</p>

                        <div className="mt-8">
                            <h3 className="text-xl font-headline font-semibold mb-2">Cast</h3>
                            <p className="text-muted-foreground">{movieDetails.cast.join(', ')}</p>
                        </div>

                         <div className="mt-8 flex flex-wrap gap-4">
                             {movieDetails.trailer_url ? (
                                <VideoPlayerDialog 
                                    trigger={
                                        <Button size="lg" variant="outline">
                                            <Play className="mr-2 h-5 w-5"/> Watch Trailer
                                        </Button>
                                    }
                                    title={`${movieDetails.title} - Trailer`}
                                    videoId={movieDetails.trailer_url}
                                />
                            ) : (
                                <UnavailableDialog 
                                    trigger={
                                        <Button size="lg" variant="outline">
                                            <Play className="mr-2 h-5 w-5"/> Watch Trailer
                                        </Button>
                                    }
                                />
                            )}
                            
                             <Button size="lg" variant={isFavorite ? "default" : "outline"} onClick={handleToggleFavorite} disabled={loading.fav || loading.check}>
                                {loading.fav ? <Loader2 className="animate-spin" /> : <Heart className="mr-2 h-5 w-5"/>}
                                {isFavorite ? 'In My List' : 'Add to My List'}
                            </Button>
                             <Button size="lg" variant={isWatched ? "secondary" : "outline"} onClick={handleToggleWatched} disabled={loading.watch || loading.check}>
                                {loading.watch ? <Loader2 className="animate-spin" /> : <CheckCircle className="mr-2 h-5 w-5"/>}
                                {isWatched ? 'Watched' : 'Mark as Watched'}
                            </Button>
                        </div>
                    </div>
                </div>
                 <div className="mt-16">
                    <MovieCarousel title="Similar Movies" movies={similarMovies} />
                </div>
            </div>
        </div>
    );
}
