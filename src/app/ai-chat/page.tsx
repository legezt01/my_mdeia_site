import { Bot } from "lucide-react";

export default function AIChatPage() {
  return (
    <div className="flex flex-col h-full items-center justify-center bg-background p-6 text-center">
      <Bot className="h-16 w-16 mb-4 text-primary" />
      <h1 className="text-4xl font-bold font-headline mb-2">AI Chat</h1>
      <p className="text-lg text-muted-foreground">
        Your intelligent assistant is here to help.
      </p>
      <div className="mt-8 text-left max-w-md w-full">
        {/* Chat interface will be built here */}
      </div>
    </div>
  );
}
