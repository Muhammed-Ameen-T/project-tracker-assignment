import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, MessageSquare } from "lucide-react";

interface QnAModalProps {
  open: boolean;
  onClose: () => void;
  onAsk: (question: string) => Promise<void>; 
  isLoading: boolean;
  result: string | null;
  taskTitle: string;
}

export const QnAModal = ({
  open,
  onClose,
  onAsk,
  isLoading,
  result,
  taskTitle,
}: QnAModalProps) => {
  const [question, setQuestion] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    await onAsk(question);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <Card
        className="p-6 max-w-xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h4 className="text-xl font-bold mb-3">
          Ask Assistant about: {taskTitle}
        </h4>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="What is the next step for this task?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <MessageSquare className="h-4 w-4 mr-2" />
            )}
            Get Answer
          </Button>
        </form>

        <div className="mt-6 p-3 bg-secondary/50 rounded min-h-[70px]">
          <p className="text-sm font-medium mb-1">AI Response:</p>
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? "Waiting for response..."
              : result || "Enter a question above to begin chat."}
          </p>
        </div>

        <Button
          onClick={onClose}
          variant="outline"
          className="mt-4 float-right"
        >
          Close
        </Button>
      </Card>
    </div>
  );
};
