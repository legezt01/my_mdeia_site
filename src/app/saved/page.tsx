import { Bookmark } from "lucide-react";

export default function SavedContentPage() {
  return (
    <div className="flex flex-col h-full items-center justify-center bg-background p-6 text-center">
      <Bookmark className="h-16 w-16 mb-4 text-primary" />
      <h1 className="text-4xl font-bold font-headline mb-2">Saved Content</h1>
      <p className="text-lg text-muted-foreground">
        All your saved items in one place. Feature coming soon.
      </p>
    </div>
  );
}
