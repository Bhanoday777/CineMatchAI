
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Bot, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { getPersonalizedRecommendation } from '@/ai/flows/get-personalized-recommendation';
import { Button } from './ui/button';
import { Movie } from '@/lib/types';

interface PersonalizedSuggestionsProps {
  favoriteMovies: Movie[];
  watchedMovies: Movie[];
}

export function PersonalizedSuggestions({ favoriteMovies, watchedMovies }: PersonalizedSuggestionsProps) {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const onPersonalizedSubmit = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to get personalized recommendations.',
      });
      return;
    }
    setLoading(true);
    setRecommendation(null);
    try {
      const result = await getPersonalizedRecommendation({
        favoriteMovies: favoriteMovies.map(m => m.title),
        watchedMovies: watchedMovies.map(m => m.title),
      });
      setRecommendation(result.recommendation);
    } catch (error) {
       console.error(error);
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get AI recommendation. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-primary/20 text-center"
    >
        <h2 className="text-2xl font-headline font-bold mb-4 text-white flex items-center justify-center gap-3">
            <Wand2 className="text-accent" />
            Recommended For You
        </h2>
        <p className="text-muted-foreground mb-6">
            Our AI has analyzed your taste to find your next favorite movie.
        </p>
        <Button onClick={onPersonalizedSubmit} disabled={loading || !user} size="lg">
            {loading ? <Loader2 className="animate-spin" /> : 'Reveal My Recommendation'}
        </Button>
      
        {loading && (
          <div className="mt-6 flex justify-center items-center gap-2 text-muted-foreground">
            <Loader2 className="animate-spin h-5 w-5" />
            <span>The AI Oracle is thinking...</span>
          </div>
        )}

        {recommendation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-lg bg-primary/20 border border-primary/50"
          >
            <h4 className="font-headline text-lg font-semibold flex items-center gap-2 text-white">
              <Bot className="h-5 w-5 text-accent"/>
              Oracle's Suggestion
            </h4>
            <p className="mt-2 text-primary-foreground/90">{recommendation}</p>
          </motion.div>
        )}
    </motion.div>
  );
}
