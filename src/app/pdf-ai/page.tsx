import { FileText } from "lucide-react";

export default function PdfAiPage() {
  return (
    <div className="flex flex-col h-full items-center justify-center bg-background p-6 text-center">
      <FileText className="h-16 w-16 mb-4 text-primary" />
      <h1 className="text-4xl font-bold font-headline mb-2">PDF AI</h1>
      <p className="text-lg text-muted-foreground">
        Unlock insights from your documents. PDF analysis tool coming soon.
      </p>
    </div>
  );
}
