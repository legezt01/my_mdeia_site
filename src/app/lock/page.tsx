import { Lock } from "lucide-react";

export default function LockPage() {
  return (
    <div className="flex flex-col h-full items-center justify-center bg-background p-6 text-center">
      <Lock className="h-16 w-16 mb-4 text-primary" />
      <h1 className="text-4xl font-bold font-headline mb-2">App Locked</h1>
      <p className="text-lg text-muted-foreground">
        Enter your credentials to unlock the application.
      </p>
    </div>
  );
}
