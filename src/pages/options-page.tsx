import "@/global.css";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  saveNewPrompt,
  getPromptTemplates,
  updatePrompt,
  deletePrompt,
  PromptTemplate,
  Options,
  defaultOptions,
} from "@/options-storage";
import { Check, Pencil, Trash2, X, Moon, Sun } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import optionsStorage from "@/options-storage";

export default function OptionsPage() {
  const [newPrompt, setNewPrompt] = useState({ title: "", content: "" });
  const [promptList, setPromptList] = useState<PromptTemplate[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [originalPrompt, setOriginalPrompt] = useState<PromptTemplate | null>(
    null,
  );
  const [theme, setTheme] = useState<Options["theme"]>(defaultOptions.theme);

  useEffect(() => {
    getPromptTemplates().then(setPromptList);
    optionsStorage.getAll().then(async (options) => {
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
    setNewPrompt({ title: "", content: "" });
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

  const DeleteButton = ({ promptId }: { promptId: string }) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Trash2 className="mr-1 size-4" /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            prompt template.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => onUserClickDelete(promptId)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <div className="mx-auto w-[640px] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-medium">Prompt Templates</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com/sotayamashita/refind-claude"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiGithub className="size-4" />
            </a>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                {theme === "light" ? (
                  <Sun className="size-[1.2rem]" />
                ) : (
                  <Moon className="size-[1.2rem]" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onThemeChange("light")}>
                <Sun className="mr-2 size-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onThemeChange("dark")}>
                <Moon className="mr-2 size-4" />
                Dark
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
            data-testid="new-prompt-title"
          />
          <Textarea
            placeholder="New prompt content"
            value={newPrompt.content}
            onChange={(e) => {
              setNewPrompt({ ...newPrompt, content: e.target.value });
            }}
            className="mb-2 min-h-[140px]"
            data-testid="new-prompt-content"
          />
          <Button
            onClick={onUserClickAddPrompt}
            className="w-full"
            data-testid="add-prompt-button"
          >
            Add Prompt
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {promptList.map((promptItem) => (
          <Card
            key={promptItem.id}
            className="overflow-hidden"
            data-testid="prompt-template-card"
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
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onUserClickCancel}
                    >
                      <X className="mr-1 size-4" data-testid="cancel-button" />{" "}
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onUserClickSave(promptItem)}
                    >
                      <Check
                        className="mr-1 size-4"
                        data-testid="save-button"
                      />{" "}
                      Save
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="mb-2 font-semibold">{promptItem.title}</h3>
                  <p className="mb-4 overflow-y-auto text-sm text-gray-600">
                    {promptItem.content}
                  </p>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUserClickEdit(promptItem)}
                    >
                      <Pencil
                        className="mr-1 size-4"
                        data-testid="edit-button"
                      />{" "}
                      Edit
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
