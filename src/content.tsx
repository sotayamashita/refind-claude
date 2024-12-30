/// <reference types="chrome"/>

/* eslint-disable tailwindcss/no-custom-classname */
import React from "react";
import ReactDOM from "react-dom/client";
import { getPromptTemplates } from "./options-storage";
import { cn } from "./lib/utils";
import type { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookDashed, ChevronDown } from "lucide-react";
import { PromptPreviewDialog } from "./components/prompt-preview-dialog";

interface Template {
  title: string;
  content: string;
}

const getDropdownPosition = (pathname: string): "top" | "bottom" => {
  if (pathname.startsWith("/chat/")) {
    return "top";
  }
  return "bottom";
};

const TemplateButton: FC = () => {
  const [templates, setTemplates] = React.useState<Template[]>([]);
  const [open, setOpen] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    React.useState<Template | null>(null);
  const dropdownPosition = getDropdownPosition(window.location.pathname);

  // Close preview when dropdown opens
  React.useEffect(() => {
    if (open) {
      setSelectedTemplate(null);
    }
  }, [open]);

  React.useEffect(() => {
    const loadTemplates = async () => {
      const storage = await getPromptTemplates();
      setTemplates(storage);
    };
    loadTemplates();
  }, []);

  const insertTextToEditor = (text: string) => {
    const editor = document.querySelector(".ProseMirror");
    if (editor instanceof HTMLElement) {
      const isEmpty = editor.querySelector(".is-editor-empty");
      if (isEmpty) {
        editor.innerHTML = "";
      }

      const p = document.createElement("p");
      p.textContent = text;
      editor.append(p);
      editor.focus();

      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(p);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  const handleTemplateClick = (template: Template) => {
    setSelectedTemplate(template);
    setOpen(false);
  };

  const handleSettingsClick = () => {
    chrome.runtime.sendMessage({ action: "openOptions" });
    setOpen(false);
  };

  return (
    <>
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
            data-testid="template-selector-dropdown"
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
              <ChevronDown
                className="text-text-500/80 ml-1 shrink-0"
                size={12}
              />
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
                      onClick={() => handleTemplateClick(template)}
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
                onClick={handleSettingsClick}
              >
                Create & Edit Templates
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedTemplate && (
        <PromptPreviewDialog
          title={selectedTemplate.title}
          content={selectedTemplate.content}
          onApply={(finalText) => {
            insertTextToEditor(finalText);
            setSelectedTemplate(null);
          }}
          trigger={null}
        />
      )}
    </>
  );
};

const waitForElement = (selector: string, timeout = 5000): Promise<Element> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    function checkElement() {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      if (Date.now() - startTime >= timeout) {
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        return;
      }

      requestAnimationFrame(checkElement);
    }

    checkElement();
  });
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const initializeTemplateButton = async () => {
  const sonnetButton = await waitForElement(
    '[data-testid="model-selector-dropdown"]',
  );
  if (!sonnetButton) {
    console.error("Could not find Sonnet button");
    return;
  }

  const targetContainer = sonnetButton.parentElement;
  if (!targetContainer) {
    console.error("Could not find target container");
    return;
  }

  if (
    targetContainer.querySelector('[data-testid="template-selector-dropdown"]')
  ) {
    return;
  }

  const templateWrapper = document.createElement("div");
  templateWrapper.className = "flex items-center min-w-0 max-w-full";

  const innerWrapper = document.createElement("div");
  innerWrapper.className = "min-w-24";
  innerWrapper.setAttribute("type", "button");
  innerWrapper.dataset.state = "closed";
  innerWrapper.style.opacity = "1";

  templateWrapper.appendChild(innerWrapper);
  targetContainer.appendChild(templateWrapper);

  const root = ReactDOM.createRoot(innerWrapper);
  root.render(React.createElement(TemplateButton));
};

const initialize = async () => {
  try {
    await waitForElement('[data-testid="style-selector-dropdown"]');
    await sleep(500);
    await initializeTemplateButton();
  } catch (error) {
    console.error("Failed to initialize:", error);
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}

let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    initialize();
  }
}).observe(document, { subtree: true, childList: true });
