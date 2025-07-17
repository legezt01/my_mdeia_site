
// src/app/legezterest/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Heart, Download, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

interface DisplayImage {
  id: number;
  url: string;
  alt: string;
  author: string;
  avatar: string;
  dataAiHint: string;
}

const initialImages: DisplayImage[] = [
    {
        id: 1,
        url: `https://placehold.co/400x500.png`,
        alt: `Image 1`,
        dataAiHint: 'architecture abstract',
        author: `Creator 1`,
        avatar: `https://placehold.co/40x40.png`
    },
     {
        id: 2,
        url: `https://placehold.co/400x300.png`,
        alt: `Image 2`,
        dataAiHint: 'nature minimal',
        author: `Creator 2`,
        avatar: `https://placehold.co/40x40.png`
    },
     {
        id: 3,
        url: `https://placehold.co/400x600.png`,
        alt: `Image 3`,
        dataAiHint: 'portrait dramatic',
        author: `Creator 3`,
        avatar: `https://placehold.co/40x40.png`
    },
     {
        id: 4,
        url: `https://placehold.co/400x450.png`,
        alt: `Image 4`,
        dataAiHint: 'city night',
        author: `Creator 4`,
        avatar: `https://placehold.co/40x40.png`
    },
      {
        id: 5,
        url: `https://placehold.co/400x350.png`,
        alt: `Image 5`,
        dataAiHint: 'food delicious',
        author: `Creator 5`,
        avatar: `https://placehold.co/40x40.png`
    },
];

export default function LegezterestPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [images] = useState<DisplayImage[]>(initialImages);
    const [searchUrl, setSearchUrl] = useState<string | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim() === '') return;

        const pinterestUrl = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(searchTerm.trim())}`;
        setSearchUrl(pinterestUrl);
    };

    const handleBack = () => {
        setSearchUrl(null);
        setSearchTerm('');
    };


    return (
        <div className="flex flex-col h-full bg-background text-foreground p-4 md:p-6">
            <header className="mb-8 text-center">
                <h1 className="text-5xl font-bold font-headline mb-2">Legezterest</h1>
                <p className="text-lg text-muted-foreground">Find inspiration from across the web.</p>
                 <form onSubmit={handleSearch} className="relative mt-6 max-w-xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search on Pinterest... (e.g., 'Ben 10')"
                        className="w-full rounded-full bg-muted pl-12 pr-48 h-14 text-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button type="submit" disabled={!searchTerm.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-11 px-4">
                        <Search className="mr-2 h-4 w-4" />
                        Search Pinterest
                    </Button>
                </form>
            </header>

            <main className="flex-1 flex flex-col">
                {searchUrl ? (
                    <div className="flex-1 flex flex-col">
                         <div className="mb-4">
                            <Button variant="outline" onClick={handleBack}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Gallery
                            </Button>
                        </div>
                        <iframe
                            src={searchUrl}
                            className="w-full h-full flex-1 border-2 border-border rounded-lg"
                            title="Pinterest Search Results"
                        ></iframe>
                         <p className="text-xs text-muted-foreground mt-2 text-center">
                            Note: Some websites like Pinterest may block being embedded. If the frame is empty, this is likely the case.
                        </p>
                    </div>
                ) : (
                     images.length > 0 ? (
                     <div 
                        className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4"
                    >
                        {images.map((image) => (
                            <div key={image.id} className="break-inside-avoid group relative">
                                <Card className="overflow-hidden border-0">
                                    <Image
                                        src={image.url}
                                        alt={image.alt}
                                        width={400}
                                        height={500} // Use a consistent height or parse from URL if dynamic
                                        className="w-full h-auto"
                                        data-ai-hint={image.dataAiHint}
                                        unoptimized={image.url.startsWith('data:')} // Important for base64 images
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                                        <div></div>
                                        <div className="flex items-center justify-end gap-2">
                                             <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 bg-background/80 hover:bg-background">
                                                <Download className="w-5 h-5 text-foreground" />
                                            </Button>
                                            <Button size="icon" className="rounded-full h-10 w-10">
                                                <Heart className="w-5 h-5" />
                                                <span className="sr-only">Save</span>
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                                 <div className="flex items-center gap-2 mt-2 px-1">
                                    <Image src={image.avatar} alt={image.author} width={24} height={24} className="rounded-full" data-ai-hint="person avatar"/>
                                    <span className="text-sm font-medium text-muted-foreground">{image.author}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-lg text-muted-foreground">No images to display. Try a search above to find some on Pinterest!</p>
                    </div>
                )
                )}
            </main>
        </div>
    );
}
