import React from "react";
import ReactDOM from "react-dom/client";
import { getPromptTemplates } from "@/options-storage";
import { waitForElement, sleep, handleSettingsClick } from "@/lib/utils";
import { ChatGPTTemplateButton } from "@/components/providers/chatgpt/template-button";

interface Template {
  title: string;
  content: string;
}

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

export const initializeTemplateButton = async () => {
  const editorWrapper = await waitForElement("#composer-background");
  if (!editorWrapper) {
    console.error("Could not find editor");
    return;
  }

  // FIXME: This is a hack to get the tool items
  const toolNodes = editorWrapper.querySelectorAll(
    'div[style*="view-transition-name:var"]',
  );
  if (toolNodes.length === 0) {
    console.error("Could not find tool items");
    return;
  }

  // FIXME: This is a hack to get the tool list
  const toolList = toolNodes[0].parentElement;
  if (!toolList) {
    console.error("Could not find tool list");
    return;
  }

  // Check if template button already exists
  if (
    toolList.querySelector(
      '[data-testid="template-selector-dropdown-by-llm-interface-plus"]',
    )
  ) {
    return;
  }

  // Get the templates
  const templates = await getPromptTemplates();

  // Create the outer wrapper
  const outerWrapper = document.createElement("div");

  // Create the inner wrapper
  const innerWrapper = document.createElement("div");

  // Append the inner wrapper to the outer wrapper
  outerWrapper.appendChild(innerWrapper);

  // Append the outer wrapper to the tool list
  toolList.appendChild(outerWrapper);

  // Create the root for the React component
  const root = ReactDOM.createRoot(innerWrapper);

  // Render the React component
  root.render(
    React.createElement(ChatGPTTemplateButton, {
      templates,
      onTemplateSelect: handleTemplateSelect,
      onSettingsClick: handleSettingsClick,
    }),
  );
};

export const initializeChatGPT = async () => {
  try {
    await waitForElement('button[aria-label="Search the web"]');
    await sleep(500);
    await initializeTemplateButton();
  } catch (error) {
    console.error("Failed to initialize:", error);
  }
};
