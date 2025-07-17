// src/app/camera-tracer/page.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Camera, FlipHorizontal, Upload, Wand2, ZoomIn, ZoomOut } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function CameraTracerPage() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isEdgeDetected, setIsEdgeDetected] = useState(false);

  // Overlay state
  const [opacity, setOpacity] = useState(0.5);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Dragging state
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const getCameraPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasCameraPermission(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings to use this feature.',
      });
    }
  }, [facingMode, toast]);

  useEffect(() => {
    getCameraPermission();
    return () => {
        // Cleanup: stop camera stream when component unmounts
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [getCameraPermission]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        setIsEdgeDetected(false); // Reset edge detection on new image
        const img = new Image();
        img.onload = () => {
          if (imageRef.current) {
             imageRef.current.src = result;
          }
        }
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleFacingMode = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  const detectEdges = () => {
    if (!imageRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    
    canvas.width = imageRef.current.naturalWidth;
    canvas.height = imageRef.current.naturalHeight;
    
    ctx.drawImage(imageRef.current, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Simple grayscale and Sobel edge detection
    const grayscale = new Uint8ClampedArray(data.length / 4);
    for(let i=0; i<data.length; i+=4) {
        grayscale[i/4] = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
    }
    
    const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
    const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
    
    for(let y=1; y<canvas.height-1; y++) {
        for(let x=1; x<canvas.width-1; x++) {
            let gx = 0, gy = 0;
            for(let ky=-1; ky<=1; ky++) {
                for(let kx=-1; kx<=1; kx++) {
                    const idx = (y+ky) * canvas.width + (x+kx);
                    gx += grayscale[idx] * sobelX[ky+1][kx+1];
                    gy += grayscale[idx] * sobelY[ky+1][kx+1];
                }
            }
            const magnitude = Math.sqrt(gx*gx + gy*gy);
            const idx = (y * canvas.width + x) * 4;
            const color = magnitude > 100 ? 255 : 0; // threshold
            data[idx] = 255 - color;
            data[idx+1] = 255 - color;
            data[idx+2] = 255- color;
            data[idx+3] = color > 0 ? 255 : 0; // Set alpha
        }
    }
    ctx.putImageData(imageData, 0, 0);
    setUploadedImage(canvas.toDataURL());
    setIsEdgeDetected(true);
  };
  
  // Drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setPosition({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };
  const onMouseUp = () => { isDragging.current = false; };
  
  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
        isDragging.current = true;
        dragStart.current = { x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y };
    }
  }
   const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || e.touches.length !== 1) return;
     setPosition({ x: e.touches[0].clientX - dragStart.current.x, y: e.touches[0].clientY - dragStart.current.y });
  }
  const onTouchEnd = () => { isDragging.current = false; };
  

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <header className="p-4 border-b flex justify-between items-center">
        <h1 className="text-xl font-bold font-headline flex items-center gap-2">
            <Camera className="w-6 h-6 text-primary"/>
            Camera Tracer
        </h1>
        <div className='flex items-center gap-2'>
            <Button onClick={toggleFacingMode} variant="outline" size="icon">
                <FlipHorizontal className="w-5 h-5"/>
            </Button>
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="icon">
                <Upload className="w-5 h-5"/>
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden"/>
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden" onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" autoPlay muted playsInline />
        
        {hasCameraPermission === false && (
            <div className='absolute inset-0 flex items-center justify-center bg-black/50 p-4'>
                 <Alert variant="destructive" className="max-w-md">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                        Please allow camera access in your browser to use this feature. You may need to refresh the page after granting permission.
                    </AlertDescription>
                </Alert>
            </div>
        )}

        {uploadedImage && (
          <div
            className="absolute cursor-move"
            style={{ 
                left: position.x, 
                top: position.y,
                transform: `scale(${scale})`,
                opacity: opacity,
                touchAction: 'none' // Important for touch events
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <img
              ref={imageRef}
              src={uploadedImage}
              alt="Overlay"
              className="pointer-events-none max-w-full max-h-full"
            />
             <canvas ref={canvasRef} className="hidden" />
          </div>
        )}
      </div>
      
      {uploadedImage && (
      <footer className="p-4 border-t bg-background/80 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className='space-y-2'>
              <label className='text-sm font-medium'>Opacity</label>
              <Slider value={[opacity]} onValueChange={(v) => setOpacity(v[0])} max={1} step={0.05} />
          </div>
          <div className='space-y-2'>
              <label className='text-sm font-medium'>Zoom</label>
              <div className='flex items-center gap-2'>
                <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.max(0.1, s - 0.1))}>
                    <ZoomOut className="w-5 h-5"/>
                </Button>
                <Slider value={[scale]} onValueChange={(v) => setScale(v[0])} min={0.1} max={5} step={0.1} />
                <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.min(5, s + 0.1))}>
                    <ZoomIn className="w-5 h-5"/>
                </Button>
              </div>
          </div>
          <div className='flex items-end'>
            <Button onClick={detectEdges} disabled={isEdgeDetected} className='w-full'>
                <Wand2 className="w-5 h-5 mr-2"/>
                {isEdgeDetected ? 'Edges Highlighted' : 'Highlight Edges'}
            </Button>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
}
