import { LogOut } from "lucide-react";

export default function LogoutPage() {
  return (
    <div className="flex flex-col h-full items-center justify-center bg-background p-6 text-center">
      <LogOut className="h-16 w-16 mb-4 text-primary" />
      <h1 className="text-4xl font-bold font-headline mb-2">Logging Out</h1>
      <p className="text-lg text-muted-foreground">
        You have been successfully logged out.
      </p>
    </div>
  );
}
