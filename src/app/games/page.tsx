// src/app/games/page.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Gamepad2, Trophy } from 'lucide-react';
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

// SVG Components for the new snake design

const FoodSVG = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M50 5 L95 27.5 L95 72.5 L50 95 L5 72.5 L5 27.5 Z" fill="#F08080" stroke="#000" strokeWidth="3"/>
    </svg>
);

const SnakeHeadSVG = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        <path d="M 50 10 C 20 10, 10 40, 10 60 L 10 90 C 10 95, 15 100, 20 100 L 80 100 C 85 100, 90 95, 90 90 L 90 60 C 90 40, 80 10, 50 10 Z" fill="#FACC15" stroke="#000" strokeWidth="3" />
        <circle cx="35" cy="45" r="5" fill="black" />
        <circle cx="65" cy="45" r="5" fill="black" />
        {/* Spots */}
        <circle cx="50" cy="75" r="10" fill="#16A34A" stroke="#000" strokeWidth="2" />
        <path d="M 20 25 A 10 10 0 0 1 30 25" fill="#16A34A" stroke="#000" strokeWidth="2" />
        <path d="M 70 25 A 10 10 0 0 1 80 25" fill="#16A34A" stroke="#000" strokeWidth="2" />
    </svg>
);

const SnakeBodySVG = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        <rect x="10" y="0" width="80" height="100" fill="#FACC15" />
        <line x1="10" y1="0" x2="10" y2="100" stroke="black" strokeWidth="3" />
        <line x1="90" y1="0" x2="90" y2="100" stroke="black" strokeWidth="3" />
        <circle cx="50" cy="25" r="12" fill="#16A34A" stroke="#000" strokeWidth="2" />
        <circle cx="25" cy="75" r="8" fill="#16A34A" stroke="#000" strokeWidth="2" />
        <circle cx="75" cy="75" r="8" fill="#16A34A" stroke="#000" strokeWidth="2" />
    </svg>
);

const SnakeTailSVG = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        <path d="M 10 0 L 90 0 L 90 50 C 90 80, 70 90, 50 100 C 30 90, 10 80, 10 50 L 10 0 Z" fill="#FACC15" />
        <line x1="10" y1="0" x2="10" y2="50" stroke="black" strokeWidth="3" />
        <line x1="90" y1="0" x2="90" y2="50" stroke="black" strokeWidth="3" />
        <path d="M 10 50 C 10 80, 30 90, 50 100 C 70 90, 90 80, 90 50" stroke="black" strokeWidth="3" fill="none"/>
        <circle cx="50" cy="25" r="10" fill="#16A34A" stroke="#000" strokeWidth="2" />
    </svg>
);

const SnakeCornerSVG = () => (
     <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        <path d="M10 100 L10 10 C10 5, 15 0, 20 0 L100 0 L100 10 L25 10 C20 10, 15 15, 15 20 L15 100 Z" fill="#FACC15" stroke="#000" strokeWidth="3" />
        <circle cx="50" cy="50" r="15" fill="#16A34A" stroke="#000" strokeWidth="2" />
    </svg>
)

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

  const getRotation = (dir: {x: number, y: number}) => {
    if (dir.y === -1) return 0; // Up
    if (dir.x === 1) return 90; // Right
    if (dir.y === 1) return 180; // Down
    if (dir.x === -1) return 270; // Left
    return 0;
  }
  
  const getSegmentRotation = (prev: {x: number, y: number}, current: {x: number, y: number}) => {
      const dx = current.x - prev.x;
      const dy = current.y - prev.y;
      return getRotation({x: dx, y: dy});
  }

  const isCorner = (index: number) => {
    if (index === 0 || index === snake.length - 1) return false;
    const prev = snake[index + 1];
    const current = snake[index];
    const next = snake[index - 1];
    return prev.x !== next.x && prev.y !== next.y;
  }
  
  const getCornerRotation = (index: number) => {
    const prev = snake[index + 1];
    const current = snake[index];
    const next = snake[index - 1];
    const dir1 = { x: current.x - prev.x, y: current.y - prev.y };
    const dir2 = { x: next.x - current.x, y: next.y - current.y };

    if ((dir1.x === 1 && dir2.y === -1) || (dir1.y === 1 && dir2.x === -1)) return 0; // Top-Right
    if ((dir1.y === -1 && dir2.x === -1) || (dir1.x === 1 && dir2.y === 1)) return 270; // Top-Left
    if ((dir1.x === -1 && dir2.y === -1) || (dir1.y === 1 && dir2.x === 1)) return 180; // Bottom-Left
    if ((dir1.y === -1 && dir2.x === 1) || (dir1.x === -1 && dir2.y === 1)) return 90; // Bottom-Right
    return 0;
  };


  return (
    <div className="flex flex-col h-full items-center justify-center bg-background p-4 text-center">
      <div className="flex items-center mb-4">
        <Gamepad2 className="h-10 w-10 mr-4 text-primary" />
        <h1 className="text-4xl font-bold font-headline">LegeztPlay</h1>
      </div>
      <p className="text-muted-foreground mb-4">Classic Snake Game</p>

      <Card 
        className="shadow-2xl border-2 border-primary/20 p-2 relative bg-muted/30"
        style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
      >
        <div 
            ref={gameBoardRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="w-full h-full relative grid outline-none"
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
          {snake.map((segment, index) => {
            const rotation = index === 0 
                ? getRotation(direction) 
                : getSegmentRotation(snake[index - 1], segment);

            const tailRotation = index === snake.length - 1 && snake.length > 1
                ? getSegmentRotation(segment, snake[index - 1])
                : 0;

            const isCornerSegment = isCorner(index);
            const cornerRotation = isCornerSegment ? getCornerRotation(index) : 0;
            
            return (
                <div
                key={index}
                className="absolute"
                style={{
                    left: segment.x * CELL_SIZE,
                    top: segment.y * CELL_SIZE,
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                }}
                >
                <div
                    className="w-full h-full"
                    style={{
                        transform: `rotate(${
                            index === 0 ? rotation :
                            index === snake.length - 1 ? tailRotation :
                            isCornerSegment ? cornerRotation : rotation
                        }deg)`
                    }}
                >
                    {index === 0 && <SnakeHeadSVG />}
                    {index > 0 && index < snake.length - 1 && (isCornerSegment ? <SnakeCornerSVG /> : <SnakeBodySVG />)}
                    {index === snake.length - 1 && snake.length > 1 && <SnakeTailSVG />}
                </div>
                </div>
            )
          })}

          {/* Render Food */}
          <div
            className="absolute"
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
