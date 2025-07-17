// src/app/games/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad2, VenetianMask, Worm } from 'lucide-react';
import Link from 'next/link';

const games = [
    {
        name: 'Snake',
        description: 'The classic reptile game. Eat the food and grow longer!',
        href: '/games/snake',
        icon: Worm,
        color: 'text-green-500'
    },
    {
        name: 'Ludo',
        description: 'The classic dice game. Race your pieces to the finish line!',
        href: '/games/ludo',
        icon: VenetianMask,
        color: 'text-blue-500'
    }
]

export default function GamesPage() {
  return (
    <div className="flex flex-col h-full items-center bg-background p-4 text-center">
        <div className="flex items-center mb-8">
            <Gamepad2 className="h-12 w-12 mr-4 text-primary" />
            <h1 className="text-5xl font-bold font-headline">LegeztPlay</h1>
        </div>

        <p className="text-lg text-muted-foreground mb-12">Choose a game to play</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl w-full">
            {games.map((game) => (
                <Link href={game.href} key={game.name}>
                    <Card className="hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 cursor-pointer h-full">
                        <CardHeader className="items-center">
                           <div className="p-4 bg-primary/10 rounded-full mb-2">
                             <game.icon className={`w-12 h-12 ${game.color}`} />
                           </div>
                           <CardTitle className="text-2xl">{game.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <p className="text-muted-foreground">{game.description}</p>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    </div>
  );
}