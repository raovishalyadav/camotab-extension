// CamoTab Background Service Worker v4

const DISGUISE_PRESETS = [
  { title: "Q3 Budget Review — Google Sheets",        favicon: "https://ssl.gstatic.com/docs/spreadsheets/favicon3.ico" },
  { title: "Annual Report Draft — Google Docs",       favicon: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico" },
  { title: "Inbox (14) — Gmail",                      favicon: "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico" },
  { title: "Product Roadmap — Google Slides",         favicon: "https://ssl.gstatic.com/docs/presentations/images/favicon5.ico" },
  { title: "Team Drive — Google Drive",               favicon: "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png" },
  { title: "Q4 Planning — Google Calendar",           favicon: "https://calendar.google.com/googlecalendar/images/favicons_2020q4/calendar_4.ico" },
  { title: "Meet — Weekly Sync Call",                 favicon: "https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v1/web-32dp/logo_meet_2020q4_color_2x_web_32dp.png" },
  { title: "Sprint 47 Board — Jira",                  favicon: "https://jira.atlassian.com/favicon.ico" },
  { title: "PROJ-2341 — Fix auth token expiry — Jira",favicon: "https://jira.atlassian.com/favicon.ico" },
  { title: "Engineering Wiki — Confluence",           favicon: "https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png" },
  { title: "Onboarding Docs — Confluence",            favicon: "https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png" },
  { title: "Release Notes v3.2 — Confluence",         favicon: "https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png" },
  { title: "Backend Monorepo — Bitbucket",            favicon: "https://bitbucket.org/favicon.ico" },
  { title: "PR #512 — refactor: auth middleware — GitHub", favicon: "https://github.com/favicon.ico" },
  { title: "Issues · org/platform — GitHub",          favicon: "https://github.com/favicon.ico" },
  { title: "Actions — CI/CD Pipeline — GitHub",       favicon: "https://github.com/favicon.ico" },
  { title: "MR !88 — feature/onboarding-v2 — GitLab", favicon: "https://gitlab.com/favicon.ico" },
  { title: "Pipeline #4421 — GitLab CI",              favicon: "https://gitlab.com/favicon.ico" },
  { title: "Slack | #engineering-backend",            favicon: "https://slack.com/favicon.ico" },
  { title: "Slack | #product-team",                   favicon: "https://slack.com/favicon.ico" },
  { title: "Slack | Direct Message — Sarah K.",       favicon: "https://slack.com/favicon.ico" },
  { title: "Microsoft Teams — Dev Standup",           favicon: "https://teams.microsoft.com/favicon.ico" },
  { title: "Microsoft Teams — #announcements",        favicon: "https://teams.microsoft.com/favicon.ico" },
  { title: "Q2 OKRs — Notion",                        favicon: "https://www.notion.so/images/favicon.ico" },
  { title: "Engineering Handbook — Notion",           favicon: "https://www.notion.so/images/favicon.ico" },
  { title: "Sprint Tracker — Notion",                 favicon: "https://www.notion.so/images/favicon.ico" },
  { title: "ENG-419 — Migrate legacy endpoints — Linear", favicon: "https://linear.app/favicon.ico" },
  { title: "Roadmap Q3–Q4 — Linear",                  favicon: "https://linear.app/favicon.ico" },
  { title: "Product Spec — Coda",                     favicon: "https://coda.io/favicon.ico" },
  { title: "Zoom — Engineering All-Hands",            favicon: "https://st1.zoom.us/zoom.ico" },
  { title: "Zoom — Sprint Retrospective",             favicon: "https://st1.zoom.us/zoom.ico" },
  { title: "Zoom — 1:1 with Manager",                 favicon: "https://st1.zoom.us/zoom.ico" },
  { title: "Budget FY25 — Excel Online",              favicon: "https://res-1.cdn.office.net/files/fabric-cdn-prod_20230921.001/assets/brand-icons/product/png/excel_32x1.png" },
  { title: "Company Deck Q3 — PowerPoint Online",     favicon: "https://res-1.cdn.office.net/files/fabric-cdn-prod_20230921.001/assets/brand-icons/product/png/powerpoint_32x1.png" },
  { title: "PRD v2.1 — Word Online",                  favicon: "https://res-1.cdn.office.net/files/fabric-cdn-prod_20230921.001/assets/brand-icons/product/png/word_32x1.png" },
  { title: "Shared Inbox — Outlook",                  favicon: "https://outlook.live.com/favicon.ico" },
  { title: "Calendar — Outlook",                      favicon: "https://outlook.live.com/favicon.ico" },
  { title: "EC2 Instances — AWS Console",             favicon: "https://a0.awsstatic.com/libra-css/images/site/fav/favicon.ico" },
  { title: "Cloud Functions — GCP Console",           favicon: "https://www.gstatic.com/devrel-devsite/prod/v45f61267e9c0e7d8bfa37d12c4d12a97/cloud/images/favicons/onecloud/favicon.ico" },
  { title: "App Service — Azure Portal",              favicon: "https://portal.azure.com/favicon.ico" },
  { title: "Logs — Datadog",                          favicon: "https://imgix.datadoghq.com/img/favicons/favicon-32x32.png" },
  { title: "Service Map — Datadog APM",               favicon: "https://imgix.datadoghq.com/img/favicons/favicon-32x32.png" },
  { title: "Alerts — PagerDuty",                      favicon: "https://www.pagerduty.com/favicon.ico" },
  { title: "Incidents — PagerDuty",                   favicon: "https://www.pagerduty.com/favicon.ico" },
  { title: "platform/src/auth — VS Code Web",         favicon: "https://vscode.dev/favicon.ico" },
  { title: "README.md — VS Code Web",                 favicon: "https://vscode.dev/favicon.ico" },
  { title: "Design System v4 — Figma",                favicon: "https://static.figma.com/app/icon/1/favicon.ico" },
  { title: "Onboarding Flow Redesign — Figma",        favicon: "https://static.figma.com/app/icon/1/favicon.ico" },
  { title: "Pipeline — Salesforce CRM",               favicon: "https://www.salesforce.com/favicon.ico" },
  { title: "Account: Acme Corp — Salesforce",         favicon: "https://www.salesforce.com/favicon.ico" },
  { title: "Contacts — HubSpot CRM",                  favicon: "https://www.hubspot.com/favicon.ico" },
  { title: "Issues — Sentry Production",              favicon: "https://sentry.io/favicon.ico" },
  { title: "Performance — Sentry",                    favicon: "https://sentry.io/favicon.ico" },
  { title: "Deployments — Vercel Dashboard",          favicon: "https://vercel.com/favicon.ico" },
  { title: "Deploy Preview — Netlify",                favicon: "https://www.netlify.com/favicon/icon.png" },
  { title: "All Projects — Asana",                    favicon: "https://asana.com/favicon.ico" },
  { title: "Sprint Tasks — Asana",                    favicon: "https://asana.com/favicon.ico" },
  { title: "All Hands Agenda — Dropbox Paper",        favicon: "https://www.dropbox.com/static/images/favicon.ico" },
  { title: "Postman — API Testing",                   favicon: "https://www.postman.com/favicon-32x32.png" },
  { title: "Dashboard — Mixpanel",                    favicon: "https://mixpanel.com/favicon.ico" },
  { title: "Funnels — Amplitude",                     favicon: "https://amplitude.com/favicon.ico" },
  { title: "Board — Trello",                          favicon: "https://trello.com/favicon.ico" },
  { title: "Interview Schedule — Greenhouse",         favicon: "https://www.greenhouse.io/favicon.ico" },
  { title: "Time Entries — Toggl Track",              favicon: "https://toggl.com/favicon.ico" },
];

// ── Storage helpers ──────────────────────────────────────────────────────────

async function getStoredDisguises() {
  return new Promise(resolve => {
    chrome.storage.local.get("tabDisguises", d => resolve(d.tabDisguises || {}));
  });
}
async function setStoredDisguise(tabId, disguise) {
  const all = await getStoredDisguises();
  all[String(tabId)] = disguise;
  await chrome.storage.local.set({ tabDisguises: all });
}
async function removeStoredDisguise(tabId) {
  const all = await getStoredDisguises();
  delete all[String(tabId)];
  await chrome.storage.local.set({ tabDisguises: all });
}

// ── Original tab info (title + favicon) saved BEFORE first disguise ──────────
async function getStoredOriginals() {
  return new Promise(resolve => {
    chrome.storage.local.get("tabOriginals", d => resolve(d.tabOriginals || {}));
  });
}
async function setStoredOriginal(tabId, original) {
  const all = await getStoredOriginals();
  // Never overwrite — once saved, the original is locked
  if (all[String(tabId)]) return;
  all[String(tabId)] = original;
  await chrome.storage.local.set({ tabOriginals: all });
}
async function removeStoredOriginal(tabId) {
  const all = await getStoredOriginals();
  delete all[String(tabId)];
  await chrome.storage.local.set({ tabOriginals: all });
}

// ── Message handler ──────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "GET_DISGUISE") {
    const tabId = sender.tab?.id || msg.tabId;
    getStoredDisguises().then(all => sendResponse(all[String(tabId)] || null));
    return true;
  }

  if (msg.type === "APPLY_DISGUISE") {
    // Snapshot original BEFORE saving disguise
    chrome.tabs.get(msg.tabId, async (tab) => {
      await setStoredOriginal(msg.tabId, {
        title: tab.title || "",
        favicon: tab.favIconUrl || ""
      });
      await setStoredDisguise(msg.tabId, msg.disguise);
      applyDisguise(msg.tabId, msg.disguise);
      sendResponse({ ok: true });
    });
    return true;
  }

  if (msg.type === "REMOVE_DISGUISE") {
    removeStoredDisguise(msg.tabId).then(async () => {
      const all = await getStoredOriginals();
      const original = all[String(msg.tabId)] || null;
      removeDisguise(msg.tabId, original);
      // Clear original so next apply can re-snapshot
      await removeStoredOriginal(msg.tabId);
      sendResponse({ ok: true });
    });
    return true;
  }

  if (msg.type === "GET_ORIGINAL") {
    const tabId = sender.tab?.id;
    getStoredOriginals().then(all => sendResponse(all[String(tabId)] || null));
    return true;
  }

  if (msg.type === "GET_PRESETS") {
    sendResponse({ presets: DISGUISE_PRESETS });
    return false;
  }

  if (msg.type === "PANIC_ALL") {
    panicDisguiseAllTabs().then(() => sendResponse({ ok: true }));
    return true;
  }

  return true;
});

// ── Re-apply on navigation ────────────────────────────────────────────────────

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status !== "loading" && changeInfo.status !== "complete") return;
  const all = await getStoredDisguises();
  const disguise = all[String(tabId)];
  if (!disguise) return;
  if (changeInfo.status === "complete") {
    setTimeout(() => applyDisguise(tabId, disguise), 300);
    setTimeout(() => applyDisguise(tabId, disguise), 1200);
  }
});

// ── Apply disguise ────────────────────────────────────────────────────────────

function applyDisguise(tabId, disguise) {
  chrome.scripting.executeScript({
    target: { tabId },
    func: (d) => {
      const titleEl = document.querySelector("title");
      if (titleEl && !titleEl.dataset.original) titleEl.dataset.original = titleEl.textContent;
      document.title = d.title;

      document.querySelectorAll(
        "link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon'], " +
        "link[rel='fluid-icon'], link[rel='mask-icon'], link[rel*='icon']"
      ).forEach(el => { if (el.id !== "camotab-favicon") el.remove(); });

      let link = document.getElementById("camotab-favicon");
      if (!link) {
        link = document.createElement("link");
        link.id = "camotab-favicon";
        link.rel = "icon";
        link.type = "image/x-icon";
        document.head.appendChild(link);
      }
      link.href = d.favicon;
      window.dispatchEvent(new CustomEvent("camotab-update", { detail: d }));
    },
    args: [disguise]
  }).catch(() => {});
}

// ── Remove disguise — pass original back to content script ───────────────────

function removeDisguise(tabId, original) {
  chrome.scripting.executeScript({
    target: { tabId },
    func: (original) => {
      window.dispatchEvent(new CustomEvent("camotab-remove", { detail: original }));
    },
    args: [original]
  }).catch(() => {});
}

// ── Panic ─────────────────────────────────────────────────────────────────────

async function panicDisguiseAllTabs() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const all = await getStoredDisguises();
  for (let i = 0; i < tabs.length; i++) {
    const tab = tabs[i];
    if (!all[String(tab.id)]) {
      await setStoredOriginal(tab.id, { title: tab.title || "", favicon: tab.favIconUrl || "" });
      const preset = DISGUISE_PRESETS[i % DISGUISE_PRESETS.length];
      await setStoredDisguise(tab.id, preset);
      applyDisguise(tab.id, preset);
    }
  }
}

// ── Keyboard shortcut ─────────────────────────────────────────────────────────

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "panic-disguise") {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;
    const all = await getStoredDisguises();
    if (all[String(tab.id)]) {
      const originals = await getStoredOriginals();
      const original = originals[String(tab.id)] || null;
      await removeStoredDisguise(tab.id);
      await removeStoredOriginal(tab.id);
      removeDisguise(tab.id, original);
    } else {
      await setStoredOriginal(tab.id, { title: tab.title || "", favicon: tab.favIconUrl || "" });
      const preset = DISGUISE_PRESETS[Math.floor(Math.random() * DISGUISE_PRESETS.length)];
      await setStoredDisguise(tab.id, preset);
      applyDisguise(tab.id, preset);
    }
  }
});

// ── Cleanup ───────────────────────────────────────────────────────────────────

chrome.tabs.onRemoved.addListener((tabId) => {
  removeStoredDisguise(tabId);
  removeStoredOriginal(tabId);
});
