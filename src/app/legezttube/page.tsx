
'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  Mic,
  PlayCircle,
  Download,
  ListPlus,
  Loader2,
  X,
  MessageSquare,
} from 'lucide-react';
import Image from 'next/image';
import React, { useState, useRef } from 'react';
import { youtubeSearch, YoutubeSearchOutput } from '@/ai/flows/youtube-search-flow';
import { getSubtitles } from '@/ai/flows/get-subtitles-flow';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const trendingVideos = [
  {
    id: 'OGudBiM-XUA',
    thumbnail: 'https://placehold.co/300x180.png',
    dataAiHint: 'synthwave sunset',
    title: 'Synthwave Dreams - A Retro Journey',
    channel: 'Vaporwave Vibes',
    duration: '1:23:45',
  },
  {
    id: '5qap5aO4i9A',
    thumbnail: 'https://placehold.co/300x180.png',
    dataAiHint: 'lofi beats',
    title: 'Lofi Beats to Relax/Study to',
    channel: 'Chillhop Music',
    duration: '2:45:10',
  },
  {
    id: '4xDzrJKXOOY',
    thumbnail: 'https://placehold.co/300x180.png',
    dataAiHint: 'cyberpunk city',
    title: 'Cyberpunk City Ambience',
    channel: 'Ambient Worlds',
    duration: '3:10:05',
  },
   {
    id: 'Dy266g_g_nA',
    thumbnail: 'https://placehold.co/300x180.png',
    dataAiHint: 'gaming highlights',
    title: 'Pro Gamer Moments of 2024',
    channel: 'GameSprout',
    duration: '15:30',
  },
];

type VideoResult = YoutubeSearchOutput['results'][0];
interface Subtitle {
  start: string;
  text: string;
}

const ShimmerLogo = () => (
    <h1 className="text-4xl font-bold font-headline relative inline-block">
        <span className="shimmer-text">LegeztTube</span>
    </h1>
);

export default function LegeztTubePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<VideoResult[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [isFetchingSubtitles, setIsFetchingSubtitles] = useState(false);

  const { toast } = useToast();
  const playerRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setSearchResults([]);
    setSelectedVideo(null);
    setSubtitles([]);

    try {
        const response = await youtubeSearch({ query: searchTerm });
        setSearchResults(response.results);
    } catch (error) {
        console.error("Search failed:", error);
        toast({
            variant: "destructive",
            title: "Search Error",
            description: "Could not fetch video results. Please try again later."
        })
    } finally {
        setIsLoading(false);
    }
  }

  const handleWatchClick = (video: VideoResult) => {
    setSelectedVideo(video);
    setSubtitles([]);
    setTimeout(() => {
        playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }

  const handleFetchSubtitles = async () => {
    if (!selectedVideo) return;
    setIsFetchingSubtitles(true);
    try {
        const response = await getSubtitles({ videoId: selectedVideo.id });
        if (response.subtitles && response.subtitles.length > 0) {
            setSubtitles(response.subtitles);
        } else {
             toast({
                title: "No Subtitles Found",
                description: "Subtitles are not available for this video.",
            });
        }
    } catch (error) {
         console.error("Subtitle fetch failed:", error);
        toast({
            variant: "destructive",
            title: "Subtitle Error",
            description: "Could not fetch subtitles for this video."
        })
    } finally {
        setIsFetchingSubtitles(false);
    }
  }

  return (
    <div className="bg-[#121212] text-white min-h-full flex flex-col font-sans">
       <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -500%; }
          100% { background-position: 500%; }
        }
        .shimmer-text {
          background: linear-gradient(to right, #7DF9FF 20%, #A64DFF 40%, #E0218A 60%, #7DF9FF 80%);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shimmer 5s linear infinite;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
            animation: fadeIn 0.5s ease-out forwards;
        }
       `}</style>
      
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <header className="text-center mb-8">
           <ShimmerLogo />
        </header>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative mb-8 max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search any song or video..."
            className="w-full rounded-full bg-gray-800 border-gray-700 text-white pl-11 pr-24 h-14 text-lg shadow-[0_0_15px_rgba(125,249,255,0.2)] focus:shadow-[0_0_25px_rgba(125,249,255,0.4)] transition-shadow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
           <Button type="submit" variant="ghost" size="icon" className="absolute right-12 top-1/2 -translate-y-1/2 rounded-full text-gray-300 hover:text-white hover:bg-gray-700" disabled={isLoading}>
            <Search className="h-6 w-6" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full text-gray-300 hover:text-white hover:bg-gray-700" disabled={isLoading}>
            <Mic className="h-6 w-6" />
          </Button>
        </form>
        
        {/* Player Section */}
        {selectedVideo && (
            <section ref={playerRef} className='mb-8 fade-in'>
                 <div className="relative aspect-video max-w-4xl mx-auto rounded-xl overflow-hidden shadow-[0_0_25px_rgba(166,77,255,0.3)]">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                        title={selectedVideo.title} 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        className='border-0'
                    ></iframe>
                 </div>
                 <div className="max-w-4xl mx-auto mt-4 p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className='text-2xl font-bold'>{selectedVideo.title}</h2>
                            <p className='text-gray-400'>{selectedVideo.channel}</p>
                        </div>
                        <div className="flex items-center gap-2">
                             <Button onClick={handleFetchSubtitles} disabled={isFetchingSubtitles}>
                                {isFetchingSubtitles ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquare className='mr-2 h-4 w-4'/>}
                                Subtitles
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => { setSelectedVideo(null); setSubtitles([]); }}>
                                <X className='h-6 w-6'/>
                            </Button>
                        </div>
                    </div>
                 </div>

                 {subtitles.length > 0 && (
                    <div className="max-w-4xl mx-auto mt-4">
                        <ScrollArea className="h-64 p-4 bg-gray-900 rounded-lg">
                            {subtitles.map((sub, index) => (
                                <div key={index} className="flex gap-4 mb-2 text-gray-300">
                                    <span className="font-mono text-neon-blue w-20">{sub.start}</span>
                                    <p>{sub.text}</p>
                                </div>
                            ))}
                        </ScrollArea>
                    </div>
                 )}
            </section>
        )}

        {/* Results / Trending Section */}
        {hasSearched ? (
            <section>
                <h2 className="text-2xl font-bold mb-4 fade-in">Search Results for "{searchTerm}"</h2>
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-neon-blue"/>
                    </div>
                ) : searchResults.length > 0 ? (
                    <div className="space-y-4">
                        {searchResults.map((result, index) => (
                        <div key={result.id} className="flex gap-4 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors fade-in" style={{animationDelay: `${index * 100}ms`}}>
                            <div className="relative flex-shrink-0 cursor-pointer" onClick={() => handleWatchClick(result)}>
                            <Image
                                src={result.thumbnail}
                                alt={result.title}
                                width={160}
                                height={90}
                                className="rounded-md"
                                data-ai-hint={result.dataAiHint}
                            />
                            <PlayCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white/70" />
                            </div>
                            <div className="flex-1">
                            <h3 className="font-bold text-lg mb-1">{result.title}</h3>
                            <p className="text-sm text-gray-400">
                                {result.channel} • {result.duration}
                            </p>
                            <div className="flex items-center gap-2 mt-3">
                                <Button onClick={() => handleWatchClick(result)} className="bg-neon-blue/20 text-neon-blue border border-neon-blue/50 hover:bg-neon-blue/30 shadow-[0_0_10px_rgba(125,249,255,0.3)] hover:shadow-[0_0_15px_rgba(125,249,255,0.5)] transition-all">
                                <PlayCircle className="w-4 h-4 mr-2" /> Watch
                                </Button>
                                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-700">
                                <Download className="w-4 h-4 mr-2" /> MP3
                                </Button>
                                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-700">
                                <Download className="w-4 h-4 mr-2" /> MP4
                                </Button>
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400">
                        <p>No results found. Try a different search.</p>
                    </div>
                )}
            </section>
        ) : (
            <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 fade-in">
                    <span className="text-3xl">🔥</span> Trending Today
                </h2>
                <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
                    {trendingVideos.map((video, index) => (
                    <div key={video.id} className="fade-in flex-shrink-0 w-64 group cursor-pointer" onClick={() => handleWatchClick(video)} style={{animationDelay: `${index * 100}ms`}}>
                        <div className="relative rounded-xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105">
                        <Image
                            src={video.thumbnail}
                            alt={video.title}
                            width={300}
                            height={180}
                            className="w-full h-auto"
                            data-ai-hint={video.dataAiHint}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                        <PlayCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {video.duration}
                        </span>
                        </div>
                        <h3 className="mt-2 font-semibold truncate">{video.title}</h3>
                         <p className="text-sm text-gray-400 truncate">{video.channel}</p>
                    </div>
                    ))}
                </div>
            </section>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="sticky bottom-6 right-6 self-end">
          <Button className="rounded-full h-16 w-auto px-6 bg-gradient-to-r from-neon-purple to-neon-red text-white font-bold text-lg shadow-[0_0_20px_rgba(224,33,138,0.5)] hover:scale-105 transition-transform">
             <ListPlus className="w-6 h-6 mr-3" />
             Add to My Playlist
          </Button>
      </div>
    </div>
  );
}

    