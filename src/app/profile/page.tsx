import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex flex-col h-full items-center justify-center bg-background p-6 text-center">
      <User className="h-16 w-16 mb-4 text-primary" />
      <h1 className="text-4xl font-bold font-headline mb-2">Dashboard</h1>
      <p className="text-lg text-muted-foreground">
        Welcome to your personal dashboard. Content coming soon.
      </p>
    </div>
  );
}
