import * as React from "react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PromptPreviewDialogProps {
  title: string;
  content: string;
  onApply: (finalText: string) => void;
  trigger?: React.ReactNode;
}

export function PromptPreviewDialog({
  title,
  content,
  onApply,
  trigger,
}: PromptPreviewDialogProps) {
  const [values, setValues] = React.useState<Record<string, string>>({});

  // Find all unique placeholders in the content using regex
  const placeholders = React.useMemo(() => {
    const matches = content.match(/\{\{(\w+)\}\}/g) || [];
    return [...new Set(matches.map((match) => match.slice(2, -2)))];
  }, [content]);

  const handleApply = () => {
    let finalText = content;
    // Replace placeholders with user input
    for (const key in values) {
      finalText = finalText.replace(
        new RegExp(`\\{\\{${key}\\}\\}`, "g"),
        values[key],
      );
    }
    onApply(finalText);
  };

  // Preview text with filled placeholders
  const previewText = React.useMemo(() => {
    let preview = content;
    for (const key in values) {
      preview = preview.replace(
        new RegExp(`\\{\\{${key}\\}\\}`, "g"),
        values[key] || `{{${key}}}`,
      );
    }
    return preview;
  }, [content, values]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger || <Button variant="outline">Preview Template</Button>}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            {placeholders.length > 0 && (
              <div className="mb-4 space-y-4">
                <p>Fill in the template variables:</p>
                {placeholders.map((placeholder) => (
                  <div
                    key={placeholder}
                    className="grid w-full items-center gap-1.5"
                  >
                    <Label htmlFor={placeholder}>{placeholder}</Label>
                    <Input
                      type="text"
                      id={placeholder}
                      value={values[placeholder] || ""}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          [placeholder]: e.target.value,
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="space-y-2">
              <p className="font-medium">Preview:</p>
              <div
                className={cn(
                  "rounded-md bg-muted p-4 whitespace-pre-wrap",
                  "text-sm leading-normal",
                )}
              >
                {previewText}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleApply}>
            Apply Template
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
