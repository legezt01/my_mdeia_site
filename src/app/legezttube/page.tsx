
'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  Mic,
  PlayCircle,
  Download,
  ListPlus,
  ArrowRight,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const trendingVideos = [
  {
    id: '1',
    thumbnail: 'https://placehold.co/300x180.png',
    dataAiHint: 'synthwave sunset',
    title: 'Synthwave Dreams - A Retro Journey',
    duration: '1:23:45',
  },
  {
    id: '2',
    thumbnail: 'https://placehold.co/300x180.png',
    dataAiHint: 'lofi beats',
    title: 'Lofi Beats to Relax/Study to',
    duration: '2:45:10',
  },
  {
    id: '3',
    thumbnail: 'https://placehold.co/300x180.png',
    dataAiHint: 'cyberpunk city',
    title: 'Cyberpunk City Ambience',
    duration: '3:10:05',
  },
   {
    id: '4',
    thumbnail: 'https://placehold.co/300x180.png',
    dataAiHint: 'gaming highlights',
    title: 'Pro Gamer Moments of 2024',
    duration: '15:30',
  },
];

const searchResults = [
  {
    id: 'sr1',
    thumbnail: 'https://placehold.co/160x90.png',
    dataAiHint: 'music video',
    title: 'Echoes of the Future - Official Music Video',
    channel: 'FutureScape Records',
    duration: '4:12',
  },
  {
    id: 'sr2',
    thumbnail: 'https://placehold.co/160x90.png',
    dataAiHint: 'game tutorial',
    title: 'Mastering the Blade: Advanced Combat Tutorial',
    channel: 'GameWise',
    duration: '22:45',
  },
  {
    id: 'sr3',
    thumbnail: 'https://placehold.co/160x90.png',
    dataAiHint: 'podcast interview',
    title: 'Tech Talks Ep. 42: The AI Revolution with Dr. Anya Sharma',
    channel: 'Innovate Hub',
    duration: '1:15:30',
  },
   {
    id: 'sr4',
    thumbnail: 'https://placehold.co/160x90.png',
    dataAiHint: 'cooking show',
    title: 'Ultimate 30-Minute Meals',
    channel: 'QuickCuisine',
    duration: '18:55',
  },
];

const ShimmerLogo = () => (
    <h1 className="text-4xl font-bold font-headline relative inline-block">
        <span className="shimmer-text">LegeztTube</span>
    </h1>
);

export default function LegeztTubePage() {
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
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search any song or video..."
            className="w-full rounded-full bg-gray-800 border-gray-700 text-white pl-11 pr-12 h-14 text-lg shadow-[0_0_15px_rgba(125,249,255,0.2)] focus:shadow-[0_0_25px_rgba(125,249,255,0.4)] transition-shadow"
          />
          <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full text-gray-300 hover:text-white hover:bg-gray-700">
            <Mic className="h-6 w-6" />
          </Button>
        </div>

        {/* Trending Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 fade-in">
            <span className="text-3xl">🔥</span> Trending Today
          </h2>
          <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
            {trendingVideos.map((video, index) => (
              <div key={video.id} className="fade-in flex-shrink-0 w-64 group" style={{animationDelay: `${index * 100}ms`}}>
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
              </div>
            ))}
          </div>
        </section>
        
        {/* Search Results */}
        <section>
          <h2 className="text-2xl font-bold mb-4 fade-in">Search Results</h2>
          <div className="space-y-4">
            {searchResults.map((result, index) => (
              <div key={result.id} className="flex gap-4 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors fade-in" style={{animationDelay: `${(trendingVideos.length + index) * 100}ms`}}>
                <div className="relative flex-shrink-0">
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
                    <Button className="bg-neon-blue/20 text-neon-blue border border-neon-blue/50 hover:bg-neon-blue/30 shadow-[0_0_10px_rgba(125,249,255,0.3)] hover:shadow-[0_0_15px_rgba(125,249,255,0.5)] transition-all">
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
        </section>
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

