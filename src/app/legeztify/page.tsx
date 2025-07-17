import { Music } from "lucide-react";

export default function LegeztifyPage() {
  return (
    <div className="flex flex-col h-full items-center justify-center bg-background p-6 text-center">
      <Music className="h-16 w-16 mb-4 text-primary" />
      <h1 className="text-4xl font-bold font-headline mb-2">Legeztify</h1>
      <p className="text-lg text-muted-foreground">
        Your personal soundtrack awaits. Music player coming soon.
      </p>
    </div>
  );
}
