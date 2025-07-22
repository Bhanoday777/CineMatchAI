
'use client';

import { motion } from 'framer-motion';
import type { Movie } from '@/lib/types';
import { MovieCard } from '@/components/movie-card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export function MovieCarousel({ title, movies }: MovieCarouselProps) {
  return (
    <motion.section 
      className="py-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: 0.2 }}
    >
      <motion.h2 
        variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
        className="text-3xl font-headline font-bold mb-6 text-white relative inline-block"
      >
        {title}
        <span className="absolute -bottom-1 left-0 w-1/2 h-1 bg-primary"></span>
      </motion.h2>
      <ScrollArea>
        <motion.div
          className="flex space-x-6 pb-4"
          variants={containerVariants}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="w-56 sm:w-64 md:w-72 shrink-0">
               <MovieCard movie={movie} />
            </div>
          ))}
        </motion.div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </motion.section>
  );
}
