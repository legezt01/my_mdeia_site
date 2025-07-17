// src/app/calculator/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator as CalculatorIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonLayout = [
  ['sin', 'cos', 'tan', 'log', 'ln'],
  ['(', ')', '√', 'x²', '^'],
  ['7', '8', '9', 'DEL', 'AC'],
  ['4', '5', '6', '×', '÷'],
  ['1', '2', '3', '+', '-'],
  ['0', '.', 'π', 'EXP', '='],
];

export default function CalculatorPage() {
  const [displayValue, setDisplayValue] = useState('0');
  const [expression, setExpression] = useState('');

  const handleButtonClick = (value: string) => {
    if (value === 'AC') {
      setDisplayValue('0');
      setExpression('');
    } else if (value === 'DEL') {
      if (displayValue.length > 1) {
        setDisplayValue(displayValue.slice(0, -1));
        setExpression(expression.slice(0, -1));
      } else {
        setDisplayValue('0');
        setExpression('');
      }
    } else if (value === '=') {
      try {
        // Replace user-friendly symbols with JS-friendly ones
        const evalExpression = expression
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/√/g, 'Math.sqrt')
          .replace(/\^/g, '**')
          .replace(/sin/g, 'Math.sin')
          .replace(/cos/g, 'Math.cos')
          .replace(/tan/g, 'Math.tan')
          .replace(/log/g, 'Math.log10')
          .replace(/ln/g, 'Math.log')
          .replace(/π/g, 'Math.PI')
          .replace(/EXP/g, '*10**');

        // eslint-disable-next-line no-eval
        const result = eval(evalExpression);
        const formattedResult = parseFloat(result.toPrecision(12));
        setDisplayValue(String(formattedResult));
        setExpression(String(formattedResult));
      } catch (error) {
        setDisplayValue('Error');
        setExpression('');
      }
    } else {
      if (displayValue === '0' || displayValue === 'Error') {
        setDisplayValue(value);
        setExpression(value);
      } else {
        setDisplayValue(displayValue + value);
        setExpression(expression + value);
      }
    }
  };

  const getButtonClass = (btn: string) => {
    if (['DEL', 'AC'].includes(btn)) return 'bg-destructive/80 hover:bg-destructive text-destructive-foreground';
    if (['=', '×', '÷', '+', '-'].includes(btn)) return 'bg-primary/80 hover:bg-primary text-primary-foreground';
    if (['sin', 'cos', 'tan', 'log', 'ln', '(', ')', '√', 'x²', '^', 'π', 'EXP'].includes(btn)) return 'bg-secondary hover:bg-secondary/80';
    return 'bg-muted hover:bg-muted/80';
  };

  return (
    <div className="flex flex-col h-full items-center justify-center bg-background p-4">
        <div className='flex items-center mb-4'>
            <CalculatorIcon className="h-10 w-10 mr-4 text-primary" />
            <h1 className="text-4xl font-bold font-headline">Scientific Calculator</h1>
        </div>
      <Card className="w-full max-w-md shadow-2xl border-4 border-muted">
        <CardContent className="p-4">
          <div className="bg-muted text-right rounded-lg p-4 mb-4 h-24 flex flex-col justify-end border">
             <div className="text-muted-foreground text-sm h-6 truncate">{expression || ' '}</div>
            <div className="text-foreground text-4xl font-mono font-bold truncate">
              {displayValue}
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {buttonLayout.flat().map((btn) => (
              <Button
                key={btn}
                onClick={() => handleButtonClick(btn)}
                className={cn('h-16 text-xl font-bold', getButtonClass(btn))}
                aria-label={btn}
              >
                {btn}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      <p className="text-muted-foreground mt-4 text-sm">
        Modeled after Classwiz fx-83/85GT
      </p>
    </div>
  );
}
