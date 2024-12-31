import React from "react";
import ReactDOM from "react-dom/client";
import { ClaudeTemplateButton } from "@/components/providers/claude/template-button";
import { getPromptTemplates } from "@/options-storage";

interface Template {
  title: string;
  content: string;
}

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

const handleTemplateSelect = (template: Template) => {
  const editor = document.querySelector(".ProseMirror");
  if (editor instanceof HTMLElement) {
    const isEmpty = editor.querySelector(".is-editor-empty");
    if (isEmpty) {
      editor.innerHTML = "";
    }

    const p = document.createElement("p");
    p.textContent = template.content;
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

const handleSettingsClick = () => {
  chrome.runtime.sendMessage({ action: "openOptions" });
};

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

  const templates = await getPromptTemplates();

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
  root.render(
    React.createElement(ClaudeTemplateButton, {
      templates,
      onTemplateSelect: handleTemplateSelect,
      onSettingsClick: handleSettingsClick,
    }),
  );
};

export const initializeClaude = async () => {
  try {
    await waitForElement('[data-testid="style-selector-dropdown"]');
    await sleep(500);
    await initializeTemplateButton();
  } catch (error) {
    console.error("Failed to initialize:", error);
  }
};
