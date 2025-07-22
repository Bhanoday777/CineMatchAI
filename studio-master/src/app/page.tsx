'use client';

import { AiRecommendation } from "@/components/ai-recommendation";
import { MovieCarousel } from "@/components/movie-carousel";
import { Button } from "@/components/ui/button";
import type { Movie } from "@/lib/types";
import { ArrowRight, Bot } from "lucide-react";
import Link from "next/link";
import { allMovies } from "@/lib/movie-data";

export default function Home() {
  // Use a subset of movies for each carousel for variety
  const popularMovies: Movie[] = allMovies.slice(0, 10);
  const trendingMovies: Movie[] = [...allMovies].sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime()).slice(0, 10);
  const topRatedMovies: Movie[] = [...allMovies].sort((a, b) => b.vote_average - a.vote_average).slice(0, 10);

  return (
    <div className="container mx-auto px-4">
      <section className="relative text-center py-20 rounded-xl overflow-hidden my-8 bg-transparent">
         <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-xl border border-primary/20"></div>
         <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom_1px_center" style={{maskImage: 'linear-gradient(to bottom, transparent, black, transparent)'}}></div>
         <div className="relative z-10 max-w-3xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-headline font-extrabold text-white neon-glow">
                Welcome to CineMatch AI
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80 max-w-xl mx-auto">
                Let our AI guide you to cinematic gems tailored to your taste and mood.
            </p>
             <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/explore">Explore Movies <ArrowRight className="ml-2" /></Link>
              </Button>
               <Button asChild size="lg" variant="outline">
                  <a href="#ai-oracle">Ask AI Assistant <Bot className="ml-2"/></a>
              </Button>
            </div>
         </div>
      </section>

      <section className="mb-12" id="ai-oracle">
        <AiRecommendation />
      </section>

      <MovieCarousel title="Popular Movies" movies={popularMovies} />
      <MovieCarousel title="Trending Now" movies={trendingMovies} />
      <MovieCarousel title="Top Rated Classics" movies={topRatedMovies} />

    </div>
  );
}
