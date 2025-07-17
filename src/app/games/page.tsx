// src/app/games/page.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Gamepad2, Trophy, Crown, Dice5 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


// --- SNAKE GAME ---

const GRID_SIZE = 20;
const CELL_SIZE = 24;
const INITIAL_SPEED = 200;
const SPEED_INCREMENT = 5;

const getRandomCoordinate = () => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

const FoodSVG = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M50 5 L95 27.5 L95 72.5 L50 95 L5 72.5 L5 27.5 Z" fill="#F08080" stroke="#000" strokeWidth="3"/>
    </svg>
);

const SnakeHeadSVG = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        <circle cx="50" cy="50" r="45" fill="#FACC15" stroke="#000" strokeWidth="4" />
        <circle cx="35" cy="40" r="8" fill="black" />
        <circle cx="65" cy="40" r="8" fill="black" />
        <path d="M 30 70 Q 50 85 70 70" stroke="black" strokeWidth="4" fill="none" />
    </svg>
);


function SnakeGame() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState(getRandomCoordinate());
  const [direction, setDirection] = useState({ x: 0, y: -1 });
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  
  const gameBoardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedHighScore = localStorage.getItem('snakeHighScore');
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore, 10));
    }
    gameBoardRef.current?.focus();
  }, []);

  const resetGame = useCallback(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score.toString());
    }
    setSnake([{ x: 10, y: 10 }]);
    setFood(getRandomCoordinate());
    setDirection({ x: 0, y: -1 });
    setSpeed(INITIAL_SPEED);
    setScore(0);
    setIsGameOver(false);
    gameBoardRef.current?.focus();
  }, [score, highScore]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isGameOver) return;
    switch (e.key) {
      case 'ArrowUp':
        if (direction.y === 0) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
        if (direction.y === 0) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
        if (direction.x === 0) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
        if (direction.x === 0) setDirection({ x: 1, y: 0 });
        break;
    }
  }, [direction, isGameOver]);
  
  useEffect(() => {
    if (isGameOver) return;

    const gameInterval = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };

        head.x += direction.x;
        head.y += direction.y;

        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setIsGameOver(true);
          return prevSnake;
        }

        for (let i = 1; i < newSnake.length; i++) {
          if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
            setIsGameOver(true);
            return prevSnake;
          }
        }
        
        newSnake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 1);
          setSpeed((s) => Math.max(50, s - SPEED_INCREMENT));
          let newFoodPosition = getRandomCoordinate();
          while (newSnake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y)) {
            newFoodPosition = getRandomCoordinate();
          }
          setFood(newFoodPosition);
        } else {
          newSnake.pop();
        }
        
        return newSnake;
      });
    }, speed);

    return () => clearInterval(gameInterval);
  }, [snake, direction, speed, food, isGameOver]);

  const getRotation = (dir: {x: number, y: number}) => {
    if (dir.y === -1) return 0; // Up
    if (dir.x === 1) return 90; // Right
    if (dir.y === 1) return 180; // Down
    if (dir.x === -1) return 270; // Left
    return 0;
  }
  
  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <Card 
        className="shadow-2xl border-2 border-primary/20 p-2 relative bg-muted/30 rounded-2xl"
        style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
      >
        <div 
            ref={gameBoardRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="w-full h-full relative grid outline-none bg-green-900/10 rounded-lg"
            style={{ 
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            }}
        >
          {isGameOver && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10 rounded-md">
              <Trophy className="w-16 h-16 text-yellow-400 mb-4" />
              <h2 className="text-4xl font-bold text-white mb-2">Game Over</h2>
              <p className="text-lg text-white mb-6">Your Score: {score}</p>
              <Button onClick={resetGame} variant="secondary">
                Restart Game
              </Button>
            </div>
          )}
          {snake.map((segment, index) => (
            <div
              key={index}
              className="absolute transition-all duration-150 ease-linear"
              style={{
                  left: segment.x * CELL_SIZE,
                  top: segment.y * CELL_SIZE,
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  transform: index === 0 ? `rotate(${getRotation(direction)}deg)` : 'none',
                  zIndex: snake.length - index,
              }}
            >
              {index === 0 ? (
                  <SnakeHeadSVG />
              ) : (
                <div 
                    className="w-full h-full bg-[#FACC15] border-2 border-black/50"
                    style={{
                        borderRadius: '30%',
                    }}
                />
              )}
            </div>
          ))}
          <div
            className="absolute transition-all duration-150 ease-in-out"
            style={{
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
          >
            <FoodSVG />
          </div>
        </div>
      </Card>
      
      <div className="flex justify-between w-full mt-4 text-lg font-semibold" style={{maxWidth: GRID_SIZE * CELL_SIZE}}>
        <p>Score: <span className="text-primary font-bold">{score}</span></p>
        <p>High Score: <span className="text-primary font-bold">{highScore}</span></p>
      </div>
       <p className="text-sm text-muted-foreground mt-2">Use Arrow Keys to move</p>
    </div>
  );
}

// --- LUDO GAME ---

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
    const pieces = {};
    COLORS.forEach(color => {
        pieces[color] = Array(PIECE_COUNT).fill(0).map((_, i) => ({ id: i, position: -1, state: 'home' })); // -1: home, >0: on board, 100+: finished
    });
    return pieces;
}

function LudoGame() {
    const [pieces, setPieces] = useState(getInitialPieces());
    const [diceValue, setDiceValue] = useState(null);
    const [turn, setTurn] = useState('blue');
    const [winner, setWinner] = useState(null);
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
    
    const handlePieceClick = (color, pieceId) => {
        if (color !== PLAYER_COLOR || turn !== PLAYER_COLOR || !diceValue || winner) return;

        const piece = pieces[color][pieceId];
        
        if (piece.state === 'home') {
            if (diceValue === 6) {
                movePiece(color, pieceId, START_POSITIONS[color]);
            } else {
                setMessage("You must roll a 6 to move a piece out of home.");
            }
        } else if (piece.state === 'active') {
            // Simplified movement logic for now
            const currentPathIndex = PATHS[color].indexOf(piece.position);
            const newPathIndex = currentPathIndex + diceValue;
             if(newPathIndex < PATHS[color].length) {
                movePiece(color, pieceId, PATHS[color][newPathIndex]);
            } else {
                movePiece(color, pieceId, 100 + pieceId) // Mark as finished
            }
        }
    };

    const movePiece = (color, pieceId, newPosition) => {
        setPieces(prev => {
            const newPieces = JSON.parse(JSON.stringify(prev));
            newPieces[color][pieceId].position = newPosition;
            newPieces[color][pieceId].state = newPosition > 100 ? 'finished' : 'active';
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
                           movePiece(turn, movablePiece.id, START_POSITIONS[turn]);
                        } else {
                           const currentPathIndex = PATHS[turn].indexOf(movablePiece.position);
                           const newPathIndex = currentPathIndex + roll;
                           if(newPathIndex < PATHS[turn].length) {
                                movePiece(turn, movablePiece.id, PATHS[turn][newPathIndex]);
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
    }, [turn, winner]);
    
    // Check for winner
     useEffect(() => {
        for (const color of COLORS) {
            if (pieces[color].every(p => p.state === 'finished')) {
                setWinner(color);
                break;
            }
        }
    }, [pieces]);
    
    const renderPiece = (color, piece, index) => {
        const size = 'w-8 h-8';
        const baseClasses = `absolute rounded-full border-2 border-black flex items-center justify-center text-white font-bold`;
        const colorClasses = {
            red: 'bg-red-500',
            green: 'bg-green-500',
            yellow: 'bg-yellow-500',
            blue: 'bg-blue-500',
        };

        let positionStyle = {};

        // Home positions
        if(piece.state === 'home') {
            const homePositions = {
                red: [{top: '12%', left: '12%'}, {top: '12%', left: '28%'}, {top: '28%', left: '12%'}, {top: '28%', left: '28%'}],
                green: [{top: '12%', left: '62%'}, {top: '12%', left: '78%'}, {top: '28%', left: '62%'}, {top: '28%', left: '78%'}],
                yellow: [{top: '62%', left: '62%'}, {top: '62%', left: '78%'}, {top: '78%', left: '62%'}, {top: '78%', left: '78%'}],
                blue: [{top: '62%', left: '12%'}, {top: '62%', left: '28%'}, {top: '78%', left: '12%'}, {top: '78%', left: '28%'}],
            };
            positionStyle = homePositions[color][index];
        }
        
        // Path positions (simplified grid)
        if(piece.state === 'active') {
             const boardSize = 15;
             const y = Math.floor((piece.position - 1) / boardSize);
             const x = (piece.position - 1) % boardSize;
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
        <div className="flex flex-col items-center justify-center p-4">
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

export default function GamesPage() {
  return (
    <div className="flex flex-col h-full items-center bg-background p-4 text-center">
        <div className="flex items-center mb-4">
            <Gamepad2 className="h-10 w-10 mr-4 text-primary" />
            <h1 className="text-4xl font-bold font-headline">LegeztPlay</h1>
        </div>
        
        <Tabs defaultValue="snake" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto mb-4">
                <TabsTrigger value="snake">Snake</TabsTrigger>
                <TabsTrigger value="ludo">Ludo</TabsTrigger>
            </TabsList>
            <TabsContent value="snake">
                <SnakeGame />
            </TabsContent>
            <TabsContent value="ludo">
                <LudoGame />
            </TabsContent>
        </Tabs>
    </div>
  );
}
