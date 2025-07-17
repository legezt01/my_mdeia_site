
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
  query: z.string().describe("The user's search query for YouTube videos."),
});
export type YoutubeSearchInput = z.infer<typeof YoutubeSearchInputSchema>;

const VideoResultSchema = z.object({
  id: z.string().describe('A plausible YouTube video ID (e.g., dQw4w9WgXcQ).'),
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

function formatDuration(isoString: string) {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = isoString.match(regex);

    if (!matches) {
        return '00:00';
    }

    const hours = parseInt(matches[1] || '0', 10);
    const minutes = parseInt(matches[2] || '0', 10);
    const seconds = parseInt(matches[3] || '0', 10);

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const parts = [];
    if (h > 0) {
        parts.push(h.toString().padStart(2, '0'));
    }
    parts.push(m.toString().padStart(2, '0'));
    parts.push(s.toString().padStart(2, '0'));

    return parts.join(':');
}


export async function youtubeSearch(input: YoutubeSearchInput): Promise<YoutubeSearchOutput> {
  const apiKey = process.env.YOUTUBE_DATA_API;
  if (!apiKey) {
    throw new Error('YouTube API key (YOUTUBE_DATA_API) is not configured.');
  }

  const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
  searchUrl.searchParams.set('part', 'snippet');
  searchUrl.searchParams.set('q', input.query);
  searchUrl.searchParams.set('key', apiKey);
  searchUrl.searchParams.set('type', 'video');
  searchUrl.searchParams.set('maxResults', '10');

  const searchResponse = await fetch(searchUrl.toString());
  if (!searchResponse.ok) {
    const errorData = await searchResponse.json();
    console.error('YouTube Search API Error:', errorData);
    throw new Error(`Failed to search YouTube: ${errorData.error.message}`);
  }
  const searchData = await searchResponse.json();

  const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');

  if (!videoIds) {
    return { results: [] };
  }

  const videosUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
  videosUrl.searchParams.set('part', 'snippet,contentDetails');
  videosUrl.searchParams.set('id', videoIds);
  videosUrl.searchParams.set('key', apiKey);

  const videosResponse = await fetch(videosUrl.toString());
   if (!videosResponse.ok) {
    const errorData = await videosResponse.json();
    console.error('YouTube Videos API Error:', errorData);
    throw new Error(`Failed to fetch video details: ${errorData.error.message}`);
  }
  const videosData = await videosResponse.json();

  const results: z.infer<typeof VideoResultSchema>[] = videosData.items.map((item: any) => ({
    id: item.id,
    thumbnail: item.snippet.thumbnails.medium.url,
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    duration: formatDuration(item.contentDetails.duration),
    dataAiHint: 'video thumbnail',
  }));

  return { results };
}
