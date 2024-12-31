import { initializeClaude } from "./providers/claude/template-injector";

const isClaude = () => window.location.hostname.endsWith("claude.ai");

const initializeIfClaude = () => {
  if (isClaude()) {
    initializeClaude();
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeIfClaude);
} else {
  initializeIfClaude();
}

let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    initializeIfClaude();
  }
}).observe(document, { subtree: true, childList: true });
