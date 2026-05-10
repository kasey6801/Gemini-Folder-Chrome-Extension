# Gemini Folders

Organise your Google Gemini conversations into folders directly inside the Gemini website. Keep related chats together, find them quickly, and keep your workspace tidy.

---

## Requirements

- **Google Chrome** browser (desktop)
- **Developer Mode** must be enabled in Chrome's Extensions settings

> ⚠️ Developer Mode may be restricted on managed devices (e.g. work or school computers). If you cannot enable it, the extension cannot be installed.

---

## Installation

### Option 1 — Build from source

For developers who want to modify or build the extension themselves.

**Prerequisites:** [Node.js](https://nodejs.org) must be installed.

1. Clone or download this repository
2. Open a terminal in the project folder and run:
   ```
   npm install
   npm run build
   ```
3. Open Chrome and go to `chrome://extensions`
4. Enable **Developer mode** using the toggle in the top-right corner
5. Click **Load unpacked** and select the project folder
6. Open [gemini.google.com](https://gemini.google.com) — a **☰** button will appear on the right side of the page

---

### Option 2 — Load a pre-built release

No coding or build tools required.

1. Go to the [Releases](../../releases) page and download the latest `.zip` file
2. Unzip the file to a folder on your computer
3. Open Chrome and go to `chrome://extensions`
4. Enable **Developer mode** using the toggle in the top-right corner
5. Click **Load unpacked** and select the unzipped folder
6. Open [gemini.google.com](https://gemini.google.com) — a **☰** button will appear on the right side of the page

---

## Features

### Folders
- **Create folders** — give each folder a name and a colour
- **Rename folders** — click the edit icon on any folder
- **Colour-code folders** — change a folder's colour at any time
- **Reorder folders** — drag a folder header up or down to reposition it in the list
- **Delete folders** — removes the folder and its chat links (your actual Gemini chats are not deleted)

### Adding Chats to Folders
- **Drag and drop** — drag any conversation from Gemini's left sidebar and drop it onto a folder
- **Add button (+)** — click the + icon on a folder to pick conversations from a list
- **Paste a URL** — if a chat isn't detected automatically, paste its link directly

### Navigation
- **Expand / Collapse** — open or close individual folders by clicking them
- **Expand all / Collapse all** — buttons in the folder list header to open or close every folder at once
- **Search** — search across all folders to find any chat instantly
- **Recent Chats** — a section above your folders showing your most recent Gemini conversations (can be turned off in Settings)

### Settings
| Setting | What it does |
|---------|-------------|
| Dark Mode | Switch between dark and light themes |
| Show Recent Chats | Show or hide the Recent Chats section |
| Open on Startup | Open the sidebar automatically when you visit Gemini |

### Data
- **Export** — saves all your folders and chats to a `.json` file on your computer
- **Import** — restores folders from a previously exported file
- All data is stored **locally on your device only** — nothing is sent to any server

---

## Using the Sidebar

Click the **☰** button on the right side of the Gemini page to open or close the sidebar. The sidebar sits alongside the Gemini interface without interfering with your conversations.

---

## Privacy

This extension does not collect, transmit, or store any data outside of your own browser. See the `LICENSE` and `NOTICE` files for open-source attribution.
