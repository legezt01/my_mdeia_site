import { Youtube } from "lucide-react";

export default function LegeztTubePage() {
  return (
    <div className="flex flex-col h-full items-center justify-center bg-background p-6 text-center">
      <Youtube className="h-16 w-16 mb-4 text-primary" />
      <h1 className="text-4xl font-bold font-headline mb-2">LegeztTube</h1>
      <p className="text-lg text-muted-foreground">
        Your next favorite video is waiting. Video content coming soon.
      </p>
    </div>
  );
}
