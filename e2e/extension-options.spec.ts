import { test, expect } from "./extention-fixtures";
import path from "path";
import fs from "fs";
test.describe("Chrome Extension Options Page", () => {
  test.beforeEach(async ({ page, extensionId, optionsPage }) => {
    await page.goto(`chrome-extension://${extensionId}/${optionsPage}`);
  });

  test("should display empty prompt form", async ({ page }) => {
    const titleInput = page.getByTestId("prompt-form-title-input");
    const contentTextarea = page.getByTestId("prompt-form-content-input");
    const addButton = page.getByTestId("prompt-form-submit-button");

    await expect(titleInput).toBeVisible();
    await expect(contentTextarea).toBeVisible();
    await expect(addButton).toBeVisible();
    await expect(titleInput).toHaveValue("");
    await expect(contentTextarea).toHaveValue("");
  });

  test("should add new prompt template", async ({ page }) => {
    // Create a new prompt
    const titleInput = page.getByTestId("prompt-form-title-input");
    const contentTextarea = page.getByTestId("prompt-form-content-input");

    // Fill in the form
    await titleInput.fill("Test Prompt");
    await contentTextarea.fill("Test Content");

    // Click Add button
    await page.getByTestId("prompt-form-submit-button").click();

    // Check if the new prompt is added to the list
    const promptCard = page.getByTestId("prompt-list-item").first();
    await expect(promptCard.getByText("Test Prompt")).toBeVisible();
    await expect(promptCard.getByText("Test Content")).toBeVisible();

    // Check if the form is cleared
    await expect(titleInput).toHaveValue("");
    await expect(contentTextarea).toHaveValue("");
  });

  test("should edit prompt template", async ({ page }) => {
    // Create a new prompt
    const titleInput = page.getByTestId("prompt-form-title-input");
    const contentTextarea = page.getByTestId("prompt-form-content-input");

    // Fill in the form
    await titleInput.fill("Original Title");
    await contentTextarea.fill("Original Content");

    // Click Add button
    await page.getByTestId("prompt-form-submit-button").click();

    // Get first card
    const promptCard = page.getByTestId("prompt-list-item").first();

    // Click edit button
    await promptCard.getByTestId("prompt-list-item-edit-button").click();

    // Get the title and content inputs
    const editTitleInput = promptCard.getByTestId(
      "prompt-list-item-edit-title",
    );
    const editContentTextarea = promptCard.getByTestId(
      "prompt-list-item-edit-content",
    );

    // Fill in the form
    await editTitleInput.fill("Updated Title");
    await editContentTextarea.fill("Updated Content");

    // Save changes
    await promptCard.getByTestId("prompt-list-item-edit-submit").click();

    // Verify changes
    await expect(promptCard.getByText("Updated Title")).toBeVisible();
    await expect(promptCard.getByText("Updated Content")).toBeVisible();
  });

  test("should cancel editing prompt template", async ({ page }) => {
    // Create a new prompt
    const titleInput = page.getByTestId("prompt-form-title-input");
    const contentTextarea = page.getByTestId("prompt-form-content-input");

    // Fill in the form
    await titleInput.fill("Original Title");
    await contentTextarea.fill("Original Content");

    // Click Add button
    await page.getByTestId("prompt-form-submit-button").click();

    // Get first card
    const promptCard = page.getByTestId("prompt-list-item").first();

    // Click edit button
    await promptCard.getByTestId("prompt-list-item-edit-button").click();

    // Get the title and content inputs
    const editTitleInput = promptCard.getByTestId(
      "prompt-list-item-edit-title",
    );
    const editContentTextarea = promptCard.getByTestId(
      "prompt-list-item-edit-content",
    );

    // Fill in the form
    await editTitleInput.fill("Cancelled Title");
    await editContentTextarea.fill("Cancelled Content");

    // Click cancel button
    await promptCard.getByTestId("prompt-list-item-edit-cancel").click();

    // Verify original content remains
    await expect(promptCard.getByText("Original Title")).toBeVisible();
    await expect(promptCard.getByText("Original Content")).toBeVisible();
  });

  test("should delete prompt template", async ({ page }) => {
    // Create a new prompt
    const titleInput = page.getByTestId("prompt-form-title-input");
    const contentTextarea = page.getByTestId("prompt-form-content-input");

    // Fill in the form
    await titleInput.fill("To Be Deleted");
    await contentTextarea.fill("Delete this content");

    // Click Add button
    await page.getByTestId("prompt-form-submit-button").click();

    // Click Delete button
    const promptCards = page.getByTestId("prompt-list-item").first();
    // Wait for the delete button to be available after Suspense fallback renders the AlertDialog component
    await page.waitForTimeout(1000);
    await promptCards.getByTestId("prompt-list-item-delete-button").click();

    // Click Continue button
    await page.getByTestId("prompt-list-item-delete-confirm").click();

    // Verify prompt is deleted
    await expect(promptCards.getByText("To Be Deleted")).not.toBeVisible();
    await expect(
      promptCards.getByText("Delete this content"),
    ).not.toBeVisible();
  });

  test("should import single json template", async ({ page }) => {
    // Setup file chooser
    const fileChooserPromise = page.waitForEvent("filechooser");

    // Click import button
    const importButton = page.getByTestId("prompt-list-import-button");
    await importButton.click();

    // Upload file
    const uploadFilePath = path.join(
      __dirname,
      "fixtures/single-template.json",
    );
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(uploadFilePath);

    // Verify template is imported
    const promptCard = page.getByTestId("prompt-list-item").first();
    await expect(promptCard.getByTestId("prompt-list-item-title")).toHaveText(
      "Test Template",
    );
    await expect(promptCard.getByTestId("prompt-list-item-content")).toHaveText(
      "This is a test template content",
    );
  });

  test("should import multiple json templates", async ({ page }) => {
    // Setup file chooser
    const fileChooserPromise = page.waitForEvent("filechooser");

    // Click import button
    const importButton = page.getByTestId("prompt-list-import-button");
    await importButton.click();

    // Upload file
    const uploadFilePath = path.join(
      __dirname,
      "fixtures/multiple-templates.json",
    );
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(uploadFilePath);

    // Verify templates are imported
    const promptCards = page.getByTestId("prompt-list-item");
    await expect(
      promptCards.nth(0).getByTestId("prompt-list-item-title"),
    ).toHaveText("First Template");
    await expect(
      promptCards.nth(0).getByTestId("prompt-list-item-content"),
    ).toHaveText("Content for the first template");
    await expect(
      promptCards.nth(1).getByTestId("prompt-list-item-title"),
    ).toHaveText("Second Template");
    await expect(
      promptCards.nth(1).getByTestId("prompt-list-item-content"),
    ).toHaveText("Content for the second template");
    await expect(
      promptCards.nth(2).getByTestId("prompt-list-item-title"),
    ).toHaveText("Third Template");
    await expect(
      promptCards.nth(2).getByTestId("prompt-list-item-content"),
    ).toHaveText("Content for the third template");
  });

  test("should export prompt templates", async ({ page }) => {
    // Setup file chooser and download promise
    const fileChooserPromise = page.waitForEvent("filechooser");
    const downloadPromise = page.waitForEvent("download");

    // Click import button
    const importButton = page.getByTestId("prompt-list-import-button");
    await importButton.click();

    // Upload file
    const uploadFilePath = path.join(
      __dirname,
      "fixtures/multiple-templates.json",
    );
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(uploadFilePath);

    // Wait for the options page sync
    // TODO: Find a better way to wait for the options page to sync
    await page.waitForTimeout(2000);

    // Click export button
    const exportButton = page.getByTestId("prompt-list-export-button");
    await exportButton.click();

    // Wait for download to complete
    const download = await downloadPromise;

    // Get file content
    const downloadPath = await download.path();
    const fileContent = await fs.promises.readFile(downloadPath, "utf8");
    const parsedContent = JSON.parse(fileContent);

    // Verify templates are imported
    const templatesWithoutIds = parsedContent.map(({ title, content }) => ({
      title,
      content,
    }));
    expect(templatesWithoutIds).toEqual([
      { title: "First Template", content: "Content for the first template" },
      { title: "Second Template", content: "Content for the second template" },
      { title: "Third Template", content: "Content for the third template" },
    ]);
  });
});
