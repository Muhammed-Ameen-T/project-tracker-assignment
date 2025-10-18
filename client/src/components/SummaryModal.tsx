import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SummaryModalProps {
  open: boolean;
  onClose: () => void;
  summary: string | undefined;
  projectName: string;
  isLoading: boolean;
}

export const SummaryModal = ({
  open,
  onClose,
  summary,
  projectName,
  isLoading,
}: SummaryModalProps) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <Card
        className="p-6 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h4 className="text-xl font-bold mb-3">AI Summary for {projectName}</h4>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Generating analysis...</span>
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">
            {summary || "No summary generated yet."}
          </p>
        )}

        <Button onClick={onClose} className="mt-6 float-right">
          Close
        </Button>
      </Card>
    </div>
  );
};
