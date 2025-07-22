// src/ai/flows/generate-movie-recommendation.ts
'use server';

/**
 * @fileOverview Generates movie recommendations based on a given mood.
 *
 * - generateMovieRecommendation - A function that generates movie recommendations based on mood.
 * - GenerateMovieRecommendationInput - The input type for the generateMovieRecommendation function.
 * - GenerateMovieRecommendationOutput - The return type for the generateMovieRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMovieRecommendationInputSchema = z.object({
  mood: z.string().describe('The mood for which to generate a movie recommendation.'),
});
export type GenerateMovieRecommendationInput = z.infer<typeof GenerateMovieRecommendationInputSchema>;

const GenerateMovieRecommendationOutputSchema = z.object({
  movieRecommendation: z.string().describe('A movie recommendation based on the given mood.'),
});
export type GenerateMovieRecommendationOutput = z.infer<typeof GenerateMovieRecommendationOutputSchema>;

export async function generateMovieRecommendation(
  input: GenerateMovieRecommendationInput
): Promise<GenerateMovieRecommendationOutput> {
  return generateMovieRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMovieRecommendationPrompt',
  input: {schema: GenerateMovieRecommendationInputSchema},
  output: {schema: GenerateMovieRecommendationOutputSchema},
  prompt: `You are a movie expert. Recommend one movie based on the mood the user is in.

  Mood: {{{mood}}}
  `,
});

const generateMovieRecommendationFlow = ai.defineFlow(
  {
    name: 'generateMovieRecommendationFlow',
    inputSchema: GenerateMovieRecommendationInputSchema,
    outputSchema: GenerateMovieRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
