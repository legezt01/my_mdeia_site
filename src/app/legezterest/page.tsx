// src/app/legezterest/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Heart, Download } from 'lucide-react';
import Image from 'next/image';

const generateImages = (count: number) => {
    const sampleKeywords = [
        "architecture abstract", "nature minimal", "portrait dramatic", "city night", "food delicious",
        "travel landscape", "technology futuristic", "fashion street", "animal wildlife", "space galaxy",
        "ocean waves", "mountain majestic", "forest serene", "desert dunes", "car vintage",
        "sports action", "music concert", "art modern", "interior design", "macro photography",
        "drone aerial", "black white", "texture pattern", "fireworks display", "retro style"
    ];
    return Array.from({ length: count }, (_, i) => {
        const height = Math.floor(Math.random() * 300) + 200; // Random height between 200 and 500
        const keywords = sampleKeywords[i % sampleKeywords.length];
        return {
            id: i,
            url: `https://placehold.co/400x${height}.png`,
            alt: `Image ${i}`,
            dataAiHint: keywords,
            keywords: keywords.split(' '),
            author: `Creator ${i % 10 + 1}`,
            avatar: `https://placehold.co/40x40.png`
        };
    });
};

const allImages = generateImages(50);


export default function LegezterestPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredImages, setFilteredImages] = useState(allImages);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredImages(allImages);
        } else {
            setFilteredImages(
                allImages.filter(image =>
                    image.keywords.some(keyword =>
                        keyword.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                )
            );
        }
    }, [searchTerm]);

    return (
        <div className="flex flex-col h-full bg-background text-foreground p-4 md:p-6">
            <header className="mb-8 text-center">
                <h1 className="text-5xl font-bold font-headline mb-2">Legezterest</h1>
                <p className="text-lg text-muted-foreground">Discover your next inspiration.</p>
                 <div className="relative mt-6 max-w-xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search for ideas..."
                        className="w-full rounded-full bg-muted pl-12 h-14 text-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <main className="flex-1">
                <div 
                    className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4"
                >
                    {filteredImages.map((image) => (
                        <div key={image.id} className="break-inside-avoid group relative">
                            <Card className="overflow-hidden border-0">
                                <Image
                                    src={image.url}
                                    alt={image.alt}
                                    width={400}
                                    height={parseInt(image.url.split('x')[1].split('.')[0])}
                                    className="w-full h-auto"
                                    data-ai-hint={image.dataAiHint}
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
                {filteredImages.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-lg text-muted-foreground">No images found for &quot;{searchTerm}&quot;. Try another search!</p>
                    </div>
                )}
            </main>
        </div>
    );
}
