'use client';

import { useSearchParams } from 'next/navigation';
import { MovieCard } from "@/components/movie-card";
import { allMovies } from "@/lib/movie-data";
import { Suspense } from 'react';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || "";

  const searchResults = query ? allMovies.filter(movie => 
    movie.title.toLowerCase().includes(query.toLowerCase())
  ) : [];

  return (
    <>
      <h1 className="text-4xl font-headline font-bold mb-8">
        Search Results for <span className="text-primary">&quot;{query}&quot;</span>
      </h1>
      
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {searchResults.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
      ) : (
        <div className="text-center col-span-full py-16">
            <p className="text-muted-foreground text-lg">No movies found for &quot;{query}&quot;.</p>
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading search results...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
