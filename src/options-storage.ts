import OptionsSync from "webext-options-sync";
import { loadDefaultTemplates } from "@/lib/template-loader";

export interface PromptTemplate {
  id: string;
  title: string;
  content: string;
}

export interface Options {
  promptTemplatesJson: string;
  theme: "light" | "dark";
  [key: string]: string | number | boolean;
}

// Convert default prompts to include IDs
const defaultPromptsWithIds: PromptTemplate[] = loadDefaultTemplates().map(
  (prompt) => ({
    ...prompt,
    id: `default-${prompt.title.toLowerCase().replace(/\s+/g, "-")}`,
  }),
);

export const defaultOptions: Options = {
  promptTemplatesJson: JSON.stringify(defaultPromptsWithIds),
  theme:
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
};

const optionsStorage = new OptionsSync<Options>({
  defaults: defaultOptions,
  logging: false,
});

export default optionsStorage;

export async function saveNewPrompt(newPrompt: Omit<PromptTemplate, "id">) {
  const options = await optionsStorage.getAll();
  const promptTemplates: PromptTemplate[] = JSON.parse(
    options.promptTemplatesJson,
  );

  const promptWithId: PromptTemplate = {
    ...newPrompt,
    id: new Date().toISOString(),
  };

  await optionsStorage.set({
    promptTemplatesJson: JSON.stringify([promptWithId, ...promptTemplates]),
  });

  return promptWithId;
}

export async function getPromptTemplates(): Promise<PromptTemplate[]> {
  const options = await optionsStorage.getAll();
  return JSON.parse(options.promptTemplatesJson);
}

export async function updatePrompt(updatedPrompt: PromptTemplate) {
  const options = await optionsStorage.getAll();
  const promptTemplates: PromptTemplate[] = JSON.parse(
    options.promptTemplatesJson,
  );

  const updatedTemplates = promptTemplates.map((prompt) =>
    prompt.id === updatedPrompt.id ? updatedPrompt : prompt,
  );

  await optionsStorage.set({
    promptTemplatesJson: JSON.stringify(updatedTemplates),
  });

  return updatedPrompt;
}

export async function deletePrompt(promptId: string) {
  const options = await optionsStorage.getAll();
  const promptTemplates: PromptTemplate[] = JSON.parse(
    options.promptTemplatesJson,
  );

  const filteredTemplates = promptTemplates.filter(
    (prompt) => prompt.id !== promptId,
  );

  await optionsStorage.set({
    promptTemplatesJson: JSON.stringify(filteredTemplates),
  });
}
