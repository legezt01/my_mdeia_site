// src/app/games/snake/page.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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

export default function SnakeGame() {
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

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) => {
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
    window.addEventListener('keydown', handleKeyDown as EventListener);
    return () => {
        window.removeEventListener('keydown', handleKeyDown as EventListener);
    }
  }, [handleKeyDown]);

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
    <div className="flex flex-col items-center justify-center text-center p-4 min-h-screen bg-background">
        <h1 className="text-4xl font-bold font-headline mb-4">Snake Game</h1>
      <Card 
        className="shadow-2xl border-2 border-primary/20 p-2 relative bg-muted/30 rounded-2xl"
        style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
      >
        <div 
            ref={gameBoardRef}
            tabIndex={0}
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