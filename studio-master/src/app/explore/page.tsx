
'use client';

import { useState } from "react";
import { MovieCard } from "@/components/movie-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Movie } from "@/lib/types";
import { motion } from 'framer-motion';
import { Search } from "lucide-react";
import { allMovies } from "@/lib/movie-data";

const genres = ['All', 'Science Fiction', 'Action', 'Comedy', 'Drama', 'Horror', 'Thriller', 'Adventure', 'Animation', 'History', 'Crime', 'Romance'];
const years = ['All', '2024', '2023', '2020s', '2010s', '2000s', '1990s', '1970s'];

export default function ExplorePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [genre, setGenre] = useState("All");
    const [year, setYear] = useState("All");
    const [rating, setRating] = useState(0);

    const filteredMovies = allMovies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRating = movie.vote_average >= rating;
        const matchesGenre = genre === 'All' || movie.genres.includes(genre);

        const movieYear = new Date(movie.release_date).getFullYear();
        const matchesYear = year === 'All' || 
            (year === '2020s' && movieYear >= 2020 && movieYear < 2030) ||
            (year === '2010s' && movieYear >= 2010 && movieYear < 2020) ||
            (year === '2000s' && movieYear >= 2000 && movieYear < 2010) ||
            (year === '1990s' && movieYear >= 1990 && movieYear < 2000) ||
            (year === '1970s' && movieYear >= 1970 && movieYear < 1980) ||
            (movieYear.toString() === year);

        return matchesSearch && matchesRating && matchesGenre && matchesYear;
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-headline font-bold mb-8 text-center"
            >
                Explore the Collection
            </motion.h1>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 p-6 bg-card/50 backdrop-blur-sm rounded-lg border border-primary/20"
            >
                <div className="relative md:col-span-4">
                    <Input
                        placeholder="Search by movie, mood, or genre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-primary/50 focus:border-accent focus:ring-accent pl-10 h-12"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold">Genre</Label>
                     <Select value={genre} onValueChange={setGenre}>
                        <SelectTrigger className="bg-secondary/50 border-primary/30"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {genres.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold">Release Year</Label>
                    <Select value={year} onValueChange={setYear}>
                        <SelectTrigger className="bg-secondary/50 border-primary/30"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-2 flex flex-col gap-2">
                    <Label className="text-sm font-semibold">Minimum Rating: <span className="text-accent font-bold">{rating.toFixed(1)}</span></Label>
                    <Slider
                        min={0}
                        max={10}
                        step={0.1}
                        value={[rating]}
                        onValueChange={(value) => setRating(value[0])}
                    />
                </div>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredMovies.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>

            {filteredMovies.length === 0 && (
                <div className="text-center col-span-full py-16">
                    <p className="text-muted-foreground text-lg">No movies match your criteria.</p>
                </div>
            )}
        </div>
    );
}
