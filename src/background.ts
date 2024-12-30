/// <reference types="chrome"/>
console.log("Hello from the background!");

chrome.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed:", details);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
chrome.runtime.onMessage.addListener((message: any) => {
  if (message.action === "openOptions") {
    chrome.runtime.openOptionsPage();
  }
  return true;
});

// Listen for keyboard commands
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "insert_template_1") {
    try {
      // Get the first template from storage
      const options = await chrome.storage.sync.get("promptTemplatesJson");
      const templates = JSON.parse(options.promptTemplatesJson || "[]");

      if (templates.length === 0) {
        console.warn("No templates available");
        return;
      }

      const firstTemplate = templates[0];

      // Send template to content script
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tab?.id) {
        await chrome.tabs.sendMessage(tab.id, {
          action: "insertTemplate",
          template: firstTemplate,
        });
      }
    } catch (error) {
      console.error("Error handling keyboard command:", error);
    }
  }
});
