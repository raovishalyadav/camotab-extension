# 🕵️ CamoTab

**Disguise your browser tabs when someone is looking over your shoulder.**

CamoTab is a Chrome extension that instantly replaces your tab's title and favicon with a convincing work-related decoy. Works on YouTube, SPAs, and any website. Disguise survives page refreshes and video navigation.

---

## ✨ Features

- **60+ built-in presets** — Jira tickets, Slack channels, Google Docs, Notion pages, GitHub PRs, Zoom calls, and more — all with real favicons
- **Custom title input** — type any title and hit Apply, or leave it blank to get a random preset
- **Searchable preset list** — filter instantly by keyword
- **Survives page refresh** — disguise is stored in `chrome.storage` and re-applied on every navigation, including YouTube SPA routing
- **MutationObserver + attribute watch** — catches both new favicon nodes and in-place `href` mutations, removes them before the browser can render them
- **Panic mode** — one click disguises every open tab in the current window
- **Keyboard shortcut** — `Alt+Shift+H` toggles disguise on the active tab instantly
- **Clean restore** — Remove button restores the exact original title and favicon using Chrome's native `tab.favIconUrl`, not DOM snapshots

---

## 📸 Demo

> Add a GIF here showing the popup opening, a preset being selected, and the tab title + favicon changing

---

## 🚀 Installation

CamoTab is not on the Chrome Web Store. Install it manually in under 30 seconds:

1. Download the latest zip from [Releases](../../releases)
2. Unzip it anywhere on your computer
3. Open Chrome and go to `chrome://extensions`
4. Enable **Developer mode** (top right toggle)
5. Click **Load unpacked** and select the unzipped `camotab-v2` folder
6. Pin the extension to your toolbar

---

## 🛠️ How It Works

### Title + Favicon Lock

A `MutationObserver` watches `document.head` for both added nodes (`childList`) and in-place attribute mutations (`attributeFilter: ["href", "rel"]`). Any `<link rel="icon">` element that isn't CamoTab's own controlled element is removed immediately — before the browser renders it. A 300ms polling interval acts as a secondary safety net for anything the observer misses.

### Original State Restoration

Before applying the first disguise, the background script reads `tab.favIconUrl` and `tab.title` directly from Chrome's native tab object — not from the DOM. This ensures the restore always uses the real pre-disguise state, even if the page has mutated its own favicons multiple times since load.

### Persistence

Disguises are stored in `chrome.storage.local` keyed by `tabId`, so they survive service worker restarts. The `chrome.tabs.onUpdated` listener re-applies the disguise at both the `loading` and `complete` navigation stages — handling full page loads, refreshes, and YouTube's SPA navigation all in one.

---

## 📁 File Structure

```
camotab-v2/
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── background.js   — Service worker: storage, apply/remove, tab lifecycle
├── content.js      — MutationObserver: title + favicon lock and restore
├── content.css     — Minimal styles
├── popup.html      — Extension popup UI
├── popup.js        — Popup logic: presets, search, custom input, panic
└── manifest.json   — Manifest V3
```

---

## 🧰 Tech

- Manifest V3
- Chrome Extension APIs: `scripting`, `storage`, `tabs`
- `MutationObserver` with `attributeFilter` for live favicon interception
- `chrome.storage.local` for disguise persistence across SW restarts
- `chrome.tabs.onUpdated` for SPA + refresh re-application

---

## 🔒 Permissions

| Permission | Why |
|---|---|
| `tabs` | Read tab title and `favIconUrl` before disguising |
| `storage` | Persist disguises across page loads and service worker restarts |
| `scripting` | Inject title and favicon lock scripts into pages |
| `activeTab` | Apply disguise to the currently active tab |
| `host_permissions: <all_urls>` | Required for scripting injection on any site |

No data is collected or sent anywhere. Everything runs locally in your browser.

---

## 📄 License

MIT
