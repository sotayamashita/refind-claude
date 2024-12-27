import type { PromptTemplate } from "@/options-storage";

interface TemplateFile {
  title: string;
  content: string;
}

import generalQuestion from "@/templates/general-question.json";
import codeReview from "@/templates/code-review.json";
import bugAnalysis from "@/templates/bug-analysis.json";

const staticTemplates: TemplateFile[] = [
  generalQuestion,
  codeReview,
  bugAnalysis,
];

export function loadDefaultTemplates(): Omit<PromptTemplate, "id">[] {
  return staticTemplates.map((template) => ({
    title: template.title,
    content: template.content,
  }));
}
