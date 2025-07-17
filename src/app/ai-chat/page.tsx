// src/app/ai-chat/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Bot,
  User,
  Send,
  Loader2,
  Image as ImageIcon,
  ScanSearch,
  PenSquare,
  FileText,
  Sparkles,
  Mic,
} from 'lucide-react';
import { aiChat, AIChatInput } from '@/ai/flows/ai-chat';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const suggestedPrompts = [
  { icon: ImageIcon, text: 'Create an image of a futuristic city' },
  { icon: ScanSearch, text: 'Analyze this medical report' },
  { icon: PenSquare, text: 'Help me write a professional email' },
  { icon: FileText, text: 'Summarize the latest AI research paper' },
];

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (promptText: string) => {
    if (!promptText.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: promptText },
    ];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const result = await aiChat({ message: promptText });
      setMessages([
        ...newMessages,
        { role: 'assistant', content: result.response },
      ]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get a response from the AI.',
      });
      setMessages(newMessages); // Revert to previous messages on error
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSendMessage(input);
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 md:p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Sparkles className="w-16 h-16 mb-4 text-primary" />
              <h1 className="text-4xl font-bold font-headline mb-4">
                What can I help with?
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full mt-8">
                {suggestedPrompts.map((prompt, index) => (
                  <Card
                    key={index}
                    onClick={() => handleSendMessage(prompt.text)}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <prompt.icon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">{prompt.text}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-4',
                    message.role === 'user' ? 'justify-end' : ''
                  )}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-9 w-9 border">
                      <AvatarFallback>
                        <Bot className="h-5 w-5 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-xl p-4 rounded-xl whitespace-pre-wrap',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted rounded-bl-none'
                    )}
                  >
                    {message.content}
                  </div>
                  {message.role === 'user' && (
                     <Avatar className="h-9 w-9 border">
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
               {isLoading && (
                <div className="flex items-start gap-4">
                  <Avatar className="h-9 w-9 border">
                    <AvatarFallback>
                      <Bot className="h-5 w-5 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="max-w-xl p-4 rounded-xl bg-muted rounded-bl-none">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-background">
        <form onSubmit={handleFormSubmit} className="max-w-3xl mx-auto relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="w-full rounded-full bg-muted pr-24 pl-6 py-3 min-h-[52px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(input);
              }
            }}
            disabled={isLoading}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full" type="button" disabled={isLoading}>
                <Mic className="h-5 w-5"/>
            </Button>
            <Button
              type="submit"
              size="icon"
              className="rounded-full"
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
