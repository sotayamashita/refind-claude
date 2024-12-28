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
