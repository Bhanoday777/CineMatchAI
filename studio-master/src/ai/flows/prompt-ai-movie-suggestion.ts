// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview AI movie suggestion agent that takes in a prompt
 * and returns a tailored movie suggestion based on the prompt.
 *
 * - promptAiMovieSuggestion - A function that handles the movie suggestion process.
 * - PromptAiMovieSuggestionInput - The input type for the promptAiMovieSuggestion function.
 * - PromptAiMovieSuggestionOutput - The return type for the promptAiMovieSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PromptAiMovieSuggestionInputSchema = z.object({
  prompt: z.string().describe('The prompt to use to generate the movie suggestion.'),
});
export type PromptAiMovieSuggestionInput = z.infer<typeof PromptAiMovieSuggestionInputSchema>;

const PromptAiMovieSuggestionOutputSchema = z.object({
  movieSuggestion: z.string().describe('The movie suggestion based on the prompt.'),
});
export type PromptAiMovieSuggestionOutput = z.infer<typeof PromptAiMovieSuggestionOutputSchema>;

export async function promptAiMovieSuggestion(input: PromptAiMovieSuggestionInput): Promise<PromptAiMovieSuggestionOutput> {
  return promptAiMovieSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'promptAiMovieSuggestionPrompt',
  input: {schema: PromptAiMovieSuggestionInputSchema},
  output: {schema: PromptAiMovieSuggestionOutputSchema},
  prompt: `You are an expert movie recommender. A user will provide you with a prompt describing what kind of movie they want to watch. You should then provide a movie suggestion based on the prompt. Be creative, specific, and unique.

User Prompt: {{{prompt}}}`,
});

const promptAiMovieSuggestionFlow = ai.defineFlow(
  {
    name: 'promptAiMovieSuggestionFlow',
    inputSchema: PromptAiMovieSuggestionInputSchema,
    outputSchema: PromptAiMovieSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
