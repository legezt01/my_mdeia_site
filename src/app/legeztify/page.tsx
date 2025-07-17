
'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Search,
  Play,
  Pause,
  StepForward,
  StepBack,
  Repeat,
  Shuffle,
  Volume2,
  ListMusic,
  Heart,
} from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

const songs = [
  {
    title: 'Midnight Bloom',
    artist: 'Luna Waves',
    duration: '3:45',
    cover: 'https://placehold.co/150x150.png',
    dataAiHint: 'abstract synthwave',
  },
  {
    title: 'Solar Flare',
    artist: 'Orion Sun',
    duration: '4:20',
    cover: 'https://placehold.co/150x150.png',
    dataAiHint: 'cosmic explosion',
  },
  {
    title: 'City Lights',
    artist: 'Urban Echoes',
    duration: '2:55',
    cover: 'https://placehold.co/150x150.png',
    dataAiHint: 'city night',
  },
  {
    title: 'Forest Whisper',
    artist: 'Silent Grove',
    duration: '5:10',
    cover: 'https://placehold.co/150x150.png',
    dataAiHint: 'enchanted forest',
  },
  {
    title: 'Ocean Drive',
    artist: 'Coastal Beats',
    duration: '3:30',
    cover: 'https://placehold.co/150x150.png',
    dataAiHint: 'coastal drive',
  },
    {
    title: 'Desert Mirage',
    artist: 'Mirage Makers',
    duration: '4:05',
    cover: 'https://placehold.co/150x150.png',
    dataAiHint: 'vast desert',
  },
];

export default function LegeztifyPage() {
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="bg-background text-foreground h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold font-headline mb-2">Legeztify</h1>
          <p className="text-lg text-muted-foreground">
            Your personal soundtrack awaits.
          </p>
          <div className="relative mt-6 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for songs, artists, or albums..."
              className="w-full rounded-full bg-muted pl-10 h-12"
            />
          </div>
        </header>

        <section>
          <h2 className="text-2xl font-bold mb-4">Popular Tracks</h2>
          <div className="space-y-2">
            {songs.map((song, index) => (
              <div
                key={index}
                className={`flex items-center p-3 rounded-lg cursor-pointer group transition-colors ${
                  currentSong.title === song.title
                    ? 'bg-primary/10'
                    : 'hover:bg-secondary'
                }`}
                onClick={() => setCurrentSong(song)}
              >
                <div className="w-8 text-center text-muted-foreground font-medium">
                  {currentSong.title === song.title && isPlaying ? (
                    <Pause className="h-5 w-5 mx-auto text-primary" onClick={togglePlay} />
                  ) : (
                    <Play className="h-5 w-5 mx-auto group-hover:block" onClick={togglePlay} />
                  )}
                </div>
                <Image
                  src={song.cover}
                  alt={song.title}
                  width={48}
                  height={48}
                  className="rounded-md mr-4"
                  data-ai-hint={song.dataAiHint}
                />
                <div className="flex-1">
                  <h3 className={`font-semibold ${currentSong.title === song.title ? 'text-primary' : ''}`}>{song.title}</h3>
                  <p className="text-sm text-muted-foreground">{song.artist}</p>
                </div>
                <Button variant="ghost" size="icon" className="mr-4 opacity-0 group-hover:opacity-100">
                  <Heart className="h-5 w-5" />
                </Button>
                <p className="text-sm text-muted-foreground w-12 text-right">
                  {song.duration}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Music Player Bar */}
      <footer className="sticky bottom-0 left-0 right-0 w-full border-t bg-background/95 backdrop-blur-sm p-4 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">
          <div className="flex items-center gap-4">
            <Image
              src={currentSong.cover}
              alt={currentSong.title}
              width={56}
              height={56}
              className="rounded-md"
              data-ai-hint={currentSong.dataAiHint}
            />
            <div>
              <h4 className="font-semibold">{currentSong.title}</h4>
              <p className="text-sm text-muted-foreground">{currentSong.artist}</p>
            </div>
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Shuffle className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <StepBack className="h-6 w-6" />
              </Button>
              <Button size="icon" className="w-12 h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={togglePlay}>
                {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7" />}
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <StepForward className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Repeat className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center gap-2 w-full max-w-sm">
                <span className="text-xs text-muted-foreground">1:10</span>
                <Slider defaultValue={[progress]} max={100} step={1} onValueChange={(value) => setProgress(value[0])} />
                <span className="text-xs text-muted-foreground">{currentSong.duration}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <ListMusic className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2 w-32">
              <Volume2 className="h-5 w-5 text-muted-foreground" />
              <Slider defaultValue={[70]} max={100} step={1} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
