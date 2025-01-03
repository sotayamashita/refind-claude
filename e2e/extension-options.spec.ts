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

  test("should create and filter templates by category", async ({ page }) => {
    // Create templates with different categories
    const titleInput = page.getByTestId("prompt-form-title-input");
    const contentTextarea = page.getByTestId("prompt-form-content-input");
    const categoryInput = page.getByTestId("prompt-form-category-input");

    // Add template with category "Work"
    await titleInput.fill("Work Template");
    await contentTextarea.fill("Work Content");
    await categoryInput.fill("Work");
    await page.getByTestId("prompt-form-submit-button").click();

    // Add template with category "Personal"
    await titleInput.fill("Personal Template");
    await contentTextarea.fill("Personal Content");
    await categoryInput.fill("Personal");
    await page.getByTestId("prompt-form-submit-button").click();

    // Add template without category
    await titleInput.fill("No Category Template");
    await contentTextarea.fill("Uncategorized Content");
    await page.getByTestId("prompt-form-submit-button").click();

    // Test category filter
    const categoryFilter = page.getByTestId("category-filter");
    await expect(categoryFilter).toBeVisible();

    // Check "All" filter (default)
    await expect(page.getByText("Work Template")).toBeVisible();
    await expect(page.getByText("Personal Template")).toBeVisible();
    await expect(page.getByText("No Category Template")).toBeVisible();

    // Filter by "Work" category
    await categoryFilter.selectOption("Work");
    await expect(page.getByText("Work Template")).toBeVisible();
    await expect(page.getByText("Personal Template")).not.toBeVisible();
    await expect(page.getByText("No Category Template")).not.toBeVisible();

    // Filter by "Personal" category
    await categoryFilter.selectOption("Personal");
    await expect(page.getByText("Work Template")).not.toBeVisible();
    await expect(page.getByText("Personal Template")).toBeVisible();
    await expect(page.getByText("No Category Template")).not.toBeVisible();

    // Filter "Uncategorized"
    await categoryFilter.selectOption("Uncategorized");
    await expect(page.getByText("Work Template")).not.toBeVisible();
    await expect(page.getByText("Personal Template")).not.toBeVisible();
    await expect(page.getByText("No Category Template")).toBeVisible();
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
    const templatesWithoutIds = parsedContent.map(
      ({ title, content, category }) => ({
        title,
        content,
        category,
      }),
    );
    expect(templatesWithoutIds).toEqual([
      {
        title: "First Template",
        content: "Content for the first template",
        category: "Work",
      },
      {
        title: "Second Template",
        content: "Content for the second template",
        category: "Personal",
      },
      {
        title: "Third Template",
        content: "Content for the third template",
        category: "",
      },
    ]);
  });

  test("should display category badges correctly", async ({ page }) => {
    // Create a template with category
    const titleInput = page.getByTestId("prompt-form-title-input");
    const contentTextarea = page.getByTestId("prompt-form-content-input");
    const categoryInput = page.getByTestId("prompt-form-category-input");

    await titleInput.fill("Template with Category");
    await contentTextarea.fill("Content");
    await categoryInput.fill("Test Category");
    await page.getByTestId("prompt-form-submit-button").click();

    // Create a template without category
    await titleInput.fill("Template without Category");
    await contentTextarea.fill("Content");
    await page.getByTestId("prompt-form-submit-button").click();

    // Verify badge is displayed for categorized template
    const categorizedCard = page.getByText("Template with Category").locator("..");
    await expect(categorizedCard.getByTestId("prompt-list-item-category")).toHaveText("Test Category");

    // Verify no badge is displayed for uncategorized template
    const uncategorizedCard = page.getByText("Template without Category").locator("..");
    await expect(uncategorizedCard.getByTestId("prompt-list-item-category")).not.toBeVisible();
  });

  test("should edit template category", async ({ page }) => {
    // Create a template with category
    const titleInput = page.getByTestId("prompt-form-title-input");
    const contentTextarea = page.getByTestId("prompt-form-content-input");
    const categoryInput = page.getByTestId("prompt-form-category-input");

    await titleInput.fill("Original Title");
    await contentTextarea.fill("Original Content");
    await categoryInput.fill("Original Category");
    await page.getByTestId("prompt-form-submit-button").click();

    // Get first card and enter edit mode
    const promptCard = page.getByTestId("prompt-list-item").first();
    await promptCard.getByTestId("prompt-list-item-edit-button").click();

    // Verify category input appears after content textarea
    const editContentTextarea = promptCard.getByTestId("prompt-list-item-edit-content");
    const editCategoryInput = promptCard.getByTestId("prompt-list-item-edit-category");
    
    // Get bounding boxes to verify positioning
    const contentBox = await editContentTextarea.boundingBox();
    const categoryBox = await editCategoryInput.boundingBox();
    
    // Ensure elements are visible and have bounding boxes
    expect(contentBox).not.toBeNull();
    expect(categoryBox).not.toBeNull();
    
    if (contentBox && categoryBox) {
      expect(categoryBox.y).toBeGreaterThan(contentBox.y + contentBox.height);
    }

    // Edit category
    await editCategoryInput.fill("Updated Category");
    await promptCard.getByTestId("prompt-list-item-edit-submit").click();

    // Verify category is updated
    await expect(promptCard.getByTestId("prompt-list-item-category")).toHaveText("Updated Category");
  });
});
