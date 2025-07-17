import { Gamepad2 } from "lucide-react";

export default function GamesPage() {
  return (
    <div className="flex flex-col h-full items-center justify-center bg-background p-6 text-center">
      <Gamepad2 className="h-16 w-16 mb-4 text-primary" />
      <h1 className="text-4xl font-bold font-headline mb-2">LegeztPlay</h1>
      <p className="text-lg text-muted-foreground">
        Get ready to play. Exciting games coming soon!
      </p>
    </div>
  );
}
