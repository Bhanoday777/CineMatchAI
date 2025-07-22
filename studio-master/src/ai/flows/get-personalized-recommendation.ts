// src/ai/flows/get-personalized-recommendation.ts
'use server';

/**
 * @fileOverview Generates personalized movie recommendations based on user's movie lists.
 *
 * - getPersonalizedRecommendation - A function that generates a movie recommendation.
 * - GetPersonalizedRecommendationInput - The input type for the function.
 * - GetPersonalizedRecommendationOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetPersonalizedRecommendationInputSchema = z.object({
  favoriteMovies: z.array(z.string()).describe("A list of the user's favorite movies."),
  watchedMovies: z.array(z.string()).describe("A list of movies the user has already watched."),
});
export type GetPersonalizedRecommendationInput = z.infer<typeof GetPersonalizedRecommendationInputSchema>;

const GetPersonalizedRecommendationOutputSchema = z.object({
  recommendation: z.string().describe('A single movie recommendation based on the user preferences.'),
});
export type GetPersonalizedRecommendationOutput = z.infer<typeof GetPersonalizedRecommendationOutputSchema>;

export async function getPersonalizedRecommendation(
  input: GetPersonalizedRecommendationInput
): Promise<GetPersonalizedRecommendationOutput> {
  return getPersonalizedRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getPersonalizedRecommendationPrompt',
  input: { schema: GetPersonalizedRecommendationInputSchema },
  output: { schema: GetPersonalizedRecommendationOutputSchema },
  prompt: `You are a movie expert who provides personalized recommendations.
A user has provided their favorite movies and their watch history.
Based on this information, recommend one movie they might like.
Do not recommend any of the movies from their favorite or watched lists.

User's Favorite Movies:
{{#each favoriteMovies}}
- {{{this}}}
{{/each}}

User's Watched Movies:
{{#each watchedMovies}}
- {{{this}}}
{{/each}}
`,
});

const getPersonalizedRecommendationFlow = ai.defineFlow(
  {
    name: 'getPersonalizedRecommendationFlow',
    inputSchema: GetPersonalizedRecommendationInputSchema,
    outputSchema: GetPersonalizedRecommendationOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
