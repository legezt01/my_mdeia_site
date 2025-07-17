// src/ai/flows/youtube-search-flow.ts
'use server';
/**
 * @fileOverview An AI-powered YouTube video search simulator.
 *
 * - youtubeSearch - A function that simulates searching for YouTube videos.
 * - YoutubeSearchInput - The input type for the youtubeSearch function.
 * - YoutubeSearchOutput - The return type for the youtubeSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const YoutubeSearchInputSchema = z.object({
  query: z.string().describe('The user\'s search query for YouTube videos.'),
});
export type YoutubeSearchInput = z.infer<typeof YoutubeSearchInputSchema>;

const VideoResultSchema = z.object({
  id: z.string().describe('A unique identifier for the video.'),
  thumbnail: z.string().describe('The URL for the video thumbnail image.'),
  dataAiHint: z.string().describe('A hint for AI to find a relevant placeholder image.'),
  title: z.string().describe('The title of the video.'),
  channel: z.string().describe('The name of the YouTube channel.'),
  duration: z.string().describe('The duration of the video in MM:SS format.'),
});

const YoutubeSearchOutputSchema = z.object({
  results: z.array(VideoResultSchema).describe('An array of video search results.'),
});
export type YoutubeSearchOutput = z.infer<typeof YoutubeSearchOutputSchema>;

export async function youtubeSearch(input: YoutubeSearchInput): Promise<YoutubeSearchOutput> {
  return youtubeSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'youtubeSearchPrompt',
  input: {schema: YoutubeSearchInputSchema},
  output: {schema: YoutubeSearchOutputSchema},
  prompt: `You are a YouTube search simulator. A user has searched for "{{query}}".

  Generate a list of 5 plausible and creative YouTube video search results based on this query.
  
  For each result, provide:
  - id: a unique string
  - thumbnail: always use 'https://placehold.co/160x90.png'
  - dataAiHint: a 1-2 word hint for a placeholder image (e.g., "game tutorial", "music video")
  - title: a creative and relevant video title
  - channel: a plausible channel name
  - duration: a video duration like "12:34" or "1:05:22"`,
});

const youtubeSearchFlow = ai.defineFlow(
  {
    name: 'youtubeSearchFlow',
    inputSchema: YoutubeSearchInputSchema,
    outputSchema: YoutubeSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
