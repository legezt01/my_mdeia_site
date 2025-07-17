import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full items-center justify-center bg-background p-6 text-center">
      <Settings className="h-16 w-16 mb-4 text-primary" />
      <h1 className="text-4xl font-bold font-headline mb-2">Settings</h1>
      <p className="text-lg text-muted-foreground">
        Manage your application preferences. Settings options coming soon.
      </p>
    </div>
  );
}
