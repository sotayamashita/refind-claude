import type { FC } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Template {
  title: string;
  content: string;
}

interface Props {
  templates: Template[];
  onTemplateSelect: (template: Template) => void;
  onSettingsClick: () => void;
}

export const ChatGPTTemplateList: FC<Props> = ({
  templates,
  onTemplateSelect,
  onSettingsClick,
}) => {
  const templateNoteClassName = (requiredHover: boolean) =>
    cn(
      "flex items-center text-sm focus-visible:outline-0 radix-disabled:pointer-events-none radix-disabled:opacity-50 group relative focus-visible:bg-[#f5f5f5] radix-state-open:bg-[#f5f5f5] dark:focus-visible:bg-token-main-surface-secondary rounded-md my-0 mx-2 dark:radix-state-open:bg-token-main-surface-secondary p-2",
      requiredHover
        ? "hover:bg-[#F5F5F5] dark:hover:bg-[#424242] cursor-pointer"
        : "",
    );

  return (
    <>
      <div>
        {templates.length === 0 ? (
          <div className={templateNoteClassName(false)}>No templates found</div>
        ) : (
          <>
            {templates.map((template, index) => (
              <div
                key={index}
                className={templateNoteClassName(true)}
                onClick={() => onTemplateSelect(template)}
              >
                {template.title}
              </div>
            ))}
          </>
        )}
      </div>
      <div className="mt-2 px-2">
        <Button onClick={onSettingsClick} className={cn("w-full text-sm")}>
          Create & Edit Templates
        </Button>
      </div>
    </>
  );
};
