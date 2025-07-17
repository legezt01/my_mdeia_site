// src/app/games/ludo/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Crown, Dice5 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const COLORS = ['red', 'green', 'yellow', 'blue'];
const PLAYER_COLOR = 'blue';
const PLAYER_COUNT = 4;
const PIECE_COUNT = 4;

const PATHS = {
  red: [1, 2, 3, 4, 5, 14, 23, 32, 41, 50, 51, 52, 53, 54, 55, 46, 37, 28, 19, 10, 11, 12, 13, 22, 31, 40, 49, 58, 59, 60, 61, 62, 63, 56, 47, 38, 29, 20, 21, 30, 39, 48, 48, 48, 48, 48, 48],
  green: [14, 23, 32, 41, 50, 51, 52, 53, 54, 55, 46, 37, 28, 19, 10, 11, 12, 13, 22, 31, 40, 49, 58, 59, 60, 61, 62, 63, 56, 47, 38, 29, 20, 1, 2, 3, 4, 5, 6, 15, 24, 33, 42, 42, 42, 42, 42, 42],
  yellow: [63, 62, 61, 60, 59, 58, 49, 40, 31, 22, 13, 12, 11, 10, 19, 28, 37, 46, 55, 54, 53, 52, 51, 50, 41, 32, 23, 14, 5, 4, 3, 2, 1, 8, 17, 26, 35, 44, 44, 44, 44, 44, 44],
  blue: [56, 47, 38, 29, 20, 1, 2, 3, 4, 5, 14, 23, 32, 41, 50, 51, 52, 53, 54, 55, 46, 37, 28, 19, 10, 11, 12, 13, 22, 31, 40, 49, 58, 59, 60, 61, 62, 63, 63, 63, 63, 63, 63]
};
const START_POSITIONS = { red: 1, green: 14, blue: 56, yellow: 63 };
const HOME_ENTRANCES = { red: 48, green: 42, blue: 63, yellow: 44 };

const getInitialPieces = () => {
    const pieces: { [key: string]: { id: number; position: number; state: string }[] } = {};
    COLORS.forEach(color => {
        pieces[color] = Array(PIECE_COUNT).fill(0).map((_, i) => ({ id: i, position: -1, state: 'home' })); // -1: home, >0: on board, 100+: finished
    });
    return pieces;
}

export default function LudoGame() {
    const [pieces, setPieces] = useState(getInitialPieces());
    const [diceValue, setDiceValue] = useState<number | null>(null);
    const [turn, setTurn] = useState('blue');
    const [winner, setWinner] = useState<string | null>(null);
    const [message, setMessage] = useState("Your turn! Roll the dice.");

    const handleDiceRoll = () => {
        if (turn !== PLAYER_COLOR || winner) return;
        const roll = Math.floor(Math.random() * 6) + 1;
        setDiceValue(roll);

        const canMove = pieces[PLAYER_COLOR].some(p => {
            if (p.state === 'home' && roll === 6) return true;
            if (p.state === 'active') return true;
            return false;
        });

        if (!canMove) {
            setMessage(`You rolled a ${roll}, but have no moves. Passing turn.`);
            setTimeout(nextTurn, 1500);
        } else {
            setMessage(`You rolled a ${roll}! Click a piece to move.`);
        }
    };
    
    const handlePieceClick = (color: string, pieceId: number) => {
        if (color !== PLAYER_COLOR || turn !== PLAYER_COLOR || !diceValue || winner) return;

        const piece = pieces[color][pieceId];
        
        if (piece.state === 'home') {
            if (diceValue === 6) {
                movePiece(color, pieceId, START_POSITIONS[color as keyof typeof START_POSITIONS]);
            } else {
                setMessage("You must roll a 6 to move a piece out of home.");
            }
        } else if (piece.state === 'active') {
            // Simplified movement logic for now
            const currentPathIndex = PATHS[color as keyof typeof PATHS].indexOf(piece.position);
            const newPathIndex = currentPathIndex + diceValue;
             if(newPathIndex < PATHS[color as keyof typeof PATHS].length) {
                movePiece(color, pieceId, PATHS[color as keyof typeof PATHS][newPathIndex]);
            } else {
                movePiece(color, pieceId, 100 + pieceId) // Mark as finished
            }
        }
    };

    const movePiece = (color: string, pieceId: number, newPosition: number) => {
        setPieces(prev => {
            const newPieces = JSON.parse(JSON.stringify(prev));
            newPieces[color][pieceId].position = newPosition;
            newPieces[color][pieceId].state = newPosition >= 100 ? 'finished' : 'active';
            return newPieces;
        });
        setDiceValue(null);
        setMessage('');
        setTimeout(nextTurn, 500);
    };

    const nextTurn = () => {
        const currentIndex = COLORS.indexOf(turn);
        const nextIndex = (currentIndex + 1) % PLAYER_COUNT;
        setTurn(COLORS[nextIndex]);
    };
    
    // Basic computer turn
    useEffect(() => {
        if (turn !== PLAYER_COLOR && !winner) {
            setMessage(`${turn.charAt(0).toUpperCase() + turn.slice(1)}'s turn...`);
            setTimeout(() => {
                const roll = Math.floor(Math.random() * 6) + 1;
                 setMessage(`${turn.charAt(0).toUpperCase() + turn.slice(1)} rolled a ${roll}.`);
                // Very simple AI: move first available piece
                const movablePiece = pieces[turn].find(p => p.state === 'active') || (roll === 6 && pieces[turn].find(p => p.state === 'home'));
                if (movablePiece) {
                    setTimeout(() => {
                        if (movablePiece.state === 'home') {
                           movePiece(turn, movablePiece.id, START_POSITIONS[turn as keyof typeof START_POSITIONS]);
                        } else {
                           const currentPathIndex = PATHS[turn as keyof typeof PATHS].indexOf(movablePiece.position);
                           const newPathIndex = currentPathIndex + roll;
                           if(newPathIndex < PATHS[turn as keyof typeof PATHS].length) {
                                movePiece(turn, movablePiece.id, PATHS[turn as keyof typeof PATHS][newPathIndex]);
                            } else {
                                movePiece(turn, movablePiece.id, 100 + movablePiece.id)
                            }
                        }
                    }, 1000);
                } else {
                    setTimeout(nextTurn, 1500);
                }
            }, 1500);
        } else if (turn === PLAYER_COLOR) {
            setMessage("Your turn! Roll the dice.");
        }
    }, [turn, winner, pieces]);
    
    // Check for winner
     useEffect(() => {
        for (const color of COLORS) {
            if (pieces[color].every(p => p.state === 'finished')) {
                setWinner(color);
                break;
            }
        }
    }, [pieces]);
    
    const renderPiece = (color: string, piece: { id: number, position: number, state: string }, index: number) => {
        const size = 'w-8 h-8';
        const baseClasses = `absolute rounded-full border-2 border-black flex items-center justify-center text-white font-bold`;
        const colorClasses: {[key:string]: string} = {
            red: 'bg-red-500',
            green: 'bg-green-500',
            yellow: 'bg-yellow-500',
            blue: 'bg-blue-500',
        };

        let positionStyle = {};

        // Home positions
        if(piece.state === 'home') {
            const homePositions: {[key: string]: {top: string, left:string}[]} = {
                red: [{top: '12%', left: '12%'}, {top: '12%', left: '28%'}, {top: '28%', left: '12%'}, {top: '28%', left: '28%'}],
                green: [{top: '12%', left: '62%'}, {top: '12%', left: '78%'}, {top: '28%', left: '62%'}, {top: '28%', left: '78%'}],
                yellow: [{top: '62%', left: '62%'}, {top: '62%', left: '78%'}, {top: '78%', left: '62%'}, {top: '78%', left: '78%'}],
                blue: [{top: '62%', left: '12%'}, {top: '62%', left: '28%'}, {top: '78%', left: '12%'}, {top: '78%', left: '28%'}],
            };
            positionStyle = homePositions[color][index];
        }
        
        // Path positions (simplified grid)
        if(piece.state === 'active') {
             // This is a placeholder and needs real path mapping
             // For now, place them around the board in a circle
             const angle = (piece.position / 76) * 2 * Math.PI;
             positionStyle = { 
                 top: `calc(50% + ${40 * Math.sin(angle)}% - 1rem)`, 
                 left: `calc(50% + ${40 * Math.cos(angle)}% - 1rem)`,
            };
        }
        
        return (
            <div 
                key={`${color}-${piece.id}`} 
                className={cn(baseClasses, size, colorClasses[color], color === PLAYER_COLOR && 'cursor-pointer hover:ring-2 ring-white')}
                style={positionStyle}
                onClick={() => handlePieceClick(color, piece.id)}
            >
                {piece.id + 1}
            </div>
        )
    };
    
    const resetGame = () => {
        setPieces(getInitialPieces());
        setDiceValue(null);
        setTurn('blue');
        setWinner(null);
        setMessage("Your turn! Roll the dice.");
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-background">
             <AlertDialog open={!!winner}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center justify-center">
                        <Crown className="w-8 h-8 text-yellow-400 mr-2" />
                        {winner && `${winner.charAt(0).toUpperCase() + winner.slice(1)} Wins!`}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Congratulations to the winner! Play again?
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogAction onClick={resetGame}>Play Again</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        
            <div className="w-[500px] h-[500px] bg-background border-4 border-foreground rounded-lg relative shadow-2xl p-4">
                {/* Board structure */}
                <div className="w-full h-full relative">
                    <div className="absolute top-0 left-0 w-2/5 h-2/5 bg-red-200 rounded-lg flex items-center justify-center">
                        <div className="w-3/4 h-3/4 bg-red-300 rounded-lg"></div>
                    </div>
                    <div className="absolute top-0 right-0 w-2/5 h-2/5 bg-green-200 rounded-lg flex items-center justify-center">
                        <div className="w-3/4 h-3/4 bg-green-300 rounded-lg"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-2/5 h-2/5 bg-blue-200 rounded-lg flex items-center justify-center">
                         <div className="w-3/4 h-3/4 bg-blue-300 rounded-lg"></div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-2/5 h-2/5 bg-yellow-200 rounded-lg flex items-center justify-center">
                         <div className="w-3/4 h-3/4 bg-yellow-300 rounded-lg"></div>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/5 h-1/5 bg-background flex items-center justify-center">
                        <div className="w-full h-full relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[50px] border-l-transparent border-b-[50px] border-b-green-400 border-r-[50px] border-r-transparent"></div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-blue-400 border-r-[50px] border-r-transparent"></div>
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[50px] border-t-transparent border-r-[50px] border-r-red-400 border-b-[50px] border-b-transparent"></div>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[50px] border-t-transparent border-l-[50px] border-l-yellow-400 border-b-[50px] border-b-transparent"></div>
                        </div>
                    </div>
                </div>

                {/* Pieces */}
                 {Object.entries(pieces).map(([color, pieceArray]) => 
                    pieceArray.map((piece, index) => renderPiece(color, piece, index))
                 )}
            </div>
            
            <div className="mt-6 flex items-center gap-6 p-4 bg-muted rounded-lg shadow-inner">
                <div className="text-center">
                    <p className="font-semibold text-lg">Turn</p>
                    <div className={cn('w-24 h-10 rounded-md flex items-center justify-center font-bold text-white', {
                        'bg-red-500': turn === 'red',
                        'bg-green-500': turn === 'green',
                        'bg-yellow-500': turn === 'yellow',
                        'bg-blue-500': turn === 'blue',
                    })}>
                        {turn.charAt(0).toUpperCase() + turn.slice(1)}
                    </div>
                </div>

                <div className="text-center">
                    <p className="font-semibold text-lg mb-1">Dice</p>
                    <button onClick={handleDiceRoll} disabled={turn !== PLAYER_COLOR || !!winner || !!diceValue}>
                        <div className="w-24 h-24 bg-white rounded-lg shadow-lg flex items-center justify-center text-5xl font-bold text-primary">
                            {diceValue ? diceValue : <Dice5 className="w-16 h-16"/>}
                        </div>
                    </button>
                </div>
                 <div className="w-64 text-center">
                    <p className="font-semibold text-lg">Message</p>
                    <p className="h-10 flex items-center justify-center text-muted-foreground">{message}</p>
                </div>
            </div>
        </div>
    );
}
