// src/app/legezterest/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Heart, Download, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { generateImages } from '@/ai/flows/generate-image-flow';
import { useToast } from '@/hooks/use-toast';

interface DisplayImage {
  id: string;
  url: string;
  alt: string;
  author: string;
  avatar: string;
  dataAiHint: string;
}

const initialImages: DisplayImage[] = [
    {
        id: '1',
        url: `https://placehold.co/400x500.png`,
        alt: `Abstract architecture`,
        dataAiHint: 'architecture abstract',
        author: `AI Bot`,
        avatar: `https://placehold.co/40x40.png`
    },
     {
        id: '2',
        url: `https://placehold.co/400x300.png`,
        alt: `Minimalist nature scene`,
        dataAiHint: 'nature minimal',
        author: `AI Bot`,
        avatar: `https://placehold.co/40x40.png`
    },
     {
        id: '3',
        url: `https://placehold.co/400x600.png`,
        alt: `Dramatic portrait`,
        dataAiHint: 'portrait dramatic',
        author: `AI Bot`,
        avatar: `https://placehold.co/40x40.png`
    },
     {
        id: '4',
        url: `https://placehold.co/400x450.png`,
        alt: `City at night`,
        dataAiHint: 'city night',
        author: `AI Bot`,
        avatar: `https://placehold.co/40x40.png`
    },
      {
        id: '5',
        url: `https://placehold.co/400x350.png`,
        alt: `Delicious food`,
        dataAiHint: 'food delicious',
        author: `AI Bot`,
        avatar: `https://placehold.co/40x40.png`
    },
];

export default function LegezterestPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [images, setImages] = useState<DisplayImage[]>(initialImages);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim() === '') return;
        setIsLoading(true);

        try {
            const result = await generateImages({ prompt: searchTerm, count: 5 });
            const newImages: DisplayImage[] = result.images.map((img, index) => ({
                id: `ai-${Date.now()}-${index}`,
                url: img.url,
                alt: searchTerm,
                author: 'AI Generator',
                avatar: 'https://placehold.co/40x40.png',
                dataAiHint: 'ai generated'
            }));
            setImages(prev => [...newImages, ...prev]);

        } catch (error) {
            console.error('Image generation error:', error);
            toast({
                variant: 'destructive',
                title: 'Image Generation Failed',
                description: 'There was an error generating images. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-background text-foreground p-4 md:p-6">
            <header className="mb-8 text-center">
                <h1 className="text-5xl font-bold font-headline mb-2">Legezterest</h1>
                <p className="text-lg text-muted-foreground">Turn your ideas into images.</p>
                 <form onSubmit={handleSearch} className="relative mt-6 max-w-xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Describe an image to generate... (e.g., 'a cat in a space suit')"
                        className="w-full rounded-full bg-muted pl-12 pr-32 h-14 text-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={!searchTerm.trim() || isLoading} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-11 px-4">
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Search className="mr-2 h-4 w-4" />
                        )}
                        Generate
                    </Button>
                </form>
            </header>

            <main className="flex-1">
                 {images.length > 0 ? (
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
                                    height={500} 
                                    className="w-full h-auto"
                                    data-ai-hint={image.dataAiHint}
                                    unoptimized={image.url.startsWith('data:')}
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
                    {isLoading ? (
                        <div className="flex justify-center items-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="ml-4 text-lg text-muted-foreground">Generating images...</p>
                        </div>
                    ) : (
                        <p className="text-lg text-muted-foreground">No images to display. Try a search above to generate some!</p>
                    )}
                </div>
            )}
            </main>
        </div>
    );
}
