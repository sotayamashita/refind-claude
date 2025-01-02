import type { FC } from "react";
import { BookDashed } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChatGPTTemplateList } from "@/components/providers/chatgpt/template-list";

interface Template {
  title: string;
  content: string;
}

interface Props {
  templates: Template[];
  onTemplateSelect: (template: Template) => void;
  onSettingsClick: () => void;
}

export const ChatGPTTemplateButton: FC<Props> = ({
  templates,
  onTemplateSelect,
  onSettingsClick,
}) => {
  const dropdownButtonClassName = cn(
    "flex h-8 min-w-8 items-center justify-center rounded-lg p-1 text-xs font-semibold hover:bg-[#0000001a]",
  );

  const dropdownContentClassName = cn(
    "py-2 border-none bg-white dark:bg-[#2F2F2F] text-[#0D0D0D] dark:text-[#F9F9F9] z-50 max-w-xs rounded-2xl popover bg-token-main-surface-primary shadow-lg will-change-[opacity,transform] radix-side-bottom:animate-slideUpAndFade radix-side-left:animate-slideRightAndFade radix-side-right:animate-slideLeftAndFade radix-side-top:animate-slideDownAndFade border border-token-border-light min-w-[280px] overflow-hidden",
  );

  return (
    <div className="relative">
      <TooltipProvider>
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button
                  className={dropdownButtonClassName}
                  data-testid="template-selector-dropdown-by-llm-interface-plus"
                >
                  <BookDashed className="size-5" />
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className={cn("bg-black text-white rounded-md")}
            >
              Prompts
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent
            align="start"
            side="top"
            className={dropdownContentClassName}
          >
            <ChatGPTTemplateList
              templates={templates}
              onTemplateSelect={onTemplateSelect}
              onSettingsClick={onSettingsClick}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipProvider>
    </div>
  );
};
