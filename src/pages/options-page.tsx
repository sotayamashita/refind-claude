import "@/global.css";
import React, { useEffect, useState, useRef, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  saveNewPrompt,
  getPromptTemplates,
  updatePrompt,
  deletePrompt,
  PromptTemplate,
  Options,
  defaultOptions,
} from "@/options-storage";
import { SiGithub as Github } from "@icons-pack/react-simple-icons";
import { Check, Pencil, Trash2, X, Moon, Sun } from "lucide-react";
// Alert dialog is only used for delete confirmation, so we can load it dynamically
const AlertDialog = React.lazy(() => import("@/components/ui/alert-dialog"));

import optionsStorage from "@/options-storage";

export default function OptionsPage() {
  const [newPrompt, setNewPrompt] = useState<Omit<PromptTemplate, "id">>({
    title: "",
    content: "",
    category: "",
  });
  const [promptList, setPromptList] = useState<PromptTemplate[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [originalPrompt, setOriginalPrompt] = useState<PromptTemplate | null>(
    null,
  );
  const [theme, setTheme] = useState<Options["theme"]>(defaultOptions.theme);

  useEffect(() => {
    getPromptTemplates().then(setPromptList);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    optionsStorage.getAll().then(async (options: any) => {
      // If this is the first time loading (using default theme), check system preference
      if (options.theme === defaultOptions.theme) {
        const isDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        const systemTheme = isDark ? "dark" : "light";
        await optionsStorage.set({ theme: systemTheme });
        setTheme(systemTheme);
        document.documentElement.classList.toggle("dark", isDark);
      } else {
        setTheme(options.theme);
        document.documentElement.classList.toggle(
          "dark",
          options.theme === "dark",
        );
      }
    });
  }, []);

  const onThemeChange = async (newTheme: Options["theme"]) => {
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    await optionsStorage.set({ theme: newTheme });
  };

  const onUserClickAddPrompt = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    const savedPrompt = await saveNewPrompt(newPrompt);
    setPromptList([savedPrompt, ...promptList]);
    setNewPrompt({ title: "", content: "", category: "" });
  };

  const onUserClickEdit = (prompt: PromptTemplate) => {
    setOriginalPrompt(prompt);
    setEditingId(prompt.id);
  };

  const onUserClickSave = async (prompt: PromptTemplate) => {
    const updatedPrompt = await updatePrompt(prompt);
    setPromptList(
      promptList.map((p) => (p.id === updatedPrompt.id ? updatedPrompt : p)),
    );
    setEditingId(null);
  };

  const onUserClickDelete = async (promptId: string) => {
    await deletePrompt(promptId);
    setPromptList(promptList.filter((p) => p.id !== promptId));
  };

  const onUserClickCancel = () => {
    if (originalPrompt) {
      setPromptList(
        promptList.map((p) =>
          p.id === originalPrompt.id ? originalPrompt : p,
        ),
      );
    }
    setEditingId(null);
    setOriginalPrompt(null);
  };

  const onExportTemplates = async () => {
    const templates = await getPromptTemplates();
    const blob = new Blob([JSON.stringify(templates, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "templates_backup.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const text = await file.text();
      const imported = JSON.parse(text);
      // Convert single object to array if needed
      const templatesArray = Array.isArray(imported) ? imported : [imported];

      // Validate and sanitize each template
      const validTemplates = templatesArray
        .filter((item) => {
          return (
            typeof item === "object" &&
            item !== null &&
            typeof item.title === "string" &&
            item.title.trim() !== "" &&
            typeof item.content === "string" &&
            item.content.trim() !== ""
          );
        })
        .map((item) => ({
          id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: item.title.trim(),
          content: item.content.trim(),
          category: item.category || "", // Preserve category or set empty string
        }));

      if (validTemplates.length === 0) {
        alert("No valid templates found in import file");
        return;
      }

      if (validTemplates.length < templatesArray.length) {
        alert(
          `Warning: Only ${validTemplates.length} out of ${templatesArray.length} templates were valid and imported.`,
        );
      }

      // Merge with existing templates
      const existing = await getPromptTemplates();
      const combined = [...existing, ...validTemplates];
      await optionsStorage.set({
        promptTemplatesJson: JSON.stringify(combined),
      });
      setPromptList(combined);
      // Show success message
      alert(
        `Successfully imported ${validTemplates.length} template${validTemplates.length === 1 ? "" : "s"}`,
      );
    } catch (err) {
      alert(
        "Error importing templates: " +
          (err instanceof Error ? err.message : "Unknown error"),
      );
    }
  };

  const onImportTemplates = () => {
    fileInputRef.current?.click();
  };

  const DeleteButton = ({ promptId }: { promptId: string }) => (
    <Suspense
      fallback={
        <Button
          variant="outline"
          size="sm"
          data-testid="prompt-list-item-delete-button"
        >
          <Trash2 className="mr-1 size-4" />
          Delete
        </Button>
      }
    >
      <AlertDialog>
        {(
          Dialog: import("@/components/ui/alert-dialog").AlertDialogNamespace,
        ) => (
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button
                variant="outline"
                size="sm"
                data-testid="prompt-list-item-delete-button"
              >
                <Trash2 className="mr-1 size-4" />
                Delete
              </Button>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Are you sure?</Dialog.Title>
                <Dialog.Description>
                  This action cannot be undone. This will permanently delete
                  this prompt template.
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.Footer>
                <Dialog.Cancel data-testid="prompt-list-item-delete-cancel">
                  Cancel
                </Dialog.Cancel>
                <Dialog.Action
                  onClick={() => onUserClickDelete(promptId)}
                  data-testid="prompt-list-item-delete-confirm"
                >
                  Continue
                </Dialog.Action>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
        )}
      </AlertDialog>
    </Suspense>
  );

  return (
    <div className="mx-auto w-[640px] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-medium">Prompt Templates</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExportTemplates}
            data-testid="prompt-list-export-button"
          >
            Export Templates
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onImportTemplates}
            data-testid="prompt-list-import-button"
          >
            Import Templates
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com/sotayamashita/refind-claude"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="size-4" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onThemeChange(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <Moon className="size-[1.2rem]" />
            ) : (
              <Sun className="size-[1.2rem]" />
            )}
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <Input
            placeholder="New prompt title"
            value={newPrompt.title}
            onChange={(e) => {
              setNewPrompt({ ...newPrompt, title: e.target.value });
            }}
            className="mb-2"
            data-testid="prompt-form-title-input"
          />
          <Textarea
            placeholder="New prompt content"
            value={newPrompt.content}
            onChange={(e) => {
              setNewPrompt({ ...newPrompt, content: e.target.value });
            }}
            className="mb-2 min-h-[140px]"
            data-testid="prompt-form-content-input"
          />
          <Input
            placeholder="Category (optional)"
            value={newPrompt.category}
            onChange={(e) => {
              setNewPrompt({ ...newPrompt, category: e.target.value });
            }}
            className="mb-2"
            data-testid="prompt-form-category-input"
          />
          <Button
            onClick={onUserClickAddPrompt}
            className="w-full"
            data-testid="prompt-form-submit-button"
          >
            Add Prompt
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="mb-4 w-full rounded-md border p-2 dark:border-gray-700 dark:bg-gray-800"
          data-testid="category-filter"
        >
          <option value="All">All Categories</option>
          <option value="Uncategorized">Uncategorized</option>
          {Array.from(
            new Set(promptList.map((p) => p.category).filter(Boolean)),
          ).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {promptList
          .filter((p) =>
            filterCategory === "All"
              ? true
              : filterCategory === "Uncategorized"
                ? !p.category
                : p.category === filterCategory,
          )
          .map((promptItem) => (
            <Card
              key={promptItem.id}
              className="overflow-hidden"
              data-testid="prompt-list-item"
            >
              <CardContent className="p-4">
                {editingId === promptItem.id ? (
                  <>
                    <Input
                      value={promptItem.title}
                      onChange={(e) => {
                        setPromptList(
                          promptList.map((p) =>
                            p.id === promptItem.id
                              ? { ...p, title: e.target.value }
                              : p,
                          ),
                        );
                      }}
                      className="mb-2"
                      data-testid="prompt-list-item-edit-title"
                    />
                    <Textarea
                      value={promptItem.content}
                      onChange={(e) => {
                        setPromptList(
                          promptList.map((p) =>
                            p.id === promptItem.id
                              ? { ...p, content: e.target.value }
                              : p,
                          ),
                        );
                      }}
                      className="mb-2 min-h-[140px]"
                      data-testid="prompt-list-item-edit-content"
                    />
                    <Input
                      placeholder="Category (optional)"
                      value={promptItem.category || ""}
                      onChange={(e) => {
                        setPromptList(
                          promptList.map((p) =>
                            p.id === promptItem.id
                              ? { ...p, category: e.target.value }
                              : p,
                          ),
                        );
                      }}
                      className="mb-2"
                      data-testid="prompt-list-item-edit-category"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onUserClickCancel}
                        data-testid="prompt-list-item-edit-cancel"
                      >
                        <X className="mr-1 size-4" /> Cancel
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onUserClickSave(promptItem)}
                        data-testid="prompt-list-item-edit-submit"
                      >
                        <Check className="mr-1 size-4" /> Save
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3
                      className="mb-1 font-semibold"
                      data-testid="prompt-list-item-title"
                    >
                      {promptItem.title}
                    </h3>
                    {promptItem.category && (
                      <Badge
                        variant="outline"
                        className="mb-2"
                        data-testid="prompt-list-item-category"
                      >
                        {promptItem.category}
                      </Badge>
                    )}
                    <p
                      className="mb-4 line-clamp-2 overflow-y-auto text-sm text-muted-foreground"
                      data-testid="prompt-list-item-content"
                    >
                      {promptItem.content}
                    </p>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid="prompt-list-item-edit-button"
                        onClick={() => onUserClickEdit(promptItem)}
                      >
                        <Pencil className="mr-1 size-4" /> Edit
                      </Button>
                      <DeleteButton promptId={promptItem.id} />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
