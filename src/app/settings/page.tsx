// src/app/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Sparkles, Flame, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const themes = [
  { name: 'Light', class: 'light', icon: Sun, color: 'bg-slate-100' },
  { name: 'Dark', class: 'dark', icon: Moon, color: 'bg-slate-900' },
  { name: 'Cream', class: 'cream', icon: Sparkles, color: 'bg-amber-50' },
  { name: 'Fire', class: 'fire', icon: Flame, color: 'bg-orange-500' },
] as const;

type Theme = typeof themes[number]['class'];

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<Theme>('light');
  const { toast } = useToast();

  useEffect(() => {
    // On mount, read the saved theme from localStorage or default to 'light'
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'light';
    setSelectedTheme(savedTheme);
    document.documentElement.className = savedTheme;
    setMounted(true);
  }, []);

  const handleThemeChange = (theme: Theme) => {
    setSelectedTheme(theme);
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  };
  
  const handleSave = () => {
    toast({
        title: "Settings Saved",
        description: `Theme changed to ${selectedTheme}.`,
    });
  };

  if (!mounted) {
    return null; // or a loading spinner
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold font-headline mb-8">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Choose a theme for your application.
          </p>
          <RadioGroup
            value={selectedTheme}
            onValueChange={(value: Theme) => handleThemeChange(value)}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {themes.map((theme) => (
              <Label
                key={theme.name}
                htmlFor={theme.class}
                className="relative block cursor-pointer rounded-lg border-2 p-4 transition-all focus:outline-none"
                style={{
                   borderColor: selectedTheme === theme.class ? 'hsl(var(--primary))' : 'hsl(var(--border))'
                }}
              >
                <RadioGroupItem value={theme.class} id={theme.class} className="sr-only" />
                {selectedTheme === theme.class && (
                  <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-full',
                      theme.color
                    )}
                  >
                    <theme.icon className="h-6 w-6 text-white mix-blend-difference" />
                  </div>
                  <span className="font-medium text-foreground">{theme.name}</span>
                </div>
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
      
      <div className="mt-8 flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
