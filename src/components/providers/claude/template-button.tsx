/* eslint-disable tailwindcss/no-custom-classname */
import React from "react";
import type { FC } from "react";
import { BookDashed, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ClaudeTemplateList } from "@/components/providers/claude/template-list";

interface Template {
  title: string;
  content: string;
}

interface Props {
  templates: Template[];
  onTemplateSelect: (template: Template) => void;
  onSettingsClick: () => void;
}

export const ClaudeTemplateButton: FC<Props> = ({
  templates,
  onTemplateSelect,
  onSettingsClick,
}) => {
  const [open, setOpen] = React.useState(false);
  // Chat dialog will be bottom of the page when on claude.ai/chat
  // otherwise it will be top of the page when on claude.ai/project/ or claude.ai/chat/new
  const dropdownPosition = window.location.pathname.startsWith("/chat/")
    ? "top"
    : "bottom";

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center justify-center relative shrink-0",
            "ring-offset-2 ring-offset-bg-300 ring-accent-main-100",
            "focus-visible:outline-none focus-visible:ring-1",
            "disabled:pointer-events-none disabled:opacity-50",
            "disabled:shadow-none disabled:drop-shadow-none",
            "max-w-full min-w-0 pl-1.5 pr-1 h-7 ml-0.5 mr-1",
            "hover:bg-bg-200 hover:border-border-400",
            "border-0.5 text-sm rounded-md border-transparent",
            "transition text-text-500 hover:text-text-200",
          )}
          data-testid="template-selector-dropdown-by-llm-interface-plus"
          type="button"
        >
          <div
            className="inline-flex min-w-0 items-center"
            data-state={open ? "open" : "closed"}
          >
            <BookDashed className="mr-1 -translate-y-px" size={16} />
            <span className="font-tiempos mr-px flex-1 -translate-y-px truncate">
              Choose prompts
            </span>
            <ChevronDown className="text-text-500/80 ml-1 shrink-0" size={12} />
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="center"
        side={dropdownPosition}
        className={cn(
          "z-50 bg-bg-200 border-0.5 border-border-300 backdrop-blur-xl",
          "rounded-lg min-w-[8rem] overflow-hidden p-1 text-text-200",
          "shadow-element !bg-bg-200 !rounded-xl w-64 sm:w-[28rem] !z-30",
        )}
      >
        <ClaudeTemplateList
          templates={templates}
          onTemplateSelect={onTemplateSelect}
          onSettingsClick={onSettingsClick}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
