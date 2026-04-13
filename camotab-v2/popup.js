// CamoTab Popup v2

let currentTab = null;
let currentDisguise = null;
let allPresets = [];

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tab;

  // Load presets from background
  chrome.runtime.sendMessage({ type: "GET_PRESETS" }, (res) => {
    allPresets = res?.presets || [];
    buildPresets(allPresets);
  });

  // Check if already disguised
  chrome.runtime.sendMessage({ type: "GET_DISGUISE", tabId: tab.id }, (disguise) => {
    if (disguise) showDisguise(disguise);
    else clearDisguise();
  });

  // Search filter
  document.getElementById("searchInput").addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = q ? allPresets.filter(p => p.title.toLowerCase().includes(q)) : allPresets;
    buildPresets(filtered);
  });
}

function showDisguise(disguise) {
  currentDisguise = disguise;
  document.getElementById("disguiseTitle").textContent = disguise.title;
  document.getElementById("disguiseCard").classList.add("visible");
  document.getElementById("statusPill").textContent = "Active";
  document.getElementById("statusPill").className = "status-pill on";
  document.getElementById("btnRemove").style.display = "flex";
}

function clearDisguise() {
  currentDisguise = null;
  document.getElementById("disguiseCard").classList.remove("visible");
  document.getElementById("statusPill").textContent = "Inactive";
  document.getElementById("statusPill").className = "status-pill off";
  document.getElementById("btnRemove").style.display = "none";
  document.getElementById("customInput").value = "";
}

function buildPresets(presets) {
  const panel = document.getElementById("presetsPanel");
  if (!presets.length) {
    panel.innerHTML = `<div class="no-results">No matches found</div>`;
    return;
  }
  panel.innerHTML = presets.map((p, i) => `
    <div class="preset-item" data-index="${i}" data-title="${escapeHtml(p.title)}" data-favicon="${escapeHtml(p.favicon)}">
      <img class="preset-favicon" src="${escapeHtml(p.favicon)}" alt="" onerror="this.style.display='none'" />
      <div class="preset-texts">
        <div class="preset-title">${escapeHtml(p.title)}</div>
      </div>
    </div>
  `).join("");

  panel.querySelectorAll(".preset-item").forEach(el => {
    el.addEventListener("click", () => {
      const disguise = { title: el.dataset.title, favicon: el.dataset.favicon };
      applyDisguise(disguise);
    });
  });
}

function escapeHtml(str) {
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function applyDisguise(disguise) {
  chrome.runtime.sendMessage({
    type: "APPLY_DISGUISE",
    tabId: currentTab.id,
    disguise
  }, () => showDisguise(disguise));
}

// Apply custom title — if empty, pick random preset
document.getElementById("btnApply").addEventListener("click", () => {
  const val = document.getElementById("customInput").value.trim();
  if (!val) {
    if (!allPresets.length) return;
    const random = allPresets[Math.floor(Math.random() * allPresets.length)];
    applyDisguise(random);
    return;
  }
  const randomFavicon = allPresets[Math.floor(Math.random() * allPresets.length)]?.favicon || "";
  applyDisguise({ title: val, favicon: randomFavicon });
});

document.getElementById("customInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("btnApply").click();
});

// Remove button
document.getElementById("btnRemove").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "REMOVE_DISGUISE", tabId: currentTab.id }, clearDisguise);
});

// Presets toggle
document.getElementById("btnPresets").addEventListener("click", () => {
  const panel = document.getElementById("presetsPanel");
  const searchRow = document.getElementById("searchRow");
  const isOpen = panel.classList.toggle("open");
  searchRow.classList.toggle("open", isOpen);
  if (isOpen) document.getElementById("searchInput").focus();
});

// Panic button
document.getElementById("btnPanic").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "PANIC_ALL" }, () => {
    const btn = document.getElementById("btnPanic");
    btn.textContent = "✓ All Tabs Disguised";
    btn.style.color = "var(--green)";
    btn.style.borderColor = "rgba(0,232,122,0.4)";
    setTimeout(window.close, 1200);
  });
});

init();
