import { test, expect } from "./extention-fixtures";

test.describe("Chrome Extension Options Page", () => {
  test.beforeEach(async ({ page, extensionId, optionsPage }) => {
    await page.goto(`chrome-extension://${extensionId}/${optionsPage}`);
  });

  test("should display empty prompt form", async ({ page }) => {
    const titleInput = page.getByTestId("new-prompt-title");
    const contentTextarea = page.getByTestId("new-prompt-content");
    const addButton = page.getByTestId("add-prompt-button");

    await expect(titleInput).toBeVisible();
    await expect(contentTextarea).toBeVisible();
    await expect(addButton).toBeVisible();
    await expect(titleInput).toHaveValue("");
    await expect(contentTextarea).toHaveValue("");
  });

  test("should add new prompt template", async ({ page }) => {
    const titleInput = page.getByTestId("new-prompt-title");
    const contentTextarea = page.getByTestId("new-prompt-content");
    const addButton = page.getByRole("button", { name: "Add Prompt" });

    await titleInput.fill("Test Prompt");
    await contentTextarea.fill("Test Content");
    await addButton.click();

    // Check if the new prompt is added to the list
    const promptCard = page.getByTestId("prompt-template-card").first();
    await expect(promptCard.getByText("Test Prompt")).toBeVisible();
    await expect(promptCard.getByText("Test Content")).toBeVisible();

    // Check if the form is cleared
    await expect(titleInput).toHaveValue("");
    await expect(contentTextarea).toHaveValue("");
  });

  test("should edit prompt template", async ({ page }) => {
    // First add a prompt
    const titleInput = page.getByTestId("new-prompt-title");
    const contentTextarea = page.getByTestId("new-prompt-content");
    await titleInput.fill("Original Title");
    await contentTextarea.fill("Original Content");
    await page.getByTestId("add-prompt-button").click();

    // Click edit button
    const promptCard = page.getByTestId("prompt-template-card").first();
    await promptCard.getByTestId("edit-button").click();

    // Edit the prompt
    const editTitleInput = promptCard.getByRole("textbox").first();
    const editContentTextarea = promptCard.getByRole("textbox").nth(1);
    await editTitleInput.fill("Updated Title");
    await editContentTextarea.fill("Updated Content");

    // Save changes
    await promptCard.getByTestId("save-button").click();

    // Verify changes
    await expect(promptCard.getByText("Updated Title")).toBeVisible();
    await expect(promptCard.getByText("Updated Content")).toBeVisible();
  });

  test("should cancel editing prompt template", async ({ page }) => {
    // First add a prompt
    const titleInput = page.getByTestId("new-prompt-title");
    const contentTextarea = page.getByTestId("new-prompt-content");
    await titleInput.fill("Original Title");
    await contentTextarea.fill("Original Content");
    await page.getByTestId("add-prompt-button").click();

    // Get first card
    const promptCard = page.getByTestId("prompt-template-card").first();

    // Click edit button
    await promptCard.getByTestId("edit-button").click();

    // Start editing but cancel
    const editTitleInput = promptCard.getByRole("textbox").first();
    const editContentTextarea = promptCard.getByRole("textbox").nth(1);
    await editTitleInput.fill("Cancelled Title");
    await editContentTextarea.fill("Cancelled Content");
    await promptCard.getByTestId("cancel-button").click();

    // Verify original content remains
    await expect(promptCard.getByText("Original Title")).toBeVisible();
    await expect(promptCard.getByText("Original Content")).toBeVisible();
  });

  test("should delete prompt template", async ({ page }) => {
    // First add a prompt
    const titleInput = page.getByTestId("new-prompt-title");
    const contentTextarea = page.getByTestId("new-prompt-content");
    await titleInput.fill("To Be Deleted");
    await contentTextarea.fill("Delete this content");
    await page.getByTestId("add-prompt-button").click();

    // Click delete button and confirm
    const promptCard = page.getByTestId("prompt-template-card").first();
    await promptCard.getByRole("button", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Continue" }).click();

    // Verify prompt is deleted
    await expect(page.getByText("To Be Deleted")).not.toBeVisible();
    await expect(page.getByText("Delete this content")).not.toBeVisible();
  });
});
