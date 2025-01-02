import "@/global.css";
import { initializeClaude } from "./providers/claude/template-injector";
import { initializeChatGPT } from "./providers/chatgpt/template-injector";
const isClaude = () => window.location.hostname.endsWith("claude.ai");
const isChatGPT = () => window.location.hostname.endsWith("chatgpt.com");

const initializeIfClaude = () => {
  if (isClaude()) {
    initializeClaude();
  }
};

const initializeIfChatGPT = () => {
  if (isChatGPT()) {
    initializeChatGPT();
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeIfClaude);
  document.addEventListener("DOMContentLoaded", initializeIfChatGPT);
} else {
  initializeIfClaude();
  initializeIfChatGPT();
}

let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    initializeIfClaude();
    initializeIfChatGPT();
  }
}).observe(document, { subtree: true, childList: true });
