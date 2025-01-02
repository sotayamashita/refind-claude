/// <reference types="chrome"/>
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const handleSettingsClick = () => {
  chrome.runtime.sendMessage({ action: "openOptions" });
};

export const waitForElement = (
  selector: string,
  timeout = 5000,
): Promise<Element> => {
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
