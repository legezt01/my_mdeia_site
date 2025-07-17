// src/ai/flows/get-subtitles-flow.ts
'use server';
/**
 * @fileOverview A flow for fetching video subtitles.
 *
 * - getSubtitles - A function that calls the subtitle API.
 * - GetSubtitlesInput - The input type for the getSubtitles function.
 * - GetSubtitlesOutput - The return type for the getSubtitles function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import axios from 'axios';

const GetSubtitlesInputSchema = z.object({
  videoId: z.string().describe('The ID of the YouTube video.'),
});
export type GetSubtitlesInput = z.infer<typeof GetSubtitlesInputSchema>;

const SubtitleSchema = z.object({
  start: z.string(),
  text: z.string(),
});

const GetSubtitlesOutputSchema = z.object({
  subtitles: z.array(SubtitleSchema).describe('An array of subtitle objects.'),
});
export type GetSubtitlesOutput = z.infer<typeof GetSubtitlesOutputSchema>;

export async function getSubtitles(input: GetSubtitlesInput): Promise<GetSubtitlesOutput> {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    throw new Error('RapidAPI key (RAPIDAPI_KEY) is not configured in .env file.');
  }

  const options = {
    method: 'GET',
    url: 'https://yt-api.p.rapidapi.com/subtitle',
    params: { id: input.videoId, lang: 'en' },
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': 'yt-api.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    
    if (response.data && response.data.data) {
        const subtitles = response.data.data.map((item: any) => ({
            start: item.start,
            text: item.text,
        }));
        return { subtitles };
    } else {
        return { subtitles: [] };
    }
  } catch (error) {
    console.error('Failed to fetch subtitles:', error);
    // It's possible the API returns a 404 or other error if subtitles don't exist
    // We'll return an empty array to handle this gracefully on the frontend.
    return { subtitles: [] };
  }
}
