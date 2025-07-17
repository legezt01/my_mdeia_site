// src/app/calculator/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator as CalculatorIcon, Plus, Minus, X as MultiplyIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as math from 'mathjs';

const scientificButtonLayout = [
  ['sin', 'cos', 'tan', 'log', 'ln'],
  ['(', ')', 'sqrt(', 'x^2', '^'],
  ['7', '8', '9', 'DEL', 'AC'],
  ['4', '5', '6', '*', '/'],
  ['1', '2', '3', '+', '-'],
  ['0', '.', 'pi', 'e', '='],
];

function ScientificCalculator() {
  const [displayValue, setDisplayValue] = useState('0');
  const [expression, setExpression] = useState('');

  const handleButtonClick = (value: string) => {
    if (value === 'AC') {
      setDisplayValue('0');
      setExpression('');
    } else if (value === 'DEL') {
      if (expression.length > 1) {
        setExpression(expression.slice(0, -1));
        setDisplayValue(expression.slice(0, -1));
      } else {
        setDisplayValue('0');
        setExpression('');
      }
    } else if (value === '=') {
      try {
        // Sanitize expression for evaluation
        const sanitizedExpression = expression
          .replace(/x\^2/g, '^2')
          .replace(/sqrt\(/g, 'sqrt(');
        
        const result = math.evaluate(sanitizedExpression);
        const formattedResult = parseFloat(result.toPrecision(12));
        setDisplayValue(String(formattedResult));
        setExpression(String(formattedResult));
      } catch (error) {
        setDisplayValue('Error');
        setExpression('');
      }
    } else if (value === 'x^2') {
        setExpression(prev => `(${prev})^2`);
        setDisplayValue(prev => `(${prev})^2`);
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
    if (['=', '*', '/', '+', '-'].includes(btn)) return 'bg-primary/80 hover:bg-primary text-primary-foreground';
    if (['sin', 'cos', 'tan', 'log', 'ln', '(', ')', 'sqrt(', 'x^2', '^', 'pi', 'e'].includes(btn)) return 'bg-secondary hover:bg-secondary/80';
    return 'bg-muted hover:bg-muted/80';
  };
  
  return (
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardContent className="p-4">
          <div className="bg-muted text-right rounded-lg p-4 mb-4 h-24 flex flex-col justify-end border">
             <div className="text-muted-foreground text-sm h-6 truncate">{expression || ' '}</div>
            <div className="text-foreground text-4xl font-mono font-bold truncate">
              {displayValue}
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {scientificButtonLayout.flat().map((btn) => (
              <Button
                key={btn}
                onClick={() => handleButtonClick(btn)}
                className={cn('h-16 text-xl font-bold', getButtonClass(btn))}
                aria-label={btn}
              >
                {btn === 'sqrt(' ? '√' : btn}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
  )
}

function MatrixCalculator() {
    const [rowsA, setRowsA] = useState(2);
    const [colsA, setColsA] = useState(2);
    const [matrixA, setMatrixA] = useState(math.zeros(2, 2).toArray());
    
    const [rowsB, setRowsB] = useState(2);
    const [colsB, setColsB] = useState(2);
    const [matrixB, setMatrixB] = useState(math.zeros(2, 2).toArray());

    const [result, setResult] = useState<any>(null);

    const handleMatrixSizeChange = (setter: Function, rowSetter: Function, colSetter: Function, newRows: number, newCols: number) => {
        const r = Math.max(1, newRows);
        const c = Math.max(1, newCols);
        rowSetter(r);
        colSetter(c);
        setter(math.zeros(r, c).toArray());
        setResult(null);
    }

    const handleMatrixValueChange = (matrix: number[][], setter: Function, row: number, col: number, value: string) => {
        const newMatrix = [...matrix];
        newMatrix[row][col] = parseFloat(value) || 0;
        setter(newMatrix);
    }

    const performOperation = (op: 'add' | 'subtract' | 'multiply') => {
        try {
            const m1 = math.matrix(matrixA);
            const m2 = math.matrix(matrixB);
            let res;
            if (op === 'add') res = math.add(m1, m2);
            if (op === 'subtract') res = math.subtract(m1, m2);
            if (op === 'multiply') res = math.multiply(m1, m2);
            setResult(res.toArray());
        } catch (error) {
            setResult("Error: Incompatible matrix dimensions for this operation.");
        }
    }
    
    const renderMatrixInputs = (matrix: number[][], setter: Function, rows: number, cols: number) => {
        return Array.from({length: rows}).map((_, r) => (
            <div key={r} className="flex gap-2">
                {Array.from({length: cols}).map((_, c) => (
                    <Input
                        key={c}
                        type="number"
                        className="w-16 text-center"
                        value={matrix[r]?.[c] || 0}
                        onChange={(e) => handleMatrixValueChange(matrix, setter, r, c, e.target.value)}
                    />
                ))}
            </div>
        ));
    };

    return (
        <Card className="w-full max-w-4xl shadow-2xl border-0 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Matrix A */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg">Matrix A</h3>
                    <div className="flex gap-2 items-center">
                        <Input type="number" value={rowsA} onChange={(e) => handleMatrixSizeChange(setMatrixA, setRowsA, setColsA, parseInt(e.target.value), colsA)} className="w-20" min="1" />
                        <span className="text-muted-foreground">x</span>
                        <Input type="number" value={colsA} onChange={(e) => handleMatrixSizeChange(setMatrixA, setRowsA, setColsA, rowsA, parseInt(e.target.value))} className="w-20" min="1" />
                    </div>
                    <div className="space-y-2 p-2 bg-muted rounded-md">{renderMatrixInputs(matrixA, setMatrixA, rowsA, colsA)}</div>
                </div>

                {/* Operations */}
                <div className="flex flex-col items-center justify-center space-y-4">
                    <h3 className="font-bold text-lg">Operations</h3>
                     <Button onClick={() => performOperation('add')} size="icon"><Plus /></Button>
                     <Button onClick={() => performOperation('subtract')} size="icon"><Minus /></Button>
                     <Button onClick={() => performOperation('multiply')} size="icon"><MultiplyIcon /></Button>
                </div>

                {/* Matrix B */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg">Matrix B</h3>
                    <div className="flex gap-2 items-center">
                        <Input type="number" value={rowsB} onChange={(e) => handleMatrixSizeChange(setMatrixB, setRowsB, setColsB, parseInt(e.target.value), colsB)} className="w-20" min="1" />
                         <span className="text-muted-foreground">x</span>
                        <Input type="number" value={colsB} onChange={(e) => handleMatrixSizeChange(setMatrixB, setRowsB, setColsB, rowsB, parseInt(e.target.value))} className="w-20" min="1" />
                    </div>
                    <div className="space-y-2 p-2 bg-muted rounded-md">{renderMatrixInputs(matrixB, setMatrixB, rowsB, colsB)}</div>
                </div>
            </div>
            {result && (
                <div className="mt-6">
                    <h3 className="font-bold text-lg mb-2">Result</h3>
                    {typeof result === 'string' ? (
                        <p className="text-destructive">{result}</p>
                    ) : (
                         <div className="p-4 bg-primary/10 rounded-md inline-block">
                             {result.map((row: number[], r: number) => (
                                 <div key={r} className="flex gap-4">
                                     {row.map((val, c) => <span key={c} className="font-mono text-lg w-20 text-center">{val.toFixed(2)}</span>)}
                                 </div>
                             ))}
                         </div>
                    )}
                </div>
            )}
        </Card>
    );
}


function EquationSolver() {
    const [a, setA] = useState('');
    const [b, setB] = useState('');
    const [c, setC] = useState('');
    const [roots, setRoots] = useState<string[] | string | null>(null);

    const solveQuadratic = () => {
        const valA = parseFloat(a);
        const valB = parseFloat(b);
        const valC = parseFloat(c);

        if (isNaN(valA) || isNaN(valB) || isNaN(valC)) {
            setRoots("Please enter valid numbers for all coefficients.");
            return;
        }

        if (valA === 0) {
            setRoots("Coefficient 'a' cannot be zero for a quadratic equation.");
            return;
        }

        const delta = valB * valB - 4 * valA * valC;

        if (delta > 0) {
            const x1 = (-valB + Math.sqrt(delta)) / (2 * valA);
            const x2 = (-valB - Math.sqrt(delta)) / (2 * valA);
            setRoots([`x₁ = ${x1.toFixed(4)}`, `x₂ = ${x2.toFixed(4)}`]);
        } else if (delta === 0) {
            const x = -valB / (2 * valA);
            setRoots([`x = ${x.toFixed(4)} (repeated root)`]);
        } else {
             const realPart = (-valB / (2 * valA)).toFixed(4);
             const imagPart = (Math.sqrt(-delta) / (2 * valA)).toFixed(4);
             setRoots([`x₁ = ${realPart} + ${imagPart}i`, `x₂ = ${realPart} - ${imagPart}i`]);
        }
    }

    return (
        <Card className="w-full max-w-md shadow-2xl border-0 p-6">
            <h3 className="text-xl font-bold mb-4 text-center">Quadratic Equation Solver</h3>
            <p className="text-center text-muted-foreground mb-6 font-mono text-lg">ax² + bx + c = 0</p>
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Label htmlFor="coeff-a" className="w-8 text-lg font-mono">a =</Label>
                    <Input id="coeff-a" type="number" placeholder="Coefficient a" value={a} onChange={e => setA(e.target.value)} />
                </div>
                <div className="flex items-center gap-2">
                    <Label htmlFor="coeff-b" className="w-8 text-lg font-mono">b =</Label>
                    <Input id="coeff-b" type="number" placeholder="Coefficient b" value={b} onChange={e => setB(e.target.value)} />
                </div>
                 <div className="flex items-center gap-2">
                    <Label htmlFor="coeff-c" className="w-8 text-lg font-mono">c =</Label>
                    <Input id="coeff-c" type="number" placeholder="Coefficient c" value={c} onChange={e => setC(e.target.value)} />
                </div>
            </div>
            <Button onClick={solveQuadratic} className="w-full mt-6">Solve</Button>
            {roots && (
                 <div className="mt-6 text-center">
                    <h4 className="font-bold text-lg mb-2">Roots</h4>
                    {typeof roots === 'string' ? (
                        <p className="text-destructive">{roots}</p>
                    ) : (
                        <div className="space-y-2 font-mono text-xl text-primary">
                            {roots.map((root, i) => <p key={i}>{root}</p>)}
                        </div>
                    )}
                 </div>
            )}
        </Card>
    );
}


export default function CalculatorPage() {
  
  return (
    <div className="flex flex-col h-full items-center justify-center bg-background p-4">
        <div className='flex items-center mb-4'>
            <CalculatorIcon className="h-10 w-10 mr-4 text-primary" />
            <h1 className="text-4xl font-bold font-headline">Advanced Calculator</h1>
        </div>
        <Tabs defaultValue="scientific" className="w-full max-w-4xl">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-4">
                <TabsTrigger value="scientific">Scientific</TabsTrigger>
                <TabsTrigger value="matrix">Matrix</TabsTrigger>
                <TabsTrigger value="equation">Equation</TabsTrigger>
            </TabsList>
            <TabsContent value="scientific" className="flex justify-center">
                <ScientificCalculator />
            </TabsContent>
            <TabsContent value="matrix" className="flex justify-center">
                <MatrixCalculator />
            </TabsContent>
             <TabsContent value="equation" className="flex justify-center">
                <EquationSolver />
            </TabsContent>
        </Tabs>
    </div>
  );
}
