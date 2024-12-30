/* eslint-disable tailwindcss/no-custom-classname */
import type { FC } from "react";
import { cn } from "@/lib/utils";

interface Template {
  title: string;
  content: string;
}

interface Props {
  templates: Template[];
  onTemplateSelect: (template: Template) => void;
  onSettingsClick: () => void;
}

export const ClaudeTemplateList: FC<Props> = ({
  templates,
  onTemplateSelect,
  onSettingsClick,
}) => {
  return (
    <>
      <div className="text-text-300 min-h-5 flex-1 items-center justify-between px-1.5 pb-1.5 pt-1 text-xs font-medium sm:flex">
        <div className="translate-y-[0.5px]">Choose a template</div>
      </div>

      <div className="mt-0.5 px-1 pb-1">
        <div className="min-h-0">
          <div
            className={cn(
              "overflow-x-visible overflow-y-auto scroll-pb-6 min-h-[0px]",
              "[scrollbar-color:hsl(var(--text-500))]",
              "scroll-smooth overscroll-contain",
              "[&::-webkit-scrollbar]:w-[0.25rem]",
              "[&::-webkit-scrollbar-track]:bg-transparent",
              "[&::-webkit-scrollbar-thumb]:rounded-[1em]",
              "[&::-webkit-scrollbar-thumb]:bg-text-500/80",
              "pr-1 sm:mr-1 pb-1 min-h-10 max-h-64",
            )}
          >
            {templates.length === 0 ? (
              <div className="text-text-300 px-2 py-1 text-sm">
                No templates found
              </div>
            ) : (
              templates.map((template, index) => (
                <div
                  key={index}
                  role="menuitem"
                  className={cn(
                    "py-1 px-2 rounded-md cursor-pointer whitespace-nowrap",
                    "overflow-hidden text-ellipsis grid",
                    "grid-cols-[minmax(0,_1fr)_auto] gap-2 items-center",
                    "outline-none select-none pr-0 mb-0.5 line-clamp-2",
                    "leading-tight hover:bg-bg-300",
                  )}
                  onClick={() => onTemplateSelect(template)}
                >
                  <div className="flex items-center justify-between">
                    <div className="line-clamp-2 flex-1 text-wrap">
                      {template.title}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div
            role="menuitem"
            data-testid="template-selector-open-modal"
            className={cn(
              "py-1 px-2 rounded-md cursor-pointer whitespace-nowrap",
              "overflow-hidden text-ellipsis grid",
              "grid-cols-[minmax(0,_1fr)_auto] gap-2 items-center",
              "outline-none select-none bg-transparent border border-border-300",
              "hover:!bg-accent-main-100 hover:!text-oncolor-100",
              "hover:!border-transparent transition mr-1 sm:mr-3 ml-1 mb-1 mt-1",
              "!rounded-lg text-center text-sm font-medium",
            )}
            onClick={onSettingsClick}
          >
            Create & Edit Templates
          </div>
        </div>
      </div>
    </>
  );
};
