
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Tilt } from 'react-tilt';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { Movie } from '@/lib/types';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
}

const tiltOptions = {
  max: 15,
  speed: 400,
  scale: 1.05,
  glare: true,
  'max-glare': 0.2,
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function MovieCard({ movie }: MovieCardProps) {
  const isHighlyRated = movie.vote_average > 8.0;

  return (
    <motion.div variants={cardVariants}>
      <Tilt options={tiltOptions}>
        <div className={cn(
            "group relative overflow-hidden rounded-xl transition-all duration-300 bg-card/50 backdrop-blur-sm border border-white/10 shadow-lg aspect-[2/3]",
            isHighlyRated && "animate-pulse-glow border-accent/50"
          )}>
          <Link href={`/movie/${movie.id}`} className="block h-full">
            <Image
              src={movie.poster_path}
              alt={movie.title}
              width={790}
              height={1000}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              data-ai-hint={`${movie.title} poster`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="text-lg font-headline font-bold text-white group-hover:text-primary transition-colors">{movie.title}</h3>
              <div className="flex items-center mt-1">
                <Star className="w-4 h-4 text-accent fill-accent" />
                <span className="ml-1 text-white text-sm font-bold">{movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
            <Badge variant="secondary" className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm">{new Date(movie.release_date).getFullYear()}</Badge>
          </Link>
        </div>
      </Tilt>
    </motion.div>
  );
}
