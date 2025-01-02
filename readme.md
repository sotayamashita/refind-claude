# LLM Interface Plus

[![Test](https://github.com/sotayamashita/llm-interface-plus/actions/workflows/test.yml/badge.svg)](https://github.com/sotayamashita/llm-interface-plus/actions/workflows/test.yml) [![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fsotayamashita%2Fllm-interface-plus.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fsotayamashita%2Fllm-interface-plus?ref=badge_shield&issueType=license) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

> 🤖 Supported LLMs: [ChatGPT](https://chat.openai.com) · [Claude](https://claude.ai)

A Chrome extension that enhances ChatGPT and Claude with customizable prompt templates and improved controls. Built with modern web technologies for a seamless user experience.

## Preview

<div align="center">
  <table>
    <tr>
      <td align="center"><b>ChatGPT Interface</b></td>
      <td align="center"><b>Claude Interface</b></td>
    </tr>
    <tr>
      <td><img src="media/chatgpt-preview.png" alt="ChatGPT Preview" width="400" /></td>
      <td><img src="media/claude-preview.png" alt="Claude Preview" width="400" /></td>
    </tr>
  </table>
</div>

## Features

- 📝 **Prompt Templates**: Create, edit, and manage reusable prompt templates
- 💾 **Template Backup**: Import and export templates for backup and sharing
- 🎨 **Modern UI**: Built with Shadcn UI and Tailwind CSS for a beautiful interface
- 🌓 **Dark Mode Support**: Automatic theme detection with manual override option
- ⚡ **Quick Access**: Easily access your templates from ChatGPT and Claude interfaces
- 🔄 **Sync Storage**: Templates are synced across your Chrome instances
- 🤖 **Multi-LLM Support**: Works with both ChatGPT and Claude

## Tech Stack

- TypeScript for type-safe code
- React for UI components
- Shadcn UI & Tailwind CSS for styling
- Parcel for bundling
- Chrome Extension Manifest V3
- Playwright for E2E testing

## Getting Started

### 🛠 Build locally

1. Checkout the copied repository to your local machine eg. with `git clone https://github.com/sotayamashita/llm-interface-plus`
1. Run `npm install` to install all required dependencies
1. Run `npm run build`

The build step will create the `dist` folder, this folder will contain the generated extension.

### 🏃 Run the extension

Using [web-ext](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/) is recommended for automatic reloading and running in a dedicated browser instance. Alternatively you can load the extension manually (see below).

1. Run `npm run watch` to watch for file changes and build continuously
1. Run `npm install --global web-ext` (only only for the first time)
1. In another terminal, run `web-ext run -t chromium`
1. Check that the extension is loaded by opening the extension options

#### Manually

You can also [load the extension manually in Chrome](https://www.smashingmagazine.com/2017/04/browser-extension-edge-chrome-firefox-opera-brave-vivaldi/#google-chrome-opera-vivaldi) or [Firefox](https://www.smashingmagazine.com/2017/04/browser-extension-edge-chrome-firefox-opera-brave-vivaldi/#mozilla-firefox).

### 📕 Read the documentation

Here are some websites you should refer to:

- [Parcel’s Web Extension transformer documentation](https://parceljs.org/recipes/web-extension/)
- [Chrome extensions’ API list](https://developer.chrome.com/docs/extensions/reference/)
- A lot more links in my [Awesome WebExtensions](https://github.com/fregante/Awesome-WebExtensions) list

## Development

### Managing Templates

1. Click the extension icon to open options
2. Use the form at the top to add new templates
3. Templates can be edited or deleted after creation
4. Access templates directly from ChatGPT and Claude interfaces via the template button

### Importing and Exporting Templates

You can backup and share your templates using the import/export functionality:

#### Exporting Templates

1. Click the "Export Templates" button in the options page
2. Your templates will be downloaded as a JSON file

#### Importing Templates

1. Click the "Import Templates" button in the options page
2. Select a JSON file containing templates
3. Supported formats:
   - Single template: `{ "title": "Template Name", "content": "Template Content" }`
   - Multiple templates: `[{ "title": "Template 1", "content": "Content 1" }, ...]`
4. Templates will be validated before import:
   - Title and content are required
   - Empty or invalid templates will be skipped
   - Successfully imported templates are merged with existing ones
5. You'll receive feedback about the import status

### Building & Testing

```bash
# Build extension
npm run build

# Watch for changes
npm run watch

# Run tests
npm run test

# Run E2E tests
npm run test:e2e
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
