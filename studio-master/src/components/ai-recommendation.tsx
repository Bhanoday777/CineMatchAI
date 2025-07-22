
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Wand2, Loader2, Bot, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

import { generateMovieRecommendation } from '@/ai/flows/generate-movie-recommendation';
import { promptAiMovieSuggestion } from '@/ai/flows/prompt-ai-movie-suggestion';
import { getPersonalizedRecommendation } from '@/ai/flows/get-personalized-recommendation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { getUserMovieList } from '@/lib/firestore';
import { Movie } from '@/lib/types';


const promptSchema = z.object({
  prompt: z.string().min(10, { message: 'Describe the movie you want to watch in at least 10 characters.' }),
});

const moodSchema = z.object({
  mood: z.string({ required_error: 'Please select a mood.' }),
});

const moods = ['Happy', 'Sad', 'Excited', 'Scary', 'Romantic', 'Thought-provoking'];

export function AiRecommendation() {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const promptForm = useForm<z.infer<typeof promptSchema>>({
    resolver: zodResolver(promptSchema),
    defaultValues: { prompt: '' },
  });

  const moodForm = useForm<z.infer<typeof moodSchema>>({
    resolver: zodResolver(moodSchema),
  });

  async function onPromptSubmit(data: z.infer<typeof promptSchema>) {
    setLoading(true);
    setRecommendation(null);
    try {
      const result = await promptAiMovieSuggestion(data);
      setRecommendation(result.movieSuggestion);
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
  }
  
  async function onMoodSubmit(data: z.infer<typeof moodSchema>) {
    setLoading(true);
    setRecommendation(null);
    try {
      const result = await generateMovieRecommendation(data);
      setRecommendation(result.movieRecommendation);
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
  }

  async function onPersonalizedSubmit() {
    if (!user) return;
    setLoading(true);
    setRecommendation(null);
    try {
      const favoriteMovies = await getUserMovieList(user.uid, 'favorites');
      const watchedMovies = await getUserMovieList(user.uid, 'watched');

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
  }

  return (
    <Card className="bg-card/70 border-primary/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2 text-white"><Wand2 className="text-primary"/> AI Movie Oracle</CardTitle>
        <CardDescription>Tell the Oracle what you're looking for, or how you feel.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="prompt" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-secondary/50">
            <TabsTrigger value="prompt">Describe a Movie</TabsTrigger>
            <TabsTrigger value="mood">Pick a Mood</TabsTrigger>
            <TabsTrigger value="for-you" disabled={!user}>For You</TabsTrigger>
          </TabsList>
          <TabsContent value="prompt">
            <Form {...promptForm}>
              <form onSubmit={promptForm.handleSubmit(onPromptSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={promptForm.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <Textarea {...field} placeholder="e.g., 'a mind-bending sci-fi movie with a twist ending, like Inception...'" className="min-h-[100px] bg-background/50"/>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? <Loader2 className="animate-spin" /> : 'Get Suggestion'}
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="mood">
            <Form {...moodForm}>
              <form onSubmit={moodForm.handleSubmit(onMoodSubmit)} className="space-y-6 mt-4">
                 <FormField
                  control={moodForm.control}
                  name="mood"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 md:grid-cols-3 gap-4"
                      >
                        {moods.map(mood => (
                          <FormItem key={mood} className="flex items-center space-x-3 space-y-0">
                             <FormControl>
                              <RadioGroupItem value={mood} id={mood}/>
                            </FormControl>
                            <Label htmlFor={mood} className="font-normal text-white cursor-pointer hover:text-primary transition-colors">{mood}</Label>
                          </FormItem>
                        ))}
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? <Loader2 className="animate-spin" /> : 'Find a Movie'}
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="for-you">
              <div className="text-center space-y-4 mt-4 p-4 border border-dashed rounded-lg">
                  <User className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground">Get a recommendation based on your favorites and watch history.</p>
                  <Button onClick={onPersonalizedSubmit} disabled={loading || !user} className="w-full">
                      {loading ? <Loader2 className="animate-spin" /> : 'Recommend For Me'}
                  </Button>
              </div>
          </TabsContent>
        </Tabs>
        
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
      </CardContent>
    </Card>
  );
}
