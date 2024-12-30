import { initialize } from "./providers/claude/template-injector";

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
