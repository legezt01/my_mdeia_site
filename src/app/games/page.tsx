// src/app/games/page.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Gamepad2, Trophy, Apple } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Game settings
const GRID_SIZE = 20;
const CELL_SIZE = 24; // in pixels
const INITIAL_SPEED = 200; // in ms
const SPEED_INCREMENT = 5;

const getRandomCoordinate = () => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

export default function GamesPage() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState(getRandomCoordinate());
  const [direction, setDirection] = useState({ x: 0, y: -1 }); // Start moving up
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
  }, [direction]);
  
  useEffect(() => {
    if (isGameOver) return;

    const gameInterval = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };

        head.x += direction.x;
        head.y += direction.y;

        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Self collision
        for (let i = 1; i < newSnake.length; i++) {
          if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
            setIsGameOver(true);
            return prevSnake;
          }
        }
        
        newSnake.unshift(head);

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 1);
          setSpeed((s) => Math.max(50, s - SPEED_INCREMENT));
          let newFoodPosition = getRandomCoordinate();
          // Ensure new food is not on the snake
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

  const getEyeStyle = (dir: {x: number, y: number}) => {
    if (dir.y === -1) return 'flex-col items-center top-[20%]'; // Up
    if (dir.y === 1) return 'flex-col items-center bottom-[20%]'; // Down
    if (dir.x === -1) return 'flex-row items-center left-[20%]'; // Left
    if (dir.x === 1) return 'flex-row items-center right-[20%]'; // Right
    return '';
  }

  return (
    <div className="flex flex-col h-full items-center justify-center bg-background p-4 text-center">
      <div className="flex items-center mb-4">
        <Gamepad2 className="h-10 w-10 mr-4 text-primary" />
        <h1 className="text-4xl font-bold font-headline">LegeztPlay</h1>
      </div>
      <p className="text-muted-foreground mb-4">Classic Snake Game</p>

      <Card 
        className="shadow-2xl border-2 border-primary/20 p-2 relative"
        style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
      >
        <div 
            ref={gameBoardRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="bg-muted rounded-md w-full h-full relative grid outline-none"
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

          {/* Render Snake */}
          {snake.map((segment, index) => (
            <div
              key={index}
              className="relative"
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
              }}
            >
              <div
                className={cn(
                  "absolute inset-0 rounded-md",
                  index === 0 ? "bg-primary" : "bg-primary/70 scale-90 rounded-lg"
                )}
              >
                {index === 0 && (
                  <div className={cn("absolute inset-0 flex justify-around", getEyeStyle(direction))}>
                    <div className="w-1/4 h-1/4 bg-white rounded-full border border-primary/50"></div>
                    <div className="w-1/4 h-1/4 bg-white rounded-full border border-primary/50"></div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Render Food */}
          <div
            className="flex items-center justify-center"
            style={{
              gridColumnStart: food.x + 1,
              gridRowStart: food.y + 1,
            }}
          >
            <Apple className="w-5 h-5 text-destructive animate-pulse" />
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
