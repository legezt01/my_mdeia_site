import { Image as ImageIcon } from "lucide-react";

export default function LegezterestPage() {
  return (
    <div className="flex flex-col h-full items-center justify-center bg-background p-6 text-center">
      <ImageIcon className="h-16 w-16 mb-4 text-primary" />
      <h1 className="text-4xl font-bold font-headline mb-2">Legezterest</h1>
      <p className="text-lg text-muted-foreground">
        Discover and save creative ideas. Image galleries coming soon.
      </p>
    </div>
  );
}
